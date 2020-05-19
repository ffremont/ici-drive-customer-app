import { Item } from "../models/item";

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
    privacy_policy: string;
    acceptable_use_policy:string;
    support:string;
}