import { Maker } from "./maker";
import { Product } from "./product";
import { User } from "./user";

export interface ProductChoice{
    product:Product;
    quantity:number;
}

export enum OrderState{
    PENDING = 'pending',

    VERIFIED = 'verified',
    REFUSED = 'refused',

    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled'
}

export interface Order{
   created:number;
   ref:string;
   id?:string;
   status?:OrderState; // ATTENTE_VALIDATION, VALIDEE, REFUSEE, ANNULEE
   
   choices: ProductChoice[],
   maker?: Maker,
   total:number;
   slot?: number;
   reasonOf?:string;
   customer?: User;
}