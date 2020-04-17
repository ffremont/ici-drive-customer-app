import {BehaviorSubject, Subscription} from 'rxjs';
import { Partner } from '../models/partner';
import { Store } from './store';
import {AxiosResponse} from 'axios';
import httpClientService from '../services/http-client.service';
import conf from '../confs';

class PartnersStore implements Store<Partner[]>{
    private sub = new BehaviorSubject<Partner[]>([]);

    public set(partners: Partner[]): void{
        this.sub.next(partners);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    public refresh():void{
        httpClientService.axios.get(conf.API.partners)
        .then((response: AxiosResponse<Partner[]>) => {
            this.set(response.data);
        }).catch((e:any) => {
            console.error(e);
        });
    }
}

export default new PartnersStore() ;