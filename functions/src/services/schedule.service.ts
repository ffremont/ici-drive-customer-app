import {OrderDao} from '../dao/order.dao';
import context, { Context } from '../context';
import { OrderState } from '../models/order';
import notifService from '../services/notif.service';
import { UserDao } from '../dao/user.dao';
import { AppUtil } from '../apputil';
import { Config } from '../config';

export class ScheduleService{
    private orderDao = new OrderDao();
    private userDao = new UserDao();

    /**
     * Annulation des commandes confirmées moins de 48h avant le retrait
     */
    public async comfirmedExpiration(){
        AppUtil.debug('comfirmedExpiration...');
        const nowTo = (new Date()).getTime();
        const orders = (await this.orderDao.getConfirmedRecently()).filter(order => {
            return order.slot ? order.slot < (nowTo + Config.confirmedExpireWindowInHours*3600000) : false;
        });

        const batch = context.db().batch();

        orders.forEach(order => {
            if(order.id){
                AppUtil.debug(`update ${order.id} with status CANCELLED, reasonOf : ${Config.comfirmedExpirationReason(order)}`);

                const ref = context.db().collection(Context.ORDERS_COLLECTION).doc(order.id);
                batch.update(ref, { status : OrderState.CANCELLED, updated:nowTo, reasonOf: Config.comfirmedExpirationReason(order) });
            }            
        });
        
        try{
            await batch.commit();

            const promises = [];
            for(let i = 0; i<orders.length;i++){
                const o = orders[i] as any;
                o.status = OrderState.CANCELLED;
                o.updated = nowTo;

                const user = await this.userDao.get(o.customer?.email);
                promises.push(notifService.applyTransition(user?.fcm || null, OrderState.CONFIRMED, o ));
            }
            await Promise.all(promises);
            AppUtil.info('PENDING EXPIRATION OK')
        }catch(e){
            AppUtil.error('pendingExpiration commit or notify ko',e);
        }
    }

    /**
     * Annulation des commandes trop vieilles ou sur le point d'être prévues
     */
    public async pendingExpiration(){
        AppUtil.debug('pendingExpiration...');
        const nowTo = (new Date()).getTime();
        let orders = (await this.orderDao.getPendingTooOld());
        orders = orders.concat(await this.orderDao.getPendingComingSoon());

        const batch = context.db().batch();

        orders.forEach(order => {
            if(order.id){
                AppUtil.debug(`update ${order.id} with status CANCELLED : `+Config.pendingExpirationReason(order));
                //const ref = context.db().collection(Context.ORDERS_COLLECTION).doc(order.id);
                //batch.update(ref, { status : OrderState.CANCELLED, updated:nowTo, reasonOf: Config.pendingExpirationReason(order) });
            }            
        });
        
        try{
            await batch.commit();

            const promises = [];
            for(let i = 0; i<orders.length;i++){
                const o = orders[i] as any;
                o.status = OrderState.CANCELLED;
                o.updated = nowTo;

                const user = await this.userDao.get(o.customer?.email);
                promises.push(notifService.applyTransition(user?.fcm || null, OrderState.PENDING, o ));
            }
            await Promise.all(promises);
            AppUtil.info('PENDING EXPIRATION OK')
        }catch(e){
            AppUtil.error('pendingExpiration commit or notify ko',e);
        }
    }
}

export default new ScheduleService();