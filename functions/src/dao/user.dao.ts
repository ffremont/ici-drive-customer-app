import context, { Context } from "../context";
import { User } from "../models/user";

export class UserDao{
    public async get(id:string): Promise<User|null>{
        if(!id){ return null;}

        const customerDoc = await context.db().collection(Context.USERS_COLLECTION).doc(id).get();
        if (customerDoc.exists) {
            return (customerDoc.data() as User) || null;
        } else {
            return null;
        }
    }
}