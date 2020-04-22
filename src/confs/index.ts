
import { Configuration } from "./configuration";


const DEV_API_BASEURL = '/api-mock';
const other: Configuration = {
    API: {
        partners: () => `${DEV_API_BASEURL}/partners.json`,
        products: (partnerId:string) => `${DEV_API_BASEURL}/partners/${partnerId}/products.json`
    },
    categories:[
        { "label": "Boeuf / Veau", "id": "boeuf-veau"},
        { "label": "Volaille / Lapin", "id": "volaille-lapin"},
        { "label": "Agneau / Porc", "id": "agneau-porc"},
        { "label": "Charcuterie", "id": "charcuterie"},
        { "label": "Boisson / Vin", "id": "boisson-vin"},
        { "label": "Epicerie", "id": "epicerie"},
        { "label": "Fromage", "id": "fromage"},
        { "label": "Pâtes / Légumineuses", "id": "pates-leg"},
        { "label": "Glace", "id": "glace"},
        { "label": "Fruit / Légume", "id": "fruit-leg"},
        { "label": "Mer", "id": "mer"},
        { "label": "Miel", "id": "miel"},
        { "label": "Crèmerie", "id": "cremerie"}
    ]
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    API: {
        partners: () => `${API_BASEURL}/partners`,
        products: (partnerId:string) => `${DEV_API_BASEURL}/partners/${partnerId}/products`
    },
    categories:[]
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};