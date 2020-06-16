import { GeoPoint } from "../models/geo-point";
import * as geohash from "ngeohash";


class MapService{

    /**
     * Current pos
     */
    public getCurrentPosition():Promise<GeoPoint>{
        return new Promise((resolve, reject)=>{
            if(navigator.geolocation){

                navigator.geolocation.getCurrentPosition((pos) =>{
                    resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        geohash: geohash.encode(pos.coords.latitude, pos.coords.longitude)
                    })
                }, err => reject(err), {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                  });
            }else{
                reject('navigator.geolocation not supported');
            }
        });
    }

    /**
     * Distance en KM
     * @param lat1 
     * @param lon1 
     * @param lat2 
     * @param lon2 
     */
    public distance(lat1:number, lon1: number, lat2: number, lon2: number): number{
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344 
            
            return dist;
        }
    }
}

export default new MapService();