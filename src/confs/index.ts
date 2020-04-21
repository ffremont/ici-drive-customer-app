
import { Configuration } from "./configuration";


const DEV_API_BASEURL = '/api-mock';
const other: Configuration = {
    API: {
        partners: () => `${DEV_API_BASEURL}/partners.json`,
        products: (partnerId:string) => `${DEV_API_BASEURL}/partners/${partnerId}/products.json`
    }
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    API: {
        partners: () => `${API_BASEURL}/partners`,
        products: (partnerId:string) => `${DEV_API_BASEURL}/partners/${partnerId}/products`
    }
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};