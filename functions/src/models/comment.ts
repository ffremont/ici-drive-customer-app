export interface Comment{
    id: string;
    created: number;
    /**
     * Nom publique de l'auteur
     */
    authorName: string;

    /**
     * Email de l'auteur
     */
    authorEmail:string;

    /**
     * Flag pour afficher / cacher le commentaire
     */
    visible:boolean;

    /**
     * Flag pour savoir si l'avis est inapproprié
     */
    inappropriate:boolean;

    /**
     * Contenu
     */
    content: string;

    /**
     * La note sur 5
     */
    rate:number;

    /**
     * Réponse du producteur au commentaire
     */
    reply: { 
        created: number; 
        content: string;
    }
}