import * as admin from 'firebase-admin';

export class Context{
    public static MAKERS_COLLECTION: string = 'makers';

    private _db: admin.firestore.Firestore|null = null;

    db(db :admin.firestore.Firestore|null = null): admin.firestore.Firestore{
        if(db){
            this._db = db;
        }
        return this._db as any;
    }
}

export default new Context();