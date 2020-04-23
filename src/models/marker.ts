import { User } from "./user";
import { Place } from "./place";
import { Item } from "./item";

export interface Maker extends User{
    place: Place,
    categories: Item[],
    description:string,
    image: string;
    webPage:string;
    name: string;
    id:string;
}