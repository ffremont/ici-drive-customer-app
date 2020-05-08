import context, { Context } from "../context";
import { User } from "../models/user";

export class UserDao{
    public async update(email:string, user:any): Promise<User>{
        if(!email || !user){ throw "update invalide"}

        await context.db().collection(Context.USERS_COLLECTION).doc(email).set(user);
        return user;        
    }

    public async get(email:string): Promise<User|null>{
        if(!email){ return null;}

        const customerDoc = await context.db().collection(Context.USERS_COLLECTION).doc(email).get();
        if (customerDoc.exists) {
            return (customerDoc.data() as User) || null;
        } else {
            return null;
        }
    }

}