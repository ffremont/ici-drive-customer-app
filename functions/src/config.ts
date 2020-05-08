export class Config{
    public static pendingExpireAfter = 72; // hours
    public static confirmedExpireAfter = 48; // hours
    public static pendingExpireComingSoon = 18; // expire si drive dans moins de 18h
    public static confirmedExpireComingSoon = 12; // expire si drive dans moins de 12h
    public static limitBatchSchedule = 100;

    public static customerAppUrl = 'https://app.ici-drive.fr';
    public static makerAppUrl = 'https://admin.ici-drive.fr';

    public static subjectCancelled = 'Annulation de réservation - ici-drive.fr';
    public static subjectRefused = 'Réservation refusée - ici-drive.fr';
    public static subjectVerified = 'Réservation vérifiée - ici-drive.fr';
    public static subjectConfirmed = 'Confirmation de réservation - ici-drive.fr';
    public static subjectNewOrder = 'Nouvelle réservation - ici-drive.fr';
    public static subjectRemind = 'Rappel réservation - ici-drive.fr';
}