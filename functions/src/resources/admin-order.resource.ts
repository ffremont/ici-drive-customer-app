import { Request, Response } from 'express';
import { AppUtil } from "../apputil";
import { OrderDao } from '../dao/order.dao';
import { MakerDao } from '../dao/maker.dao';
import { Order } from '../models/order';
import notifService from '../services/notif.service';

export class AdminOrderResource{

    private myOrderDao = new OrderDao();
    private makerDao = new MakerDao();

    public async updateOrder(request: Request, response: Response) {
        try{
            const currentMakerEmail = await AppUtil.authorized(request);
            if (currentMakerEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const orderId = request.params.id;
            if(!orderId){ throw 'Identifiant invalide'}

            const data = await Promise.all([
                this.myOrderDao.get(orderId),
                this.makerDao.getByEmail(currentMakerEmail)
                ]);
            const originalOrder : any = data[0];
            const currentMaker : any = data[1];

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
            originalOrder.maker = currentMaker;
            await notifService.applyTransition(
                null, 
                originalOrder?.status as any, 
                {...originalOrder, ...modification
            });
            await this.myOrderDao.update(orderId, modification);

            AppUtil.ok(response);
        }catch(e){
            AppUtil.error(e);
        }
    }

    /**
     * Retourne la liste des commandes pour le producteur
     * @param request 
     * @param response 
     */
    public async getOrders(request: Request, response: Response) {
        try{
            const currentMakerEmail = await AppUtil.authorized(request);
            if (currentMakerEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const orders = await this.myOrderDao.getAllByMaker(currentMakerEmail);

            AppUtil.ok(response, orders);
        }catch(e){
            AppUtil.error(e);
        }
    }

    public async getOrder(request: Request, response: Response) {
        try{
            const orderId = request.params.id;
            if(!orderId){ throw 'Identifiant invalide'}

            const currentMakerEmail = await AppUtil.authorized(request);
            if (currentMakerEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const order = await this.myOrderDao.get(orderId);
            if(order?.maker?.email !==currentMakerEmail){
                AppUtil.badRequest(response, `emails ne correspondent pas (producteur et accès)` ); return;
            }

            AppUtil.ok(response, order);
        }catch(e){
            AppUtil.error(e);
        }
    }
}

export default new AdminOrderResource();