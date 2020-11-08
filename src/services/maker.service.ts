import { Maker } from "../models/maker";
import conf from '../confs';
import * as moment from 'moment';
import { OfficeSlot } from "../models/hebdo-slot";


export class MakerService{

    /**
     * 15 minutes en ms
     */
    public static SLOT_QTY = 900000;

    public static SLOT_DELIVERY_QTY = 3600000;

    public weekDateToDate(year:number, week:number, day:number) {
        const firstDayOfYear = new Date(year, 0, 1)
        const days = 2 + day + (week - 1) * 7 - firstDayOfYear.getDay()
        return new Date(year, 0, days);
      }

    

    /**
     * Les 1ers créneaux disponibles. Sur 7 jours glissant. 
     * 
     * @param maker 
     */
    public getSlots(maker : Maker, limit = -1, delivery = false): Date[]{
        const realSlotQty:number = delivery ? MakerService.SLOT_DELIVERY_QTY :  MakerService.SLOT_QTY;
        const results : Date[] = [];
        let now = moment.default();

        // /!\ rdv après X jours min
        now.add((maker as any).startDriveAfterDays || conf.startDriveAfterDays, 'd');
        //now.hours(6).minutes(0).seconds(0);

        // skip weekCloses
        let currentWeekNumber = now.week();
        // tant que la semaine est fermée, on passe la suivante
        while(maker.weekCloses && (maker.weekCloses.indexOf(currentWeekNumber) > -1)){
            currentWeekNumber = currentWeekNumber + 1;
        }
        const firstDayOfOpenedWeek = this.weekDateToDate(now.year(), currentWeekNumber, 0);
        if(firstDayOfOpenedWeek.getTime() >= now.toDate().getTime()){
            now = moment.default(firstDayOfOpenedWeek)
        }
        
        // on propose au maximum, les 14 jours clissants
        for(let i = 0; i< 14; i++){
            // si férié, on passe
            if(conf.publicHolidays.some(ph => ph.date === now.format('YYYY-MM-DD'))){
                now.add(1, 'd');
                continue;
            }
            
            let currentWeekNumber = now.week();
            if(maker.weekCloses && (maker.weekCloses.indexOf(currentWeekNumber) > -1)) {
                now.add(1, 'd');
                continue;
            }

            let nowDate = now.toDate();
            const dayKey = now.format('dddd').toLowerCase();
            const slots : any = delivery ? maker.delivery : maker.place.hebdoSlot;
            const officeSlot: OfficeSlot = slots[dayKey];
            if(!officeSlot || !officeSlot.openAt || !officeSlot.closeAt){
                now.add(1, 'd');
                continue;
            }

            nowDate.setHours(parseInt(officeSlot.openAt.split(':')[0],10));
            nowDate.setMinutes(parseInt(officeSlot.openAt.split(':')[1],10));
            nowDate.setSeconds(0);
            nowDate.setMilliseconds(0);
            
            const closeAt = new Date(nowDate);
            closeAt.setHours(parseInt(officeSlot.closeAt.split(':')[0],10));
            closeAt.setMinutes(parseInt(officeSlot.closeAt.split(':')[1],10));
            closeAt.setSeconds(59);

            if(closeAt.getTime() <= nowDate.getTime()){
                // la date d'ouverture est plus récente que la date de fermeture: ERREUR
                now.add(1, 'd');
                continue;
            }

            //on parcours tous les créneaux pour le jour "ouvert"
            const slotsQty = parseInt(`${(closeAt.getTime() - nowDate.getTime())/realSlotQty}`,10)+1;
            for(let j =0; j<slotsQty;j++){
                nowDate = new Date(nowDate.getTime() + ((j > 0) ? realSlotQty:0));
                results.push(new Date(nowDate));
            }

            now.add(1, 'd');

            if((limit > 0) && (i >=limit)){
                break;
            }
        }
        
        return results;
    }
}

export default new MakerService();