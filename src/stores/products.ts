import {BehaviorSubject, Subscription} from 'rxjs';
import { Store } from './store';
import {AxiosResponse} from 'axios';
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import { Product } from '../models/product';

class ProductStore implements Store<Product[]>{
    private sub = new BehaviorSubject<Product[]>([]);

    public set(products: Product[]): void{
        this.sub.next(products);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }

    public refresh(makerId:string):void{
        httpClientService.axios.get(conf.API.products(makerId))
        .then((response: AxiosResponse<Product[]>) => {
            this.set(response.data);
        }).catch((e:any) => {
            console.error(e);
        });
    }
}

export default new ProductStore() ;