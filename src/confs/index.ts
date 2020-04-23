
import { Configuration } from "./configuration";


const DEV_API_BASEURL = '/api-mock';
const other: Configuration = {
    cgu: 'https://docs.google.com/document/d/e/2PACX-1vRxz61BpPZL-YJXX2E6tvdYsI0PG1vxv1eGjxQ7TMfqififiO-Snb5pZU21bkjZgTHyENu3I5nFzxRZ/pub',
    cgv: '',
    API: {
        markers: () => `${DEV_API_BASEURL}/markers.json`,
        products: (makerId:string) => `${DEV_API_BASEURL}/markers/${makerId}/products.json`
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
    cgu: 'https://docs.google.com/document/d/e/2PACX-1vRxz61BpPZL-YJXX2E6tvdYsI0PG1vxv1eGjxQ7TMfqififiO-Snb5pZU21bkjZgTHyENu3I5nFzxRZ/pub',
    cgv: '',
    API: {
        markers: () => `${API_BASEURL}/markers`,
        products: (makerId:string) => `${DEV_API_BASEURL}/markers/${makerId}/products`
    },
    categories:[]
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};