import axios, {AxiosRequestConfig} from 'axios';
import { Subscription, Subject } from 'rxjs';
import { HttpCall } from '../models/httpcall';
import authService from './auth.service';


class HttpClientService{
    private subRequest = new Subject<HttpCall>();
    private subResponse = new Subject<HttpCall>();

    private config: AxiosRequestConfig;
    private idToken: string|null = null;

    public axios:any;

    constructor(){
        setTimeout(() => {
            authService.subToken.subscribe( (token:any) => this.idToken = token );
        },0);

        this.config = {
            responseType: 'json',
            timeout: 15000,
            transformRequest: [(data:any, headers:any)=>{
                if(this.idToken !== null){
                    headers.Authorization = `Bearer ${this.idToken}`;
                }
                this.subRequest.next({data, headers});
                return data;
            }],
            transformResponse: [(data:any, headers:any)=>{
                this.subResponse.next({data, headers});
                return data;
            }]
        };
        this.axios = axios.create(this.config);
        //// Alter defaults after instance has been created
        //instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    }

    public subOnRequest(func:any): Subscription{
        return this.subRequest.subscribe(func);
    }

    public subOnResponse(func:any): Subscription{
        return this.subResponse.subscribe(func);
    }
}

export default new HttpClientService() ;