import { Order, ProductChoice, OrderState } from "../models/order";
import { Store } from "./store";
import { BehaviorSubject, Subscription } from "rxjs";
import { Maker } from "../models/marker";
import * as moment from 'moment';
import { Product } from "../models/product";

class BasketStore implements Store<Order>{

    private order: Order|null = null;
    private sub = new BehaviorSubject<Order>({choices:[], created: (new Date()).getTime(), total:0, ref:''});

    set(order: Order): void {
        this.order = order;
        this.sub.next(order);
    }


    subscribe(func: any):Subscription {
        return this.sub.subscribe(func);
    }

    /**
     * Set la quantité dans le panier d'un produit existant
     * @param p 
     * @param newQty 
     */
    setQuantityOf(p:Product, newQty:number){
        const newOrder:Order = {...this.order} as Order;
        const alreadyProductChoice = newOrder.choices.find(pc => pc.product.ref === p.ref);
        if(alreadyProductChoice){
            alreadyProductChoice.quantity = newQty;

            newOrder.total = newOrder.choices.map(pc => pc.quantity*pc.product.price).reduce((acc, cv) => acc+cv, 0)
            this.set(newOrder);
        }
    }

    /**
     * Ajout d'un produit qu'il existe ou non dans le panier
     * @param p 
     */
    addProduct(p:Product){
        debugger;
        const newOrder:Order = {...this.order} as Order;
        const alreadyProductChoice = newOrder.choices.find(pc => pc.product.ref === p.ref); 
        if(alreadyProductChoice){
            // by ref
            alreadyProductChoice.quantity = alreadyProductChoice.quantity + 1;
        }else{
            newOrder.choices.push({
                product: p,
                quantity:1
            });
        }
        
        newOrder.total = newOrder.choices.map(pc => pc.quantity*pc.product.price).reduce((acc, cv) => acc+cv,0)
        
        this.set(newOrder);
    }

    /**
     * Surcharge la commande en cours (panier en cours)
     * @param maker 
     * @param pc 
     */
    addFirstProductWithMaker(maker?: Maker, pc?:ProductChoice){
        this.set({
            created: (new Date()).getTime(),
            maker,
            ref: `${maker?.prefixOrderRef}${moment.default().format()}`,
            choices: pc ? [pc] : [],
            status : OrderState.PENDING,
            total: pc ? pc.product.price * pc.quantity : 0
        });
    }

}

export default new BasketStore() ;