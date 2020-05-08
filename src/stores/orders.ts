import {BehaviorSubject, Subscription} from 'rxjs';
import { Store } from './store';
import {AxiosResponse} from 'axios';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { Order } from '../models/order';

export class OrdersStore implements Store<Order[]>{
    private sub = new BehaviorSubject<Order[]>([]);

    public set(orders: Order[]): void{
        this.sub.next(orders);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    static async update(order: Order){
        await httpClientService.axios.put(conf.API.orders(order.id), order);
    }
    /**
     * 
     */
    public load(id?:string):Promise<Order[]>{
        return httpClientService.axios.get(conf.API.orders(id))
        .then((response: AxiosResponse<any>) => {
            if(id){
                this.set([response.data]);
            }else{
                this.set(response.data);
            }            
            return response.data;
        });
    }
}

export default new OrdersStore() ;