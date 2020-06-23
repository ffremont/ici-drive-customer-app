import { Order, ProductChoice, OrderState } from "../models/order";
import { Store } from "./store";
import { BehaviorSubject, Subscription } from "rxjs";
import { Maker } from "../models/maker";
import * as moment from 'moment';
import { Product } from "../models/product";
import httpClientService from '../services/http-client.service';
import conf from '../confs';
import {AxiosResponse} from 'axios';

class CartStore implements Store<Order>{

    private static SESSION_STORAGE_KEY='ici-drive-cart';

    private order: Order | null = null;
    private sub:BehaviorSubject<Order>;

    constructor(){
        let defaultOrder = { choices: [], created: (new Date()).getTime(), total: 0, ref: '', updated: (new Date()).getTime() };
        if(window.sessionStorage && window.sessionStorage.getItem(CartStore.SESSION_STORAGE_KEY)){
            defaultOrder = JSON.parse(window.sessionStorage.getItem(CartStore.SESSION_STORAGE_KEY) as any);
        }
        this.order = defaultOrder;
        this.sub = new BehaviorSubject<Order>(defaultOrder);
    }

    set(order: Order): void {
        this.order = order;
        if(window.sessionStorage){
            window.sessionStorage.setItem(CartStore.SESSION_STORAGE_KEY, JSON.stringify(order));
        }
        this.sub.next(order);
    }


    subscribe(func: any): Subscription {
        return this.sub.subscribe(func);
    }

    /**
     * Mémorise le cart
     */
    save(myCart: Order): Promise<AxiosResponse<Order>>{
        return httpClientService.axios.post(conf.API.orders(), myCart);
    }

    /**
     * Set la quantité dans le panier d'un produit existant
     * @param p 
     * @param newQty 
     */
    setQuantityOf(p: Product, newQty: number): Promise<{ reason?:string,badQuantity?: boolean }> {
        return new Promise((resolve, reject) => {
            const newOrder: Order = { ...this.order } as Order;
            const alreadyProductChoice = newOrder.choices.find(pc => pc.product.ref === p.ref);
            if (alreadyProductChoice) {
                if (p.maxInCart || 99999 > newQty) {
                    alreadyProductChoice.quantity = newQty;

                    if(alreadyProductChoice.quantity === 0){
                        newOrder.choices = newOrder.choices.filter(pc => pc.product.ref !== alreadyProductChoice.product.ref);
                    }
                    newOrder.total = newOrder.choices.map(pc => pc.quantity * pc.product.price).reduce((acc, cv) => acc + cv, 0)
                        this.set(newOrder);
                        resolve({});             
                } else {
                    // mauvaise quantité
                    reject({ reason: 'trop de produit',badQuantity: true });
                }
            }else{
                reject({reason:'produit non trouvé'});
            }
        });
    }

    /**
     * Reset du panier
     */
    resetCart() : Promise<void>{
        return new Promise((resolve) => {
            const newOrder = { choices: [], created: (new Date()).getTime(), total: 0, ref: '', updated: (new Date()).getTime() };
            this.set(newOrder);
            resolve();
        });
    }

    /**
     * Ajout d'un produit qu'il existe ou non dans le panier
     * @param p 
     */
    addProduct(p: Product) : Promise<{ badQuantity?: boolean }> {
        return new Promise((resolve, reject) => {
            const newOrder: Order = { ...this.order } as Order;
            const alreadyProductChoice = newOrder.choices.find(pc => pc.product.ref === p.ref);
            if (alreadyProductChoice) {
                // by ref
                if ((p.maxInCart || 99999) > (alreadyProductChoice.quantity+1)) {
                    alreadyProductChoice.quantity = alreadyProductChoice.quantity + 1;
                }else{
                    // mauvaise quantité
                    reject({ badQuantity: true });
                    return;
                }
            } else {
                newOrder.choices.push({
                    product: p,
                    quantity: 1
                });
            }

            newOrder.total = newOrder.choices.map(pc => pc.quantity * pc.product.price).reduce((acc, cv) => acc + cv, 0)

            this.set(newOrder);
            resolve({});
        });
    }

    /**
     * Surcharge la commande en cours (panier en cours)
     * @param maker 
     * @param pc 
     */
    addFirstProductWithMaker(maker?: Maker, pc?: ProductChoice) {
        this.set({
            created: (new Date()).getTime(),
            maker,
            updated: (new Date()).getTime(),
            ref: `${maker?.prefixOrderRef}${moment.default().format()}`,
            choices: pc ? [pc] : [],
            status: OrderState.PENDING,
            total: pc ? pc.product.price * pc.quantity : 0
        });
    }

}

export default new CartStore();