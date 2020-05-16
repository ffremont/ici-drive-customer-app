import * as functions from 'firebase-functions';
import axios, { AxiosRequestConfig } from 'axios';
import { AppUtil } from '../apputil';


export class BunnyCdn {
    private axios: any;

    public baseURL = functions.config().bunnycdn.url;

    constructor() {
        const config: AxiosRequestConfig = {
            responseType: 'json',
            timeout: 15000,
            headers: {
                'User-Agent': `bunnycdn-node-client/1`,
                'AccessKey': functions.config().bunnycdn.apikey
            }
        };
        this.axios = axios.create(config);
    }

    private throwError(err: any) {
        const error: any = new Error('Internal Server Error')
        error.status = 500

        baseURL: 

        throw error
    }

    private async _req(url = '', method: string, data: any = null) {
        try {
            AppUtil.debug(`BunnyCDN PUT STORAGER ${method} : ${url}`)
            const resp = await this.axios({
                method,
                url,
                data
            });

            return resp.body;
        } catch (err) {
            return this.throwError(err)
        }
        
    }

    public async upload(path: string, body: any)  {
        AppUtil.debug(`BunnyCdn.upload > ${path}`);
        return await this._req(path, 'PUT', body);
    }

    public async delete(path: string) {
        AppUtil.debug(`BunnyCdn.delete > ${path}`);
        return await this._req(path, 'DELETE')
    }

}

export default new BunnyCdn();