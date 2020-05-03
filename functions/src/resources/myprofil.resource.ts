import {Request,Response} from 'express';
import { AppUtil } from '../apputil';
import { UserDao } from '../dao/user.dao';
import { User } from '../models/user';

class MyProfilResource{

    private userDao = new UserDao();

    /**
     * /my-profil
     * Retourne la liste des producteurs à partir de critères
     * 
     * @param request 
     * @param response 
     */
    public async get(request:Request, response:Response){ 
        try{
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const urlPieces = request.path.split('/');
            const orderId = urlPieces[urlPieces.length - 1];
            if(!orderId){ throw 'Identifiant invalide'}

            const user: User = (await this.userDao.get(currentUserEmail)) || {email: currentUserEmail};

            AppUtil.expires(response, 15);
            AppUtil.ok(response, user);
        }catch(e){
            AppUtil.internalError(response, e);
        }
    }

    /**
     * PUT : /my-profil
     * 
     * @param request 
     * @param response 
     */
    public async update(request:Request, response:Response){ 
        try{
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }

            const user = request.body as User;
            if(user.email && user.email !== currentUserEmail){
                AppUtil.badRequest(response, 'Email invalide');return;
            }
            
            user.email = currentUserEmail;

            await this.userDao.update(currentUserEmail, user);

            AppUtil.ok(response);
        }catch(e){
            AppUtil.internalError(response, e);
        }
    }

}

export default new MyProfilResource();