import { Item } from "../models/item";

interface APIS{
    partners:any;
    products:any;
}

export interface Configuration{
    API: APIS,
    categories: Item[]
}