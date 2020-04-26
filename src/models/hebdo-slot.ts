export interface OfficeSlot{
    /**
     * HH:MM
     */
    openAt: string;
    /**
     * HH:MM
     */
    closeAt: string;
}

export interface HebdoSlot{
    lundi: OfficeSlot,
    mardi: OfficeSlot,
    mercredi: OfficeSlot,
    jeudi: OfficeSlot,
    vendredi: OfficeSlot,
    samedi: OfficeSlot,
    dimanche: OfficeSlot    
}