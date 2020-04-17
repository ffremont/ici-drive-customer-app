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
    monday: OfficeSlot,
    tuesday: OfficeSlot,
    webnesday: OfficeSlot,
    thursday: OfficeSlot,
    friday: OfficeSlot,
    saturday: OfficeSlot,
    sunday: OfficeSlot    
}