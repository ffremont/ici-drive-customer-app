import * as functions from 'firebase-functions';
import axios from 'axios';
import { Order, OrderState } from '../models/order';
import {Config} from '../config';
import * as moment from 'moment';

interface Transition{
    from: string,
    newStatus : OrderState,
    notify: any
}

export class NotifService {

    elasticmailUrl: string = functions.config().elasticemail.url;
    elasticmailApikey: string = functions.config().elasticemail.apikey;

    transitions: Transition[] = [{
        from: 'init',
        newStatus: OrderState.PENDING,
        notify:(order:Order)=> this.newOrder(order)
    },{
        from: OrderState.PENDING,
        newStatus: OrderState.VERIFIED,
        notify:(order:Order)=> this.verified(order)
    },{
        from: OrderState.PENDING,
        newStatus: OrderState.CANCELLED,
        notify:(order:Order)=> this.cancel(order)
    },{
        from: OrderState.PENDING,
        newStatus: OrderState.REFUSED,
        notify:(order:Order)=> this.refused(order)
    },{
        from: OrderState.VERIFIED,
        newStatus: OrderState.CONFIRMED,
        notify:(order:Order)=> this.confirmed(order)
    },{
        from: OrderState.VERIFIED,
        newStatus: OrderState.CANCELLED,
        notify:(order:Order)=> this.cancel(order)
    }];

    /**
     * Applique une transition
     * 
     * @param from 
     * @param newOrder 
     */
    public async applyTransition(from:string, newOrder:Order): Promise<void>{
        const transition = this.transitions.find(t => t.from === from && t.newStatus === newOrder.status);
        if(transition){
            await transition.notify();
            return;
        }else{
            return;
        }
    }
    

    private async createData(): Promise<URLSearchParams> {
        const data = new URLSearchParams();
        data.append('apikey', this.elasticmailApikey);
        data.append('from', 'noreply@ici-drive.fr');
        data.append('fromName', 'Ici drive');
        data.append('isTransactional', 'true');
        data.append('sender', 'contact@ici-drive.fr');
        data.append('senderName', 'App Ici drive');
        data.append('apikey', this.elasticmailApikey);
        return data;
    }

    private async send(templateName: string, to: string, subject: string, data: any): Promise<void> {
        const body = await this.createData();
        body.append('template', templateName);
        body.append('to', to);
        body.append('subject', subject);

        for (let [key, value] of Object.entries(data)) {
            body.append(`merge_${key}`, `${value}`);
        }

        return await axios.post(this.elasticmailUrl, body, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    }

    public async cancel(order:Order): Promise<void> {
        await Promise.all([this.send('ici_drive_annuler', order.maker?.email as any, Config.subjectCancelled,{
            order_link : `${Config.makerAppUrl}/orders/${order.id}`,
            order_ref: order.ref,
            order_reasonOf: order.reasonOf
        }), this.send('ici_drive_annuler', order.customer?.email as any, Config.subjectCancelled,{
            order_link : `${Config.customerAppUrl}/my-orders/${order.id}`,
            order_ref: order.ref,
            order_reasonOf: order.reasonOf
        })]);
    }

    public async refused(order:Order): Promise<void> {
        await Promise.all([this.send('ici_drive_refused', order.maker?.email as any, Config.subjectRefused,{
            order_link : `${Config.makerAppUrl}/orders/${order.id}`,
            order_ref: order.ref,
            order_reasonOf: order.reasonOf
        }), this.send('ici_drive_annuler', order.customer?.email as any, Config.subjectRefused,{
            order_link : `${Config.customerAppUrl}/my-orders/${order.id}`,
            order_ref: order.ref,
            order_reasonOf: order.reasonOf
        })]);
    }

    public async verified(order:Order): Promise<void> {
        await Promise.all([this.send('ici_drive_maker_verified', order.maker?.email as any, Config.subjectVerified,{
            order_link : `${Config.makerAppUrl}/orders/${order.id}`,
            order_ref: order.ref
        }), this.send('ici_drive_customer_verified', order.customer?.email as any, Config.subjectVerified,{
            order_link : `${Config.customerAppUrl}/my-orders/${order.id}`,
            order_ref: order.ref
        })]);
    }

    public async newOrder(order:Order): Promise<void> {
        await Promise.all([this.send('ici_drive_maker_new_cart', order.maker?.email as any, Config.subjectNewOrder,{
            order_link : `${Config.makerAppUrl}/orders/${order.id}`,
            maker_name: order.maker?.name
        }), this.send('ici_drive_customer_new_cart', order.customer?.email as any, Config.subjectNewOrder,{
            order_link : `${Config.customerAppUrl}/my-orders/${order.id}`
        })]);
    }

    public async remind(order:Order): Promise<void> {
        const paymentsLabels = [
            order.maker?.payments?.acceptCards ? `d'une carte`: null,
            order.maker?.payments?.acceptBankCheck ? `d'un chèque`: null,
            order.maker?.payments?.acceptCoins ? `d'espèces`: null].filter(c => c!==null).join(' / ');

        await this.send('ici_drive_customer_remind', order.customer?.email as any, Config.subjectRemind,{
            order_link : `${Config.customerAppUrl}/my-orders/${order.id}`,
            maker_customer_phone: order.customer?.phone,
            when : moment(order.slot).format('ddd D MMM à HH:mm'),
            maker_place_label: order.maker?.place.label,
            maker_place_address: order.maker?.place.address,
            maker_phone: order.maker?.phone,
            google_maps: '',
            payments_info: order.maker?.payments?.acceptPaypal ?
                `Le producteur ayant opté pour le paiement par PayPal, une demande de réglement vous sera adressée très prochainement.`
                :
                `Le producteur ayant opté pour le paiement sur le lieu du retrait, veuillez vous munir lors du retrait : ${paymentsLabels}`
        })
    }

    public async confirmed(order:Order): Promise<void> {
        const paypalMsg = `Vous avez opté pour le paiement via Paypal, veuillez ENVOYER via le site officielle Paypal la demande paiement au client :
        ${order.customer?.email}
        Avec le message : "ici-drive réservation ${order.ref}"`;
        const paymentsLabels = [
            order.maker?.payments?.acceptCards ? `d'une carte`: null,
            order.maker?.payments?.acceptBankCheck ? `d'un chèque`: null,
            order.maker?.payments?.acceptCoins ? `d'espèces`: null].filter(c => c!==null).join(' / ');
        const notPaypalMsg = `Vous avez opté pour le paiement au moment du retrait de la marchandise, le client sera muni : ${paymentsLabels}`;

        await Promise.all([this.send('ici_drive_maker_confirmed', order.maker?.email as any, Config.subjectCancelled,{
            order_link : `${Config.makerAppUrl}/orders/${order.id}`,
            maker_name: order.maker?.name,
            when : moment(order.slot).format('ddd D MMM à HH:mm'),
            maker_place_label: order.maker?.place.label,
            maker_place_address: order.maker?.place.address,
            maker_phone: order.maker?.phone,
            payments_info: order.maker?.payments?.acceptPaypal ? paypalMsg : notPaypalMsg
        }), this.send('ici_drive_customer_new_cart', order.customer?.email as any, Config.subjectCancelled,{
            order_link : `${Config.customerAppUrl}/my-orders/${order.id}`,
            maker_customer_phone: order.customer?.phone,
            when : moment(order.slot).format('ddd D MMM à HH:mm'),
            maker_place_label: order.maker?.place.label,
            maker_place_address: order.maker?.place.address,
            maker_phone: order.maker?.phone,
            google_maps: '',
            payments_info: order.maker?.payments?.acceptPaypal ?
                `Le producteur ayant opté pour le paiement par PayPal, une demande de réglement vous sera adressée très prochainement.`
                :
                `Le producteur ayant opté pour le paiement sur le lieu du retrait, veuillez vous munir lors du retrait : ${paymentsLabels}`
        })]);
    }
}

export default new NotifService();