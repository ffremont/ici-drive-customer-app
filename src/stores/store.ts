import { Partner } from "../models/partner";
import { Subscription } from "rxjs";

export interface Store<T>{
    set(entity: T): void;
    subscribe(func:any): Subscription;
}