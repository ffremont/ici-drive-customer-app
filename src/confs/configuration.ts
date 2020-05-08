import { Item } from "../models/item";
import { Url } from "url";

interface APIS{
    makers:any;
    orders:any;
    myProfil:any;
    searchMakers:any;
}

export interface Configuration{
    API: APIS,
    categories: Item[],
    baseURL: string,
    fcmPublicVapidKey:string,
    startDriveAfterDays:number,

    publicHolidays:{date:string, public_holiday:boolean, label:string}[],
    cgu:string;
    cgr:string;
    support:string;
}