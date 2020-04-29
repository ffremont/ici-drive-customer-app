import { Maker } from "./maker";
import { Product } from "./product";
import { Customer } from "./customer";

export interface ProductChoice{
    product:Product;
    quantity:number;
}

export enum OrderState{
    PENDING = 'pending',
    VALIDATED = 'validate',
    REFUSED = 'refused',
    CANCELLED = 'CANCELLED'
}

export interface Order{
   created:number;
   ref:string;
   status?:OrderState; // ATTENTE_VALIDATION, VALIDEE, REFUSEE, ANNULEE
   
   choices: ProductChoice[],
   maker?: Maker,
   total:number;
   slot?: number;
   reasonOf?:string;
   customer?: Customer;
}