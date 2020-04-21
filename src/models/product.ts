export interface Product{
    label:string;
    image:string;
    price:number;
    description?:string;
    ref:string;
    categoryId:string;
    weight?:number;
    volume?:number;
    maxInBasket?:number;
    available:boolean
}