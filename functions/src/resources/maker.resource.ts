import { Request, Response } from 'express';
import * as geohash from "ngeohash";
import context, { Context } from '../context';
import { AppUtil } from '../apputil';
import { MakerDao } from '../dao/maker.dao';

class MakerResource {

    private static NEAR_KM = 40;
    private static SEARCH_LIMIT = 2;

    private makerDao = new MakerDao();

    private geoRange(
        latitude: number,
        longitude: number,
        kmDistance: number): { lower: string, upper: string } {

        const mileDistance = kmDistance / 1.60934;
        const lat = 0.0144927536231884; // degrees latitude per mile
        const lon = 0.0181818181818182; // degrees longitude per mile

        const lowerLat = latitude - lat * mileDistance;
        const lowerLon = longitude - lon * mileDistance;

        const upperLat = latitude + lat * mileDistance;
        const upperLon = longitude + lon * mileDistance;

        const lower = geohash.encode(lowerLat, lowerLon);
        const upper = geohash.encode(upperLat, upperLon);

        return {
            lower,
            upper
        };
    }

    /**
     * /makers?near=46.333,-0.76422
     * Retourne la liste des producteurs à partir de critères
     * 
     * @param request 
     * @param response 
     */
    public async search(request: Request, response: Response) {
        const near: any = request.query.near || null;
        let snapshot;
        try {
            if (near) {
                const nearArr = near.split(',');
                const nearRange = this.geoRange(parseFloat(nearArr[0]), parseFloat(nearArr[1]), MakerResource.NEAR_KM);

                const ref = await context.db().collection(Context.MAKERS_COLLECTION)
                    .where('place.point.geohash', '>', nearRange.lower)
                    .where('place.point.geohash', '<', nearRange.upper)
                snapshot = await ref.limit(MakerResource.SEARCH_LIMIT).get();
            } else {
                snapshot = await context.db().collection(Context.MAKERS_COLLECTION)
                    .where('created', '<', (new Date()).getTime())
                    .orderBy('created', 'desc')
                    .limit(MakerResource.SEARCH_LIMIT).get();
            }

            const makers = AppUtil.arrOfSnap(snapshot);

            AppUtil.expires(response, 1800);
            AppUtil.ok(response, makers);
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }


    /**
     * /makers/aaaaaaaaa
     * 
     * @param request 
     * @param response 
     */
    public async getFullMaker(request: Request, response: Response) {
        try {
            const markerId = request.params.id;
            if(!markerId){ throw 'Identifiant invalide'}
            
            const maker = await this.makerDao.getFull(markerId);

            if(maker){
                AppUtil.expires(response, 1800);
                AppUtil.ok(response, maker);
            }else{
                AppUtil.notFound(response);
            }
        } catch (e) {
            AppUtil.internalError(response, e);
        }
    }

}

export default new MakerResource();