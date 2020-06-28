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
     * Retourne les commandes PENDING / VERIFIED qui sont passées ou prévues dans les 3h.
     */
    public async getExpiredOrderWithoutConfirmation(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', 'in', [OrderState.PENDING, OrderState.VERIFIED])
        .where('slot', '<', nowTs + Config.expireWithoutConfirmHours*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return (AppUtil.arrOfSnap(snap) as Order[]).filter(order => {
            return (order.maker as any).startDriveAfterDays <= Config.enableOrderConfirmAfterDays;
        });  
    }

    /**
     * retourne les réservations PENDING/VERIFIED "longue" prévues dans les 48h et passées
     * 
     */
    public async getExpiredOrderWithConfirmation(): Promise<Order[]>{
        const nowTs = (new Date()).getTime();

        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', 'in', [OrderState.PENDING, OrderState.VERIFIED])
        .where('slot', '<', nowTs + Config.expireWithConfirmHours*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return (AppUtil.arrOfSnap(snap) as Order[]).filter(order => {
            return (order.maker as any).startDriveAfterDays > Config.enableOrderConfirmAfterDays;
        });  
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