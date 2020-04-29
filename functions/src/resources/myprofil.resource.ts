import {Request,Response} from 'express';
//import context, {Context} from './context';

class MyProfilResource{

    /**
     * /my-profil
     * Retourne la liste des producteurs à partir de critères
     * 
     * @param request 
     * @param response 
     */
    public async get(request:Request, response:Response){ 
        
        response.send("Hello from Firebase!");
    }

    /**
     * PUT : /my-profil
     * 
     * @param request 
     * @param response 
     */
    public async update(request:Request, response:Response){ 
        response.send("Hello from Firebase!");
    }

}

export default new MyProfilResource();