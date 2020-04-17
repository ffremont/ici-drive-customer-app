import { Partner } from "../models/partner";
import { Subscription } from "rxjs";

export interface Store<T>{
    set(partners: Partner[]): void;
    subscribe(func:any): Subscription;
    refresh():void;
}