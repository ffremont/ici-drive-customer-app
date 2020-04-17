
import { Configuration } from "./configuration";


const DEV_API_BASEURL = '/api-mock';
const other: Configuration = {
    API: {
        partners: `${DEV_API_BASEURL}/partners.json`
    }
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    API: {
        partners: `${API_BASEURL}/partners`
    }
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};