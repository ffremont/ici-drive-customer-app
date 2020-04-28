import {BehaviorSubject, Subscription} from 'rxjs';
import { Store } from './store';
import {AxiosResponse} from 'axios';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { Customer } from '../models/customer';

class MyProfilStore implements Store<Customer>{
    private sub = new BehaviorSubject<Customer>({email:''});

    public set(customer: Customer): void{
        this.sub.next(customer);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    /**
     * 
     */
    public load():Promise<Customer>{
        return httpClientService.axios.get(conf.API.myProfil())
        .then((response: AxiosResponse<Customer>) => {
            this.set(response.data);
            return response.data;
        });
    }
}

export default new MyProfilStore() ;