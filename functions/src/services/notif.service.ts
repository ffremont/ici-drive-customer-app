import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import { Order, OrderState } from '../models/order';
import { Config } from '../config';
import * as moment from 'moment';

interface Transition {
    from: string,
    newStatus: OrderState,
    notify: any
}

interface FirebaseMessage {
    token: string,
    notification: {
        title: string,
        body: string
    },
    data: any
}

export class NotifService {

    elasticmailUrl: string = functions.config().elasticemail.url;
    elasticmailApikey: string = functions.config().elasticemail.apikey;

    transitions: Transition[] = [{
        from: 'init',
        newStatus: OrderState.PENDING,
        notify: (order: Order, fcm: string | null) => this.newOrder(order, fcm)
    }, {
        from: OrderState.PENDING,
        newStatus: OrderState.VERIFIED,
        notify: (order: Order, fcm: string | null) => this.verified(order, fcm)
    }, {
        from: OrderState.PENDING,
        newStatus: OrderState.CANCELLED,
        notify: (order: Order, fcm: string | null) => this.cancel(order, fcm)
    }, {
        from: OrderState.PENDING,
        newStatus: OrderState.REFUSED,
        notify: (order: Order, fcm: string | null) => this.refused(order, fcm)
    }, {
        from: OrderState.VERIFIED,
        newStatus: OrderState.CONFIRMED,
        notify: (order: Order, fcm: string | null) => this.confirmed(order, fcm)
    }, {
        from: OrderState.VERIFIED,
        newStatus: OrderState.CANCELLED,
        notify: (order: Order, fcm: string | null) => this.cancel(order, fcm)
    }];

    /**
     * Applique une transition
     * 
     * @param fcm token de l'utilisateur courant
     * @param from 
     * @param newOrder 
     */
    public async applyTransition(fcm: string | null, from: string, newOrder: Order): Promise<void> {
        const transition = this.transitions.find(t => t.from === from && t.newStatus === newOrder.status);
        if (transition) {
            await transition.notify(newOrder, fcm);
            return;
        } else {
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

    public async cancel(order: Order, fcm: string | null): Promise<void> {
        const promises : any = [];

        if (fcm) {
            // to user
            const messages = [{
                token: fcm,
                data: { url : `${Config.customerAppUrl}/my-orders/${order.id}`},
                notification: {
                    title: `Réservation annulée`,
                    body: `${order.ref} est été annulée`
                }
            } as FirebaseMessage];
            // to maker
            if(order.maker?.fcm){
                messages.push({
                    token: order.maker?.fcm,
                    data: { url : `${Config.makerAppUrl}/orders/${order.id}`},
                    notification: {
                        title: `Réservation annulée`,
                        body: `${order.ref} est été annulée`
                    }
                } as FirebaseMessage);
            }
            
            promises.push(admin.messaging().sendAll(messages));
        }

        promises.push(this.send('ici_drive_annuler', order.maker?.email as any, Config.subjectCancelled, {
            order_link: `${Config.makerAppUrl}/orders/${order.id}`,
            order_ref: order.ref,
            order_reasonOf: order.reasonOf
        }));
        promises.push(this.send('ici_drive_annuler', order.customer?.email as any, Config.subjectCancelled, {
            order_link: `${Config.customerAppUrl}/my-orders/${order.id}`,
            order_ref: order.ref,
            order_reasonOf: order.reasonOf
        }));

        await Promise.all(promises);
    }

    public async refused(order: Order, fcm: string | null): Promise<void> {
        const promises : any = [];

        if (fcm) {
            // to user
            const messages = [{
                token: fcm,
                data: { url : `${Config.customerAppUrl}/my-orders/${order.id}`},
                notification: {
                    title: `Réservation refusée`,
                    body: `${order.ref} est été refusée`
                }
            } as FirebaseMessage];
            // to maker
            if(order.maker?.fcm){
                messages.push({
                    token: order.maker?.fcm,
                    data: { url : `${Config.makerAppUrl}/orders/${order.id}`},
                    notification: {
                        title: `Réservation refusée`,
                        body: `${order.ref} est été refusée`
                    }
                } as FirebaseMessage);
            }
            
            promises.push(admin.messaging().sendAll(messages));
        }

        promises.push(this.send('ici_drive_refused', order.maker?.email as any, Config.subjectRefused, {
            order_link: `${Config.makerAppUrl}/orders/${order.id}`,
            order_ref: order.ref,
            order_reasonOf: order.reasonOf
        }));
        promises.push(this.send('ici_drive_annuler', order.customer?.email as any, Config.subjectRefused, {
            order_link: `${Config.customerAppUrl}/my-orders/${order.id}`,
            order_ref: order.ref,
            order_reasonOf: order.reasonOf
        }));

        await Promise.all(promises);
    }

    public async verified(order: Order, fcm: string | null): Promise<void> {
        const promises : any = [];

        if (fcm) {
            // to user
            const messages = [{
                token: fcm,
                data: { url : `${Config.customerAppUrl}/my-orders/${order.id}`},
                notification: {
                    title: `Réservation vérifiée`,
                    body: `Veuillez confirmer la réservation ${order.ref}`
                }
            } as FirebaseMessage];
            // to maker
            if(order.maker?.fcm){
                messages.push({
                    token: order.maker?.fcm,
                    data: { url : `${Config.makerAppUrl}/orders/${order.id}`},
                    notification: {
                        title: `Réservation vérifiée`,
                        body: `${order.ref} a bien été vérifiée`
                    }
                } as FirebaseMessage);
            }
            
            promises.push(admin.messaging().sendAll(messages));
        }

        promises.push(this.send('ici_drive_maker_verified', order.maker?.email as any, Config.subjectVerified, {
            order_link: `${Config.makerAppUrl}/orders/${order.id}`,
            order_ref: order.ref
        }));
        promises.push(this.send('ici_drive_customer_verified', order.customer?.email as any, Config.subjectVerified, {
            order_link: `${Config.customerAppUrl}/my-orders/${order.id}`,
            order_ref: order.ref
        }));

        await Promise.all(promises);
    }

    public async newOrder(order: Order, fcm: string | null): Promise<void> {
        const promises : any = [];

        if (fcm) {
            // to user
            const messages = [{
                token: fcm,
                data: { url : `${Config.customerAppUrl}/my-orders/${order.id}`},
                notification: {
                    title: `Nouvelle réservation`,
                    body: `Le producteur va vérifier la réservation ${order.ref} très prochainement`
                }
            } as FirebaseMessage];
            // to maker
            if(order.maker?.fcm){
                messages.push({
                    token: order.maker?.fcm,
                    data: { url : `${Config.makerAppUrl}/orders/${order.id}`},
                    notification: {
                        title: `Nouvelle réservation`,
                        body: `Une vérification est nécessaire pour la réservation ${order.ref}`
                    }
                } as FirebaseMessage);
            }
            
            promises.push(admin.messaging().sendAll(messages));
        }

        promises.push(this.send('ici_drive_maker_new_cart', order.maker?.email as any, Config.subjectNewOrder, {
            order_link: `${Config.makerAppUrl}/orders/${order.id}`,
            maker_name: order.maker?.name
        }));
        promises.push(this.send('ici_drive_customer_new_cart', order.customer?.email as any, Config.subjectNewOrder, {
            order_link: `${Config.customerAppUrl}/my-orders/${order.id}`
        }));
    
        await Promise.all(promises);
    }

    public async remind(order: Order, fcm: string | null): Promise<void> {
        const paymentsLabels = [
            order.maker?.payments?.acceptCards ? `d'une carte` : null,
            order.maker?.payments?.acceptBankCheck ? `d'un chèque` : null,
            order.maker?.payments?.acceptCoins ? `d'espèces` : null].filter(c => c !== null).join(' / ');

        const promises : any = [];

        if (fcm) {
            promises.push(admin.messaging().send({
                token: fcm,
                data: { url : `${Config.customerAppUrl}/my-orders/${order.id}`},
                notification: {
                    title: `Rappel du retrait`,
                    body: `Votre réservation ${order.ref} vous attend le ${moment(order.slot).format('ddd D MMM à HH:mm')}`
                }
            } as FirebaseMessage));
        }

        promises.push(this.send('ici_drive_customer_remind', order.customer?.email as any, Config.subjectRemind, {
            order_link: `${Config.customerAppUrl}/my-orders/${order.id}`,
            maker_customer_phone: order.customer?.phone,
            when: moment(order.slot).format('ddd D MMM à HH:mm'),
            maker_place_label: order.maker?.place.label,
            maker_place_address: order.maker?.place.address,
            maker_phone: order.maker?.phone,
            google_maps: '',
            payments_info: order.maker?.payments?.acceptPaypal ?
                `Le producteur ayant opté pour le paiement par PayPal, une demande de réglement vous sera adressée très prochainement.`
                :
                `Le producteur ayant opté pour le paiement sur le lieu du retrait, veuillez vous munir lors du retrait : ${paymentsLabels}`
        }));

        await Promise.all(promises);
    }

    public async confirmed(order: Order, fcm: string | null): Promise<void> {
        const promises : any = [];

        if (fcm) {
            // to user
            const messages = [{
                token: fcm,
                data: { url : `${Config.customerAppUrl}/my-orders/${order.id}`},
                notification: {
                    title: `Nouvelle réservation`,
                    body: `Le producteur va vérifier la réservation ${order.ref} très prochainement`
                }
            } as FirebaseMessage];
            // to maker
            if(order.maker?.fcm){
                messages.push({
                    token: order.maker?.fcm,
                    data: { url : `${Config.makerAppUrl}/orders/${order.id}`},
                    notification: {
                        title: `Nouvelle réservation`,
                        body: `Une vérification est nécessaire pour la réservation ${order.ref}`
                    }
                } as FirebaseMessage);
            }
            
            promises.push(admin.messaging().sendAll(messages));
        }

        const paypalMsg = `Vous avez opté pour le paiement via Paypal, veuillez ENVOYER via le site officielle Paypal la demande paiement au client :
        ${order.customer?.email}
        Avec le message : "ici-drive réservation ${order.ref}"`;
        const paymentsLabels = [
            order.maker?.payments?.acceptCards ? `d'une carte` : null,
            order.maker?.payments?.acceptBankCheck ? `d'un chèque` : null,
            order.maker?.payments?.acceptCoins ? `d'espèces` : null].filter(c => c !== null).join(' / ');
        const notPaypalMsg = `Vous avez opté pour le paiement au moment du retrait de la marchandise, le client sera muni : ${paymentsLabels}`;

        promises.push(this.send('ici_drive_maker_confirmed', order.maker?.email as any, Config.subjectCancelled, {
            order_link: `${Config.makerAppUrl}/orders/${order.id}`,
            maker_name: order.maker?.name,
            when: moment(order.slot).format('ddd D MMM à HH:mm'),
            maker_place_label: order.maker?.place.label,
            maker_place_address: order.maker?.place.address,
            maker_phone: order.maker?.phone,
            payments_info: order.maker?.payments?.acceptPaypal ? paypalMsg : notPaypalMsg
        }));
        promises.push(this.send('ici_drive_customer_new_cart', order.customer?.email as any, Config.subjectCancelled, {
            order_link: `${Config.customerAppUrl}/my-orders/${order.id}`,
            maker_customer_phone: order.customer?.phone,
            when: moment(order.slot).format('ddd D MMM à HH:mm'),
            maker_place_label: order.maker?.place.label,
            maker_place_address: order.maker?.place.address,
            maker_phone: order.maker?.phone,
            google_maps: '',
            payments_info: order.maker?.payments?.acceptPaypal ?
                `Le producteur ayant opté pour le paiement par PayPal, une demande de réglement vous sera adressée très prochainement.`
                :
                `Le producteur ayant opté pour le paiement sur le lieu du retrait, veuillez vous munir lors du retrait : ${paymentsLabels}`
        }));
        await Promise.all(promises);
    }
}

export default new NotifService();