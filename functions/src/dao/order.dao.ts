import { Order } from "../models/order";
import context, { Context } from "../context";
import { AppUtil } from "../apputil";

export class OrderDao{
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