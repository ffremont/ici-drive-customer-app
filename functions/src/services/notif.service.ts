import * as functions from 'firebase-functions';
import axios from 'axios';
import { Order } from '../models/order';

export class NotifService {

    elasticmailUrl: string = functions.config().elasticemail.url;
    elasticmailApikey: string = functions.config().elasticemail.apikey;

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

    }
}

export default new NotifService();