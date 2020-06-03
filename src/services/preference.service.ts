import { GeoPoint } from "../models/geo-point";
import mapService from './map.service';

export interface GeoSearchPoint extends GeoPoint{
    address?:string;
}

class PreferenceService{

    private static PREF_SEARCH_POINT_KEY='preference-search-point';

    public async setSearchPoint(point : GeoSearchPoint){
        if(window.localStorage){
            window.localStorage[PreferenceService.PREF_SEARCH_POINT_KEY] = JSON.stringify(point);
        }
    }
    
    /**
     * Si on a une préférence de recherche, on la retourne
     * sinon, on utilise celle du GPS,
     * Si on a toujours rien, c'est qu'on a pas activé de GPS
     */
    public async getSearchPoint(): Promise<GeoSearchPoint | null>{
        const preferenceGeo:any = window.localStorage && window.localStorage[PreferenceService.PREF_SEARCH_POINT_KEY] ? JSON.parse(window.localStorage[PreferenceService.PREF_SEARCH_POINT_KEY]): null;

        if(preferenceGeo){
            return preferenceGeo;
        }else{
            try{
                return await mapService.getCurrentPosition();
            }catch(e) {
                console.error(e);
                return null;
            }
        }
    }
}

export default new PreferenceService();