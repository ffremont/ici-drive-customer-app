import {Request,Response} from 'express';
//import context, {Context} from './context';

class MakerResource{

    /**
     * /makers?a=1&b=2
     * Retourne la liste des producteurs à partir de critères
     * 
     * @param request 
     * @param response 
     */
    public async search(request:Request, response:Response){ 
        
        response.send("Hello from Firebase!");
    }

    /**
     * /makers/aaaaaaaaa
     * 
     * @param request 
     * @param response 
     */
    public async getFullMake(request:Request, response:Response){ 
        
        response.send("Hello from Firebase!");
    }

}

export default new MakerResource();