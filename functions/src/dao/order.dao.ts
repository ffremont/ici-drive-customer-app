import { Order, OrderState } from "../models/order";
import context, { Context } from "../context";
import { AppUtil } from "../apputil";
import { Config } from "../config";


export class OrderDao{
    public async update(id:string, order:any): Promise<Order>{
        if(!id || !order){ throw "update invalide"}

        await context.db().collection(Context.ORDERS_COLLECTION).doc(id).update(order);
        return order;        
    }

    /**
     * ça doit être vérifier au moins 72h avant
     * Tout ce qui est prévu dans les 72h
     */
    public async getPendingTooShort(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', '==', OrderState.PENDING)
        .where('slot', '<', nowTs + Config.pendingExpireAfter*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return AppUtil.arrOfSnap(snap) as Order[];  
    }

    /**
     * liste des commandes devant être retiré dans les "reminderNext" heures
     */
    public async nextOrders(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', '==', OrderState.CONFIRMED)
        .where('slot', '<', nowTs + Config.reminderNext*3600000)
        .where('slot', '>', nowTs)
        .limit(Config.limitBatchSchedule)
        .get();
        return AppUtil.arrOfSnap(snap) as Order[];  
    }

    /**
     * Commandes confirmées de - de 48h
     */
    public async getConfirmedRecently(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        AppUtil.debug({status:OrderState.CONFIRMED, op:'updated >', value :nowTs - (Config.confirmedExpireAfter - Config.confirmedExpireWindowInHours)*3600000})
        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', '==', OrderState.CONFIRMED)
        .where('updated', '>', nowTs - Config.confirmedExpireAfter*3600000) // toutes les commandes confirmées il y a - de 48h
        .limit(Config.limitBatchSchedule)
        .get();
        AppUtil.debug('getConfirmedRecently.lenth '+snap.size);
        return AppUtil.arrOfSnap(snap) as Order[];  
    }

    /**
     * ça doit être vérifier au moins 48h avant
     * @deprecated
     */
    public async getPendingComingSoon(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', '==', OrderState.PENDING)
        .where('slot', '<', nowTs + Config.confirmedExpireAfter*3600000) // 
        .limit(Config.limitBatchSchedule)
        .get();
        return AppUtil.arrOfSnap(snap) as Order[];  
    }

    public async get(id:string): Promise<Order|null>{
        if(!id){ return null;}

        const orderDoc = await context.db().collection(Context.ORDERS_COLLECTION).doc(id).get();
        if (orderDoc.exists) {
            return (orderDoc.data() as Order) || null;
        } else {
            return null;
        }
    }

    public async getAllByCustomer(email:string){
        const snap = await context.db().collection(Context.ORDERS_COLLECTION).where('customer.email', '==', email).get();
        return AppUtil.arrOfSnap(snap) as Order[];
    }

    public async getAllByMaker(email:string){
        const snap = await context.db().collection(Context.ORDERS_COLLECTION).where('maker.email', '==', email).get();
        return AppUtil.arrOfSnap(snap) as Order[];
    }
}