import {BehaviorSubject, Subscription} from 'rxjs';
import { Maker } from '../models/maker';
import { Store } from './store';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import {AxiosResponse} from 'axios';

class MakersStore implements Store<Maker[]>{
    private sub = new BehaviorSubject<Maker[]>([]);

    public set(makers: Maker[]): void{
        this.sub.next(makers);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    public refresh(makerId?:string):void{
        httpClientService.axios.get(conf.API.makers(makerId))
        .then((response: AxiosResponse<Maker[]>) => {
            this.set(response.data);
        }).catch((e:any) => {
            console.error(e);
        });
    }
}

export default new MakersStore() ;