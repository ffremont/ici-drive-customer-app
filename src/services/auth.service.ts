import { User } from "../models/user";
import myProfilStore from '../stores/my-profil';
import { BehaviorSubject } from "rxjs";

export class AuthService{
    public subToken = new BehaviorSubject<string|null>(null);
    public subUser = new BehaviorSubject<User|null>(null);
    public isAuth = false;

    public authenticate(user:User): void {
        this.isAuth = true;
        this.subUser.next(user);

        // provoque la récupération du profil dès qu'on est connecté
        myProfilStore.load();
    }

    public setIdToken(idToken:string){
        this.subToken.next(idToken);
    }

    signout() {
        this.isAuth = false;
        this.subUser.next(null);
        this.subToken.next(null);
        
        if((window as any).firebase){
            (window as any).firebase.auth().signOut();
        }
    }
}

export default new AuthService() ;