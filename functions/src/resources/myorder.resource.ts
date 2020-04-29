import {Request,Response} from 'express';
//import context, {Context} from './context';

class MyOrderResource{

    /**
     * Retourne la liste de mes commandes
     * @param request 
     * @param response 
     */
    public async searchInMyOrders(request:Request, response:Response){ 

    }

    /**
     * /my-orders/aaaaaa
     * 
     * @param request 
     * @param response 
     */
    public async update(request:Request, response:Response){ 

    }

    /**
     * /my-
     * Retourne la liste des producteurs à partir de critères
     * 
     * @param request 
     * @param response 
     */
    public async newCart(request:Request, response:Response){ 
        
        response.send("Hello from Firebase!");
    }

}

export default new MyOrderResource();