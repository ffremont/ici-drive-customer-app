import { User } from "../models/user";
import { BehaviorSubject } from "rxjs";

class AuthService{
    public subToken = new BehaviorSubject<string|null>(null);
    public subUser = new BehaviorSubject<User|null>(null);
    public isAuth = false;

    public authenticate(user:User): void {
        this.isAuth = true;
        this.subUser.next(user);
    }

    public setIdToken(idToken:string){
        this.subToken.next(idToken);
    }

    signout() {
        this.isAuth = false;
        this.subUser.next(null);
        this.subToken.next(null);
    }
}


export default new AuthService() ;