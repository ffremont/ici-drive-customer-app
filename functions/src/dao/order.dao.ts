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
     * Si la commande rapide "PENDING" a été créé il y a plus de X heures
     * ELLE EST EXPIREE
     */
    public async getExpiredShortOrder(nowTs:number): Promise<Order[]>{
        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', 'in', [OrderState.PENDING])
        .where('created', '<', nowTs - Config.verifyOrderForShortOrderHours*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return (AppUtil.arrOfSnap(snap) as Order[]).filter(order => {
            
            const delta = (order.slot||0) - order.created;
            AppUtil.debug(order.id,(delta < (Config.enableOrderConfirmAfterDays*24*3600000) ));
            return (delta > 0) && (delta < (Config.enableOrderConfirmAfterDays*24*3600000));
        });  
    }

     /**
     * Si la commande long "PENDING" doit être vérifiée 3j avant la date de retrait / liv.
     * ELLE EST EXPIREE
     */
    public async getExpiredLongOrder(nowTs:number = 0): Promise<Order[]>{
        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', 'in', [OrderState.PENDING])
        .where('slot', '<', nowTs + Config.verifyOrderForLongOrderHours*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return (AppUtil.arrOfSnap(snap) as Order[]).filter(order => {
            const delta = (order.slot||0) - order.created;
            AppUtil.debug(order.id,delta,  (delta >= (Config.enableOrderConfirmAfterDays*24*3600000)));
            return (delta > 0) && (delta >= (Config.enableOrderConfirmAfterDays*24*3600000));
        });  
    }

    /**
     * Si la commande long "VERIFIE" doit être confirmée par le client 2j avant la date de retrait / liv.
     * 
     */
    public async getExpiredLongOrderNotConfirmedByCustomer(nowTs:number): Promise<Order[]>{
        const snap = await context.db().collection(Context.ORDERS_COLLECTION)
        .where('status', 'in', [OrderState.VERIFIED])
        .where('slot', '<', nowTs + Config.confirmOrderForLongOrderHours*3600000)
        .limit(Config.limitBatchSchedule)
        .get();
        return (AppUtil.arrOfSnap(snap) as Order[]).filter(order => {
            const delta = (order.slot||0) - order.created;
            return (delta > 0) && (delta >= (Config.enableOrderConfirmAfterDays*24*3600000));
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