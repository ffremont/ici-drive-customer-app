import {BehaviorSubject, Subscription} from 'rxjs';
import { Maker } from '../models/marker';
import { Store } from './store';
import {AxiosResponse} from 'axios';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { Order } from '../models/order';

class OrdersStore implements Store<Order[]>{
    private sub = new BehaviorSubject<Order[]>([]);

    public set(orders: Order[]): void{
        this.sub.next(orders);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    /**
     * 
     */
    public load():Promise<Order[]>{
        return httpClientService.axios.get(conf.API.orders())
        .then((response: AxiosResponse<Order[]>) => {
            this.set(response.data);
            return response.data;
        });
    }
}

export default new OrdersStore() ;