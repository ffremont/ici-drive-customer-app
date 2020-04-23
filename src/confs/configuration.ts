import { Item } from "../models/item";
import { Url } from "url";

interface APIS{
    markers:any;
    products:any;
}

export interface Configuration{
    API: APIS,
    categories: Item[],

    cgu:string;
    cgv:string;
}