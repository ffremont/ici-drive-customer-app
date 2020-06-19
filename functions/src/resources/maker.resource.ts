import { Request, Response } from 'express';
//import * as geohash from "ngeohash";
import context, { Context } from '../context';
import { AppUtil } from '../apputil';
import { MakerDao } from '../dao/maker.dao';
import {Config} from '../config';
import * as admin from 'firebase-admin';

class MakerResource {

    private makerDao = new MakerDao();

    /**
     * @see https://stackoverflow.com/questions/46630507/how-to-run-a-geo-nearby-query-with-firestore
     * @param latitude 
     * @param longitude 
     * @param kmDistance 
     */
    private geoRange(
        latitude: number,
        longitude: number,
        kmDistance: number): { lower: any, upper: any} {

            AppUtil.debug({latitude,longitude,kmDistance})
        const mileDistance = kmDistance / 1.60934;
        const lat = 0.0144927536231884; // degrees latitude per mile
        const lon = 0.0181818181818182; // degrees longitude per mile

        const lowerLat = latitude - (lat * mileDistance);
        const lowerLon = longitude - (lon * mileDistance);

        const upperLat = latitude + (lat * mileDistance);
        const upperLon = longitude + (lon * mileDistance);

        //const lower = geohash.encode(lowerLat, lowerLon,12);
        //const upper = geohash.encode(upperLat, upperLon,12);
        const lower  =new admin.firestore.GeoPoint(lowerLat, lowerLon);
        const upper  =new admin.firestore.GeoPoint(upperLat, upperLon);

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
            AppUtil.debug(`maker > search > query ${near}`);
            if (near) {
                AppUtil.debug(`maker > search near  ${Config.MAKERS_NEAR_KM}km in limit ${Config.MAKERS_SEARCH_LIMIT}`);
                const nearArr = near.split(',');
                const nearRange = this.geoRange(parseFloat(nearArr[0]), parseFloat(nearArr[1]), Config.MAKERS_NEAR_KM);

                const ref = await context.db().collection(Context.MAKERS_COLLECTION)
                    .where('place.point.geopoint', '>', nearRange.lower)
                    .where('place.point.geopoint', '<', nearRange.upper)
                    .where('active', '==', true);
                    
                snapshot = await ref.limit(Config.MAKERS_SEARCH_LIMIT).get();
            } else {
                snapshot = await context.db().collection(Context.MAKERS_COLLECTION)
                    .where('created', '<', (new Date()).getTime())
                    .where('active', '==', true)
                    .orderBy('created', 'desc')
                    .limit(Config.MAKERS_SEARCH_LIMIT).get();
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