

export class Config {
    public static pendingExpireAfter = 72; // hours
    public static reminderNext = 2; // envoi le rappel si la commande doit être retirer dans les 2 heures

    public static limitBatchSchedule = 100;

    public static apikeyScheduler = 'a792450b-1a50-4429-84d2-420b8ea16ab7';

    public static enableOrderConfirmAfterDays = 5; // active confirmation si le retrait se fait dans les plus de X jours
    public static verifyOrderForShortOrderHours = 24; // le prod. a X heures pour valider une commande "courte"
    public static verifyOrderForLongOrderHours = 72; // le prod. doit valider la commande "longue" X heures AVANT le retrait / liv.
    public static confirmOrderForLongOrderHours = 48; // le client doit confirmer la commande "longue" X heures AVANT le retrait / liv.

    public static withConfirmExpirationReason = `Annulation automatique, la vérification doit intervenir au moins 72h avant le retrait / liv. et la confirmation 48h `
    public static noConfirmExpirationReason = `Annulation automatique, la vérification doit intervenir dans les 24h après la commande `

    public static MAKERS_NEAR_KM = 200;
    public static MAKERS_SEARCH_LIMIT = 50;

    public static customerAppUrl = 'https://app.ici-drive.fr';
    public static makerAppUrl = 'https://admin.ici-drive.fr';

    //https://bunnycdnstorage.docs.apiary.io/#reference/0/storagezonenamepathfilename
    public static bunnyCdnPullZoneBaseURl = 'https://icidrive.b-cdn.net';
    public static bunnyCdnStorageName = 'ici-drive';
    public static bunnyCdnStorageTargetProductsFolder = 'products-prod';
    public static bunnyCdnStorageTargetMakersFolder = 'makers-prod';
    public static bunnyCdnStorageTargetPlacesFolder = 'places-prod';

    public static subjectRegister = 'Bienvenue sur admin.ici-drive.fr';
    public static subjectCancelled = 'Annulation de réservation - ici-drive.fr';
    public static subjectRefused = 'Réservation refusée - ici-drive.fr';
    public static subjectVerified = 'Réservation vérifiée - ici-drive.fr';
    public static subjectConfirmed = 'Confirmation de réservation - ici-drive.fr';
    public static subjectNewOrder = 'Nouvelle réservation - ici-drive.fr';
    public static subjectRemind = 'Rappel réservation - ici-drive.fr';

    public static getBunnyCdnImageUrl(filename: any, type: string = '') {
        return `https://icidrive.b-cdn.net/${Config.getFolderByType(type)}/${filename}`;
    }

    private static getFolderByType(type: string) {
        let folder = Config.bunnyCdnStorageTargetProductsFolder;
        if (type === 'place')
            folder = Config.bunnyCdnStorageTargetPlacesFolder;
        else if (type === 'maker')
            folder = Config.bunnyCdnStorageTargetMakersFolder;

        return folder;
    }

    public static getBunnycdnStorageApiPath(filename: string = '', type: string = '') {
        return `/${Config.bunnyCdnStorageName}/${Config.getFolderByType(type)}/${filename ? filename : ''}`;
    }

    public static getDefaultImageUrl() {
        return `${Config.customerAppUrl}/default_image.jpg`;
    }
}