import { User } from "./user";
import { Place } from "./place";
import { Item } from "./item";

export interface Partner extends User{
    place: Place,
    categories: Item[],
    image: string;
    name: string;
    id:string;
}