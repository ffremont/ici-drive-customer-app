import { User } from "./user";
import { Place } from "./place";
import { Product } from "./product";

export interface Maker extends User{
    id:string;
    created: number,
    name: string;
    image: string;
    webPage:string;
    description:string;
    phone?: string;
    //maxOrdersByDay:number;
    //active:boolean;
    prefixOrderRef: string;

    place: Place;
    categories: string[];
    products?: Product[];

    paypalMeUrl?:string;
}