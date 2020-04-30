import * as admin from 'firebase-admin';

export class Context{
    public static ORDERS_COLLECTION: string = 'orders';
    public static USERS_COLLECTION: string = 'users';
    public static MAKERS_COLLECTION: string = 'makers';
    public static MAKERS_PRODUCTS_COLLECTION: string = 'products';

    private _db: admin.firestore.Firestore|null = null;

    db(db :admin.firestore.Firestore|null = null): admin.firestore.Firestore{
        if(db){
            this._db = db;
        }
        return this._db as any;
    }
}

export default new Context();