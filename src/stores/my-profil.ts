import {BehaviorSubject, Subscription} from 'rxjs';
import { Store } from './store';
import {AxiosResponse} from 'axios';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { User } from '../models/user';

class MyProfilStore implements Store<User>{
    private sub = new BehaviorSubject<User>({email:''});

    public set(user: User): void{
        this.sub.next(user);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    /**
     * 
     */
    public load():Promise<User>{
        return httpClientService.axios.get(conf.API.myProfil())
        .then((response: AxiosResponse<User>) => {
            this.set(response.data);
            return response.data;
        });
    }
}

export default new MyProfilStore() ;