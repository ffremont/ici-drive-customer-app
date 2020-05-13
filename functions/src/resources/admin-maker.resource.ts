import { Request, Response } from 'express';
import { AppUtil } from '../apputil';
import { MakerDao } from '../dao/maker.dao';

class AdminMakerResource{

    private makerDao = new MakerDao();
 
    public async getSelf(request: Request, response: Response) {
        try {
            const currentUserEmail = await AppUtil.authorized(request);
            if (currentUserEmail === null) {
                AppUtil.notAuthorized(response); return;
            }
            
            const maker = await this.makerDao.getFullByEmail(currentUserEmail);

            if(maker){
                AppUtil.ok(response, maker);
            }else{
                AppUtil.notFound(response);
            }
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }
}

export default new AdminMakerResource();