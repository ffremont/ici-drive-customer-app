import httpClientService from './http-client.service';
import conf from '../confs';
import myProfilStore from '../stores/my-profil';
import { User } from '../models/user';

export class FcmService {
    fcm: string = '';
    lastFcm: string = '';
    messaging: any;
    isInit = false;

    public init() {
        if(this.isInit){return;}
        this.isInit = true;

        if ((window as any).firebase) {
            this.messaging = (window as any).firebase.messaging();
            // Add the public key generated from the console here.
            this.messaging.usePublicVapidKey(conf.fcmPublicVapidKey);
            this.messaging.onMessage(this.onMessage.bind(this));
            this.messaging.onTokenRefresh(this.onTokenRefresh.bind(this));
        }

        setTimeout(() => {
            // à chaque rechargement de l'utilisateur, on met à jour le refresh s'il a changé
            myProfilStore.subscribe((myProfil: User) => {
                if (this.lastFcm !== this.fcm) {
                    this.lastFcm = this.fcm;
                    myProfil.fcm = this.fcm;

                    httpClientService.axios.put(conf.API.myProfil(), myProfil).catch((e: any) => console.log(e));
                }
            })
        }, 0);
    }

    onTokenRefresh() {
        this.messaging.getToken().then((refreshedToken: string) => {
            console.log('Token refreshed.');
            this.fcm = refreshedToken;
        }).catch((err: any) => {
            console.log('Unable to retrieve refreshed token ', err);
        });

    }

    onMessage(payload: any) {
        console.log('Message received. ', payload);

    }
}

export default new FcmService();