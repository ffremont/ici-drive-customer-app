export interface Notif{
    type:NotifType;
    message:string;
}

export enum NotifType{
    SNACK_CART, MY_CARD_SAVED, MY_PROFIL
}