import { Request, Response } from 'express';
import scheduleService from '../services/schedule.service';
import { AppUtil } from '../apputil';
import { Config } from '../config';

class SchedulerResource{

    public async heatbeat(request: Request, response: Response) {
        const {apikey} = request.query;
        if(apikey !== Config.apikeyScheduler){
            AppUtil.notAuthorized(response);return;
        }

        try{
            await Promise.all([
                scheduleService.comfirmedExpiration(),
                scheduleService.pendingExpiration()
            ]);
            
            AppUtil.info('comfirmedExpiration avec succès');
            AppUtil.info('pendingExpiration avec succès');
            AppUtil.ok(response);
        }catch(e){
            AppUtil.error('scheduler in error',e);
            AppUtil.internalError(response,e);
        }       
    }
}


export default new SchedulerResource();