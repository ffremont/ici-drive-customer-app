import { User } from "./user";
import { Place } from "./place";
import { Item } from "./item";

export interface Maker extends User{
    id:string;
    name: string;
    image: string;
    webPage:string;
    description:string;
    phone?: string;
    //maxOrdersByDay:number;
    //maintenance:boolean;
    prefixOrderRef: string;

    place: Place;
    categories: Item[];

    
    
    
    
}