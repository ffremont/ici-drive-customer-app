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
                scheduleService.confirmExpiration(),
                scheduleService.noConfirmationExpiration(),
                scheduleService.reminder()
            ]);
            
            AppUtil.info('confirmExpiration, avec succès', 'noConfirmationExpiration avec succès', 'reminder avec succès');
            AppUtil.ok(response);
        }catch(e){
            AppUtil.error('scheduler in error',e);
            AppUtil.internalError(response,e);
        }       
    }
}


export default new SchedulerResource();