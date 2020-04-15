import {BehaviorSubject, Subscription} from 'rxjs';
import { Partner } from '../models/partner';
import { Store } from './store';

class PartnersStore implements Store<Partner[]>{
    private sub = new BehaviorSubject<Partner[]>([]);

    public set(partners: Partner[]): void{
        this.sub.next(partners);
    }

    public subscribe(func:any): Subscription{
        return this.sub.subscribe(func);
    }
}

export default new PartnersStore() ;