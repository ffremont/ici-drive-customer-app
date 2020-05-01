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
            if (request.method.toUpperCase() !== 'GET') {
                AppUtil.methodNotAllowed(response); return;
            }
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
            if (request.method.toUpperCase() !== 'GET') {
                AppUtil.methodNotAllowed(response); return;
            }
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const urlPieces = request.path.split('/');
            const orderId = urlPieces[urlPieces.length - 1];
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
            if (request.method.toUpperCase() !== 'PUT') {
                AppUtil.methodNotAllowed(response); return;
            }
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const urlPieces = request.path.split('/');
            const orderId = urlPieces[urlPieces.length - 1];
            if(!orderId){ throw 'Identifiant invalide'}

            const order = request.body as Order;
            const modification :any = {};
            if(order.reasonOf){
                modification.reasonOf = order.reasonOf;
            }
            if(order.status){
                modification.status = order.status;
            }else{
                AppUtil.badRequest(response, 'Contenu de modification invalide');
            }

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
            if (request.method.toUpperCase() !== 'POST') {
                AppUtil.methodNotAllowed(response); return;
            }

            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const order:Order = request.body as Order;
            const dbMaker = await this.makerDao.getFull(order.maker?.id || '') as Maker;
            const dbUser = await this.userDao.get(order.customer?.email || '');
            if (!dbMaker) {
                AppUtil.badRequest(response); return;
            }
            
            // override
            order.id = uuid();
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

                AppUtil.ok(response, order);
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }

}

export default new MyOrderResource();