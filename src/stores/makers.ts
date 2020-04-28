import {BehaviorSubject, Subscription} from 'rxjs';
import { Maker } from '../models/marker';
import { Store } from './store';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import {AxiosResponse} from 'axios';

class MakersStore implements Store<Maker[]>{
    private sub = new BehaviorSubject<Maker[]>([]);

    public set(markers: Maker[]): void{
        this.sub.next(markers);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    public refresh(makerId?:string):void{
        httpClientService.axios.get(conf.API.markers(makerId))
        .then((response: AxiosResponse<Maker[]>) => {
            this.set(response.data);
        }).catch((e:any) => {
            console.error(e);
        });
    }
}

export default new MakersStore() ;