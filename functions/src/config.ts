import { Order } from "./models/order";

export class Config {
    public static pendingExpireAfter = 72; // hours
    
    
    public static limitBatchSchedule = 200;

    public static apikeyScheduler = 'a792450b-1a50-4429-84d2-420b8ea16ab7';

    public static confirmedExpireAfter = 48; // hours
    public static confirmedExpireWindowInHours = 6;
    public static comfirmedExpirationReason = (order:Order) => `Annulation automatique, la confirmation doit intervenir au moins 48h avant `
    public static pendingExpirationReason = (order:Order) => `Annulation automatique, la vérification doit intervenir au moins 48h avant `

    public static MAKERS_NEAR_KM = 50;
    public static MAKERS_SEARCH_LIMIT = 50;

    public static customerAppUrl = 'https://app.ici-drive.fr';
    public static makerAppUrl = 'https://admin.ici-drive.fr';

    //https://bunnycdnstorage.docs.apiary.io/#reference/0/storagezonenamepathfilename
    public static bunnyCdnPullZoneBaseURl = 'https://icidrive.b-cdn.net';
    public static bunnyCdnStorageName = 'ici-drive';
    public static bunnyCdnStorageTargetProductsFolder = 'products-prod';
    public static bunnyCdnImageUrl = (filename: any) => `https://icidrive.b-cdn.net/products-prod/${filename}`

    public static subjectCancelled = 'Annulation de réservation - ici-drive.fr';
    public static subjectRefused = 'Réservation refusée - ici-drive.fr';
    public static subjectVerified = 'Réservation vérifiée - ici-drive.fr';
    public static subjectConfirmed = 'Confirmation de réservation - ici-drive.fr';
    public static subjectNewOrder = 'Nouvelle réservation - ici-drive.fr';
    public static subjectRemind = 'Rappel réservation - ici-drive.fr';

    public static getBunnycdnStorageApiPath(filename: string = '') {
        return `/${Config.bunnyCdnStorageName}/${Config.bunnyCdnStorageTargetProductsFolder}/${filename ? filename : ''}`;
    }

    public static getDefaultImageUrl() {
        return `${Config.customerAppUrl}/default_image.jpg`;
    }
}