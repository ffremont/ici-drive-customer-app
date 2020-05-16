export class Config {
    public static pendingExpireAfter = 72; // hours
    public static confirmedExpireAfter = 48; // hours
    public static pendingExpireComingSoon = 18; // expire si drive dans moins de 18h
    public static confirmedExpireComingSoon = 12; // expire si drive dans moins de 12h
    public static limitBatchSchedule = 100;

    public static MAKERS_NEAR_KM = 5;
    public static MAKERS_SEARCH_LIMIT = 10;

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