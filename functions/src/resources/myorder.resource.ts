import { Request, Response } from 'express';
import { AppUtil } from '../apputil';
import context, { Context } from '../context';
//import * as joi from '@hapi/joi';
import { Order } from '../models/order';
import * as uuid from 'uuid-random';
import { Maker } from '../models/maker';
import { MakerDao } from '../dao/maker.dao';
import { OrderDao } from '../dao/order.dao';
import { UserDao } from '../dao/user.dao';
import notifService from '../services/notif.service';

class MyOrderResource {

    private makerDao = new MakerDao();
    private myOrderDao = new OrderDao();
    private userDao = new UserDao();


    /**
     * Retourne la liste de mes commandes
     * @param request 
     * @param response 
     */
    public async getAll(request: Request, response: Response) {
        try{
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            AppUtil.ok(response, await this.myOrderDao.getAllByCustomer(currentUserEmail));
        }catch(e){
            AppUtil.internalError(response, e);
        }
    }

    /**
     * Retourne la commande du client 
     * 
     * @param request 
     * @param response 
     */
    public async get(request: Request, response: Response) {
        try{
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const orderId = request.params.id;
            if(!orderId){ throw 'Identifiant invalide'}

            const order = await this.myOrderDao.get(orderId) as Order;

            // vérifie que la commande est bien celle faite par le client
            if(!order || (order.customer?.email !== currentUserEmail)){
                AppUtil.badRequest(response); return;
            }

            AppUtil.ok(response, order);
        }catch(e){
            AppUtil.internalError(response, e);
        }
    }

    /**
     * MAJ d'une commande
     * /my-orders/aaaaaa
     * 
     * @param request 
     * @param response 
     */
    public async update(request: Request, response: Response) {
        try{
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const orderId = request.params.id;
            if(!orderId){ throw 'Identifiant invalide'}

            const data = await Promise.all([
                this.myOrderDao.get(orderId),
                this.userDao.get(currentUserEmail)
                ]);
            const originalOrder : any = data[0];
            const currentUser : any = data[1];

            const order = request.body as Order;
            const modification :any = {
                updated: (new Date()).getTime()
            };
            if(order.reasonOf){
                modification.reasonOf = order.reasonOf;
            }
            if(order.status){
                modification.status = order.status;
            }else{
                AppUtil.badRequest(response, 'Contenu de modification invalide');
            }
            
            // refresh maker with fcm
            originalOrder.maker = await this.makerDao.get(originalOrder.maker.id);
            await notifService.applyTransition(
                currentUser && currentUser.fcm ? currentUser.fcm : null, 
                originalOrder?.status as any, 
                {...originalOrder, ...modification
            });
            await this.myOrderDao.update(orderId, modification);

            AppUtil.ok(response);
        }catch(e){
            AppUtil.internalError(response, e);
        }
    }

    /**
     * /my-
     * Retourne la liste des producteurs à partir de critères
     * 
     * @param request 
     * @param response 
     */
    public async newCart(request: Request, response: Response) {
        try {
            AppUtil.debug('newcart');
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const order:Order = request.body as Order;
            AppUtil.debug('new Order', order);
            const data = await Promise.all([
                this.makerDao.getFull(order.maker?.id || ''), 
                this.userDao.get(order.customer?.email || '')])
            const dbMaker = data[0] as Maker;
            const dbUser = data[1];
            if (!dbMaker) {
                AppUtil.badRequest(response); return;
            }
            
            // override
            order.id = uuid();
            order.updated = (new Date()).getTime();
            order.customer = dbUser || {email:currentUserEmail};
            order.ref = `${dbMaker.prefixOrderRef}_${(new Date()).getTime()}`;
            if(order.maker?.email !== dbMaker.email){
                AppUtil.badRequest(response); return;
            }

            order.maker = dbMaker;
            order.total = order.choices
                .map( (pc: any) => {
                    pc.product = dbMaker.products?.find(p => p.ref === pc.product.ref) || null ;
                    return pc;
                })
                .filter(pc => pc.product !== null)
                .map(pc => pc.quantity * pc.product.price)
                .reduce((acc, cv) => acc + cv, 0);
            
                const myRef = await context.db().collection(Context.ORDERS_COLLECTION).doc(order.id);
                await myRef.set(order);

                AppUtil.info('mémorisation de la commande');
                await notifService.applyTransition(dbUser && dbUser.fcm ? dbUser.fcm : null, 'init', order);

                AppUtil.ok(response, order);
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }

}

export default new MyOrderResource();