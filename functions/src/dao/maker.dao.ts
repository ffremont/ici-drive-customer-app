import context, { Context } from "../context";
import { Maker } from "../models/maker";
import { Product } from "../models/product";
import { AppUtil } from "../apputil";

export class MakerDao{

    public async get(id:string): Promise<Maker|null>{
        if(!id){ return null;}

        const makerDoc = await context.db().collection(Context.MAKERS_COLLECTION).doc(id).get();
        if (makerDoc.exists) {
            const maker:Maker = makerDoc.data() as Maker;
            maker.products = [];

            return maker;
        } else {
            return null;
        }
    }

    public async getFull(id:string): Promise<Maker|null>{
        if(!id){ return null;}

        const makerDoc = await context.db().collection(Context.MAKERS_COLLECTION).doc(id).get();
        if (makerDoc.exists) {
            const maker:Maker = makerDoc.data() as Maker;
            const snap = await context.db()
                .collection(Context.MAKERS_COLLECTION)
                .doc(id)
                .collection(Context.MAKERS_PRODUCTS_COLLECTION)
                .get();
            maker.products = AppUtil.arrOfSnap(snap) as Product[];

            return maker;
        } else {
            return null;
        }
    }

    public async getFullByEmail(email:string): Promise<Maker|null>{
        if(!email){ return null;}

        const makerRef = await context.db().collection(Context.MAKERS_COLLECTION).where('email', '==', email).limit(1).get();
        if (!makerRef.empty) {
            const res = AppUtil.arrOfSnap(makerRef);
            const maker:Maker = res[0] as Maker;
            const snap = await context.db()
                .collection(Context.MAKERS_COLLECTION)
                .doc(maker.id)
                .collection(Context.MAKERS_PRODUCTS_COLLECTION)
                .get();
            maker.products = AppUtil.arrOfSnap(snap) as Product[];

            return maker;
        } else {
            return null;
        }
    }
}