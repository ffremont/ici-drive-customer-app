import { HebdoSlot } from "./hebdo-slot";
import { GeoPoint } from "./geo-point";

export interface Place{
    label:string;
    address?: string;
    image?: string;
    slotsDescription?: string;
    description?:string;
    hebdoSlot: HebdoSlot,

    point?: GeoPoint
}