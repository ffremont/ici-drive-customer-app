import { Item } from "../models/item";
import { Url } from "url";

interface APIS{
    markers:any;
    products:any;
    orders:any;
    myProfil:any;
}

export interface Configuration{
    API: APIS,
    categories: Item[],

    publicHolidays:{date:string, public_holiday:boolean, label:string}[],
    cgu:string;
    cgr:string;
}