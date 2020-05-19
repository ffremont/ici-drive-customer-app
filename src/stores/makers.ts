import {BehaviorSubject, Subscription} from 'rxjs';
import { Maker } from '../models/maker';
import { Store } from './store';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import {AxiosResponse} from 'axios';
import { GeoPoint } from '../models/geo-point';

class MakersStore implements Store<Maker[]>{
    private sub = new BehaviorSubject<Maker[]>([]);

    public set(makers: Maker[]): void{
        this.sub.next(makers);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    public search(geoPoint: GeoPoint) : Promise<void>{
        return httpClientService.axios.get(conf.API.searchMakers(geoPoint))
        .then((response: AxiosResponse<any>) => {
            if(Array.isArray(response.data)){
                this.set(response.data);
            }else{
                this.set([response.data]);
            }
            return response;            
        });
    }

    public refresh(makerId = null):Promise<any>{
        return httpClientService.axios.get(conf.API.makers(makerId))
        .then((response: AxiosResponse<any>) => {
            if(Array.isArray(response.data)){
                this.set(response.data);
            }else{
                this.set([response.data]);
            }            
            return response;
        });
    }
}

export default new MakersStore() ;