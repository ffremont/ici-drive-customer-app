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
     * Order réalisée il y a plus de 72h
     */
    public async getPendingTooOld(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', '==', OrderState.PENDING)
        .where('created', '<', nowTs - Config.pendingExpireAfter*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return AppUtil.arrOfSnap(snap) as Order[];  
    }


    public async getConfirmedTooOld(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', '==', OrderState.CONFIRMED)
        .where('updated', '<', nowTs - Config.confirmedExpireAfter*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return AppUtil.arrOfSnap(snap) as Order[];  
    }

    /**
     * Order dont le drive est prévu dans - de 12h
     */
    public async getConfirmedComingSoon(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', '==', OrderState.CONFIRMED)
        .where('slot', '>', nowTs - Config.confirmedExpireComingSoon*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return AppUtil.arrOfSnap(snap) as Order[];  
    }

    /**
     * Order dont le drive est prévu dans - de 18h
     */
    public async getPendingComingSoon(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', '==', OrderState.PENDING)
        .where('slot', '>', nowTs - Config.pendingExpireComingSoon*3600000)
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
}