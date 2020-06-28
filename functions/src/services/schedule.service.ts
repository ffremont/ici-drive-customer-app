import { OrderDao } from '../dao/order.dao';
import context, { Context } from '../context';
import { OrderState } from '../models/order';
import notifService from '../services/notif.service';
import { UserDao } from '../dao/user.dao';
import { AppUtil } from '../apputil';
import { Config } from '../config';

export class ScheduleService {
    private orderDao = new OrderDao();
    private userDao = new UserDao();

    /**
     * Annulation des commandes confirmées dès 48h, on check que le retrait ne se fait pas mnt
     */
    public async confirmExpiration() {
        AppUtil.debug('confirmExpiration...');
        const nowTo = (new Date()).getTime();
        const orders = await this.orderDao.getExpiredOrderWithConfirmation();

        const batch = context.db().batch();

        orders.forEach(order => {
            if (order.id) {
                AppUtil.debug(`update ${order.id} with status CANCELLED, reasonOf : ${Config.withConfirmExpirationReason}`);

                const ref = context.db().collection(Context.ORDERS_COLLECTION).doc(order.id);
                batch.update(ref, { status: OrderState.CANCELLED, updated: nowTo, reasonOf: Config.withConfirmExpirationReason });
            }
        });

        try {
            await batch.commit();

            const promises = [];
            for (let i = 0; i < orders.length; i++) {
                const o = orders[i] as any;
                const previousStatus = `${o.status}`;
                o.status = OrderState.CANCELLED;
                o.updated = nowTo;
                o.reasonOf = Config.withConfirmExpirationReason;

                const user = await this.userDao.get(o.customer?.email);
                promises.push(notifService.applyTransition(user?.fcm || null, previousStatus, o));
            }
            await Promise.all(promises);
            AppUtil.info('PENDING EXPIRATION OK')
        } catch (e) {
            AppUtil.error('pendingExpiration commit or notify ko', e);
        }
    }

    /**
     * Rappel des commandes prochaines
     */
    public async reminder() {
        const start = new Date(), end = new Date(), now = new Date();
        start.setHours(7); start.setMinutes(0);
        end.setHours(19); end.setMinutes(0);
        if ((start.getTime() < now.getTime()) && (now.getTime() < end.getTime())) {
            let orders = (await this.orderDao.nextOrders()).filter(o => !o.reminder);
            const batch = context.db().batch();

            orders.forEach(order => {
                if (order.id) {
                    AppUtil.debug(`update ${order.id} with status CANCELLED, reasonOf : remind !`);

                    const ref = context.db().collection(Context.ORDERS_COLLECTION).doc(order.id);
                    batch.update(ref, { reminder: true });
                }
            });

            try {
                await batch.commit();

                const promises = [];
                for (let i = 0; i < orders.length; i++) {
                    const o = orders[i] as any;

                    const user = await this.userDao.get(o.customer?.email);
                    promises.push(notifService.remind(o, user?.fcm || null));
                }
                await Promise.all(promises);
                AppUtil.info('REMINDER OK');
            } catch (e) {
                AppUtil.error('REMINDER notify ko', e);
            }
        }else{
            AppUtil.info('Hors plage 7h - 19h pour les rappels')
        }
    }

    /**
     * Annulation des commandes trop vieilles ou sur le point d'être prévues
     */
    public async noConfirmationExpiration() {
        AppUtil.debug('noConfirmationExpiration...');
        const nowTo = (new Date()).getTime();
        let orders = (await this.orderDao.getExpiredOrderWithoutConfirmation());

        const batch = context.db().batch();

        orders.forEach(order => {
            if (order.id) {
                AppUtil.debug(`update ${order.id} with status CANCELLED : ` + Config.noConfirmExpirationReason);
                const ref = context.db().collection(Context.ORDERS_COLLECTION).doc(order.id);

                batch.update(ref, { status: OrderState.CANCELLED, updated: nowTo, reasonOf: Config.noConfirmExpirationReason });
            }
        });

        try {
            await batch.commit();

            const promises = [];
            for (let i = 0; i < orders.length; i++) {
                const o = orders[i] as any;
                const previousStatus = `${o.status}`;
                o.status = OrderState.CANCELLED;
                o.updated = nowTo;
                o.reasonOf = Config.noConfirmExpirationReason;

                const user = await this.userDao.get(o.customer?.email);
                promises.push(notifService.applyTransition(user?.fcm || null, previousStatus, o));
            }
            await Promise.all(promises);
            AppUtil.info('PENDING EXPIRATION OK')
        } catch (e) {
            AppUtil.error('pendingExpiration commit or notify ko', e);
        }
    }
}

export default new ScheduleService();