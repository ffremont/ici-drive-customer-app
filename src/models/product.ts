export interface Product{
    label:string;
    image:string;
    price:number;
    description?:string;
    ref:string;
    categoryId:string;
    weight?:number;
    volume?:number;
    maxInCart?:number;
    available:boolean;
    topOfList?:boolean;
    bio?:boolean;
}