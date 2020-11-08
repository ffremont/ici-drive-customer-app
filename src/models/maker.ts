import { User } from "./user";
import { Place } from "./place";
import { Product } from "./product";
import { HebdoSlot } from "./hebdo-slot";

export interface PaymentMaker{
    acceptCoins: boolean;
    acceptCards: boolean;
    acceptBankCheck: boolean;
    acceptPaypal: boolean;
}

export interface Maker extends User{
    id:string;
    created: number,
    name: string;
    image: string;

    /**
     * Page web existante du producteur
     */
    webPage?:string;

    /**
     * Description du producteur
     */
    description:string;

    /**
     * Téléphone de contact, utilisé dans les réservations
     */
    phone?: string;

    /**
     * ID pour le messaging
     */
    fcm?:string;

    /**
     * Flag pour activer / désactiver
     */
    active?:boolean;

    /**
     * Délai entre la résa et le retrait possible
     */
    startDriveAfterDays?:number;
    //maxOrdersByDay:number;
    prefixOrderRef: string;

    /**
     * Horaires de livraison
     */
    delivery?: HebdoSlot;

    /**
     * Livraison à partir de X euros
     */
    deliveryAvailableFrom?:number;

    /**
     * Prix de la livraison
     */
    deliveryCost?:number;

    /**
     * Rayon de livraison en Km
     */
    deliveryRadius?:number;

    /**
     * Texte de description livraison
     */
    deliveryDescription?:string;

    /**
     * Jour des semaines fermés
     */
    weekCloses?:number[];

    /**
     * Placeholder pour le commentaire dans le panier
     */
    placeholderOrderComment?:string;

    place: Place;
    categories: string[];
    products?: Product[];

    payments?:PaymentMaker;

    /**
     * Avis des consommateurs
     */
    comments?:Comment;

}