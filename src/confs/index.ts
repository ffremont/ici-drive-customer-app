
import { Configuration } from "./configuration";
import { GeoPoint } from "../models/geo-point";


const DEV_API_BASEURL = '/api-mock';
const other: Configuration = {
    cgu: 'https://docs.google.com/document/d/e/2PACX-1vRxz61BpPZL-YJXX2E6tvdYsI0PG1vxv1eGjxQ7TMfqififiO-Snb5pZU21bkjZgTHyENu3I5nFzxRZ/pub',
    cgr: 'https://docs.google.com/document/d/e/2PACX-1vTQkz2Kno4710sHi1MDtQwbIRU3tkddacvc5mlkHKfcJtOpcGLdKxxWDbPyxm4-mnLdeSyRVL4tjJKB/pub',
    acceptableUsePolicy:'https://docs.google.com/document/d/e/2PACX-1vTDZdAk4Eg5oBqaT6IMNagPLsX3---VBud8Qm2WjJCzhMWTeC-j3xlsyqNJfgd61RJIADouTWUDXzwj/pub',
    privacy_policy:'https://docs.google.com/document/d/e/2PACX-1vQp5YBhJywagTbos-519cIP2hwKv4GyxE3C0FGPIrZOsYa-2FA1WZwSbfoWudsGYt9508AUwdoYWqrN/pub',
    mentions:'https://docs.google.com/document/d/e/2PACX-1vR68Ij4_PaCqHJrq7Fv-ytuTgkfdC1SIJcMXeiGM0xqK06TsSLPKxwY3pb6dWA3IWPpM2GiGjj9g3Xc/pub',
    makersNearKm:50,
    support: 'https://forms.gle/q4KYieunhwWVn1BR6',
    baseURL: 'https://app.ici-drive.fr',
    startDriveAfterDays:5,
    defaultPlaceholderOrderComment: 'Précision à apporter sur la réservation',
    fcmPublicVapidKey: 'BO7yESbBXsx7ddVzYqvkNpWf-3S6sjqQxEoolQQ1OG02D0-nmrpowEsYRHuoGEzT4w5Np6Gdwto5FiLsS--sONw',
    API: {
        makers: (makerId:any = null) => `${DEV_API_BASEURL}/makers${makerId === null ? '.json': '/'+makerId+'/index.json'}`,
        searchMakers: (geoPoint:GeoPoint) => `${DEV_API_BASEURL}/makers-2.json`,
        orders: (ref?:string) => `${DEV_API_BASEURL}/${ref ? 'order-'+ref+'.json': 'my-orders.json'}`,
        myProfil: () => `${DEV_API_BASEURL}/my-profil.json`
    },
    categories:[
        { "label": "Viandes", "id": "viandes"},
        { "label": "Oeufs", "id": "oeufs"},
        { "label": "Laitiers", "id": "laitiers"},
        { "label": "Epiceries", "id": "epiceries"},
        { "label": "Fruits / Légumes", "id": "fruit-leg"},
        { "label": "Mer", "id": "mer"},
        { "label": "Glaces", "id": "glace"},
        { "label": "Boissons", "id": "boissons"},

        // restaurateur
        { "label": "Menus", "id": "menus"},

        // commerçant
        { "label": "Jouets", "id": "jouets"},
        { "label": "Vêtements", "id": "vetements"},
        { "label": "Jardinage", "id": "jardinage"},
        { "label": "Décoration", "id": "decoration"},
        { "label": "Tech", "id": "tech"},
    ],
    publicHolidays:[{"date":"2019-12-25","public_holiday":true,"label":"Noël"},{"date":"2020-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2020-04-13","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2020-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2020-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2020-05-21","public_holiday":true,"label":"Ascension"},{"date":"2020-06-01","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2020-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2020-08-15","public_holiday":true,"label":"Assomption"},{"date":"2020-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2020-11-11","public_holiday":true,"label":"Armistice"},{"date":"2020-12-25","public_holiday":true,"label":"Noël"},{"date":"2021-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2021-04-05","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2021-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2021-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2021-05-13","public_holiday":true,"label":"Ascension"},{"date":"2021-05-24","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2021-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2021-08-15","public_holiday":true,"label":"Assomption"},{"date":"2021-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2021-11-11","public_holiday":true,"label":"Armistice"},{"date":"2021-12-25","public_holiday":true,"label":"Noël"},{"date":"2022-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2022-04-18","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2022-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2022-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2022-05-26","public_holiday":true,"label":"Ascension"},{"date":"2022-06-06","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2022-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2022-08-15","public_holiday":true,"label":"Assomption"},{"date":"2022-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2022-11-11","public_holiday":true,"label":"Armistice"},{"date":"2022-12-25","public_holiday":true,"label":"Noël"},{"date":"2023-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2023-04-10","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2023-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2023-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2023-05-18","public_holiday":true,"label":"Ascension"},{"date":"2023-05-29","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2023-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2023-08-15","public_holiday":true,"label":"Assomption"},{"date":"2023-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2023-11-11","public_holiday":true,"label":"Armistice"},{"date":"2023-12-25","public_holiday":true,"label":"Noël"},{"date":"2024-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2024-04-01","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2024-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2024-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2024-05-09","public_holiday":true,"label":"Ascension"},{"date":"2024-05-20","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2024-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2024-08-15","public_holiday":true,"label":"Assomption"},{"date":"2024-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2024-11-11","public_holiday":true,"label":"Armistice"},{"date":"2024-12-25","public_holiday":true,"label":"Noël"},{"date":"2025-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2025-04-21","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2025-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2025-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2025-05-29","public_holiday":true,"label":"Ascension"},{"date":"2025-06-09","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2025-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2025-08-15","public_holiday":true,"label":"Assomption"},{"date":"2025-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2025-11-11","public_holiday":true,"label":"Armistice"},{"date":"2025-12-25","public_holiday":true,"label":"Noël"},{"date":"2026-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2026-04-06","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2026-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2026-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2026-05-14","public_holiday":true,"label":"Ascension"},{"date":"2026-05-25","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2026-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2026-08-15","public_holiday":true,"label":"Assomption"},{"date":"2026-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2026-11-11","public_holiday":true,"label":"Armistice"},{"date":"2026-12-25","public_holiday":true,"label":"Noël"},{"date":"2027-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2027-03-29","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2027-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2027-05-06","public_holiday":true,"label":"Ascension"},{"date":"2027-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2027-05-17","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2027-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2027-08-15","public_holiday":true,"label":"Assomption"},{"date":"2027-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2027-11-11","public_holiday":true,"label":"Armistice"},{"date":"2027-12-25","public_holiday":true,"label":"Noël"},{"date":"2028-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2028-04-17","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2028-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2028-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2028-05-25","public_holiday":true,"label":"Ascension"},{"date":"2028-06-05","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2028-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2028-08-15","public_holiday":true,"label":"Assomption"},{"date":"2028-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2028-11-11","public_holiday":true,"label":"Armistice"},{"date":"2028-12-25","public_holiday":true,"label":"Noël"},{"date":"2029-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2029-04-02","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2029-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2029-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2029-05-10","public_holiday":true,"label":"Ascension"},{"date":"2029-05-21","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2029-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2029-08-15","public_holiday":true,"label":"Assomption"},{"date":"2029-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2029-11-11","public_holiday":true,"label":"Armistice"},{"date":"2029-12-25","public_holiday":true,"label":"Noël"},{"date":"2030-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2030-04-22","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2030-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2030-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2030-05-30","public_holiday":true,"label":"Ascension"},{"date":"2030-06-10","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2030-07-14","public_holiday":true,"label":"Fête Nationale"}]
} ;

const API_BASEURL = '/api';
const prod: Configuration = {
    cgu: 'https://docs.google.com/document/d/e/2PACX-1vRxz61BpPZL-YJXX2E6tvdYsI0PG1vxv1eGjxQ7TMfqififiO-Snb5pZU21bkjZgTHyENu3I5nFzxRZ/pub',
    makersNearKm:200,
    cgr: 'https://docs.google.com/document/d/e/2PACX-1vTQkz2Kno4710sHi1MDtQwbIRU3tkddacvc5mlkHKfcJtOpcGLdKxxWDbPyxm4-mnLdeSyRVL4tjJKB/pub',
    acceptableUsePolicy:'https://docs.google.com/document/d/e/2PACX-1vTDZdAk4Eg5oBqaT6IMNagPLsX3---VBud8Qm2WjJCzhMWTeC-j3xlsyqNJfgd61RJIADouTWUDXzwj/pub',
    mentions:'https://docs.google.com/document/d/e/2PACX-1vR68Ij4_PaCqHJrq7Fv-ytuTgkfdC1SIJcMXeiGM0xqK06TsSLPKxwY3pb6dWA3IWPpM2GiGjj9g3Xc/pub',
    privacy_policy:'https://docs.google.com/document/d/e/2PACX-1vQp5YBhJywagTbos-519cIP2hwKv4GyxE3C0FGPIrZOsYa-2FA1WZwSbfoWudsGYt9508AUwdoYWqrN/pub',
    support: 'https://forms.gle/q4KYieunhwWVn1BR6',
    baseURL: 'https://app.ici-drive.fr',
    defaultPlaceholderOrderComment: 'Précision à apporter sur la réservation',
    startDriveAfterDays:5,
    fcmPublicVapidKey: 'BO7yESbBXsx7ddVzYqvkNpWf-3S6sjqQxEoolQQ1OG02D0-nmrpowEsYRHuoGEzT4w5Np6Gdwto5FiLsS--sONw',
    API: {
        makers: (makerId:any = '') => `${API_BASEURL}/makers${makerId ? '/'+makerId: ''}`,
        searchMakers: (geoPoint:GeoPoint) => `${API_BASEURL}/makers?near=${geoPoint.latitude},${geoPoint.longitude}`,

        orders: (ref?:string) => `${API_BASEURL}/my-orders/${ref || ''}`,
        myProfil: () => `${API_BASEURL}/my-profil`,
    },
    categories:[
        { "label": "Viandes", "id": "viandes"},
        { "label": "Oeufs", "id": "oeufs"},
        { "label": "Laitiers", "id": "laitiers"},
        { "label": "Epiceries", "id": "epiceries"},
        { "label": "Fruits / Légumes", "id": "fruit-leg"},
        { "label": "Mer", "id": "mer"},
        { "label": "Glaces", "id": "glace"},
        { "label": "Boissons", "id": "boissons"},

        // restaurateur
        { "label": "Menus", "id": "menus"},

        // commerçant
        { "label": "Jouets", "id": "jouets"},
        { "label": "Vêtements", "id": "vetements"},
        { "label": "Jardinage", "id": "jardinage"},
        { "label": "Décoration", "id": "decoration"},
        { "label": "Tech", "id": "tech"},
    ],
    publicHolidays:[{"date":"2019-12-25","public_holiday":true,"label":"Noël"},{"date":"2020-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2020-04-13","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2020-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2020-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2020-05-21","public_holiday":true,"label":"Ascension"},{"date":"2020-06-01","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2020-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2020-08-15","public_holiday":true,"label":"Assomption"},{"date":"2020-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2020-11-11","public_holiday":true,"label":"Armistice"},{"date":"2020-12-25","public_holiday":true,"label":"Noël"},{"date":"2021-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2021-04-05","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2021-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2021-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2021-05-13","public_holiday":true,"label":"Ascension"},{"date":"2021-05-24","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2021-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2021-08-15","public_holiday":true,"label":"Assomption"},{"date":"2021-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2021-11-11","public_holiday":true,"label":"Armistice"},{"date":"2021-12-25","public_holiday":true,"label":"Noël"},{"date":"2022-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2022-04-18","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2022-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2022-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2022-05-26","public_holiday":true,"label":"Ascension"},{"date":"2022-06-06","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2022-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2022-08-15","public_holiday":true,"label":"Assomption"},{"date":"2022-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2022-11-11","public_holiday":true,"label":"Armistice"},{"date":"2022-12-25","public_holiday":true,"label":"Noël"},{"date":"2023-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2023-04-10","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2023-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2023-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2023-05-18","public_holiday":true,"label":"Ascension"},{"date":"2023-05-29","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2023-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2023-08-15","public_holiday":true,"label":"Assomption"},{"date":"2023-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2023-11-11","public_holiday":true,"label":"Armistice"},{"date":"2023-12-25","public_holiday":true,"label":"Noël"},{"date":"2024-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2024-04-01","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2024-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2024-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2024-05-09","public_holiday":true,"label":"Ascension"},{"date":"2024-05-20","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2024-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2024-08-15","public_holiday":true,"label":"Assomption"},{"date":"2024-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2024-11-11","public_holiday":true,"label":"Armistice"},{"date":"2024-12-25","public_holiday":true,"label":"Noël"},{"date":"2025-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2025-04-21","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2025-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2025-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2025-05-29","public_holiday":true,"label":"Ascension"},{"date":"2025-06-09","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2025-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2025-08-15","public_holiday":true,"label":"Assomption"},{"date":"2025-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2025-11-11","public_holiday":true,"label":"Armistice"},{"date":"2025-12-25","public_holiday":true,"label":"Noël"},{"date":"2026-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2026-04-06","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2026-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2026-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2026-05-14","public_holiday":true,"label":"Ascension"},{"date":"2026-05-25","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2026-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2026-08-15","public_holiday":true,"label":"Assomption"},{"date":"2026-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2026-11-11","public_holiday":true,"label":"Armistice"},{"date":"2026-12-25","public_holiday":true,"label":"Noël"},{"date":"2027-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2027-03-29","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2027-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2027-05-06","public_holiday":true,"label":"Ascension"},{"date":"2027-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2027-05-17","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2027-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2027-08-15","public_holiday":true,"label":"Assomption"},{"date":"2027-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2027-11-11","public_holiday":true,"label":"Armistice"},{"date":"2027-12-25","public_holiday":true,"label":"Noël"},{"date":"2028-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2028-04-17","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2028-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2028-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2028-05-25","public_holiday":true,"label":"Ascension"},{"date":"2028-06-05","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2028-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2028-08-15","public_holiday":true,"label":"Assomption"},{"date":"2028-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2028-11-11","public_holiday":true,"label":"Armistice"},{"date":"2028-12-25","public_holiday":true,"label":"Noël"},{"date":"2029-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2029-04-02","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2029-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2029-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2029-05-10","public_holiday":true,"label":"Ascension"},{"date":"2029-05-21","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2029-07-14","public_holiday":true,"label":"Fête Nationale"},{"date":"2029-08-15","public_holiday":true,"label":"Assomption"},{"date":"2029-11-01","public_holiday":true,"label":"Toussaint"},{"date":"2029-11-11","public_holiday":true,"label":"Armistice"},{"date":"2029-12-25","public_holiday":true,"label":"Noël"},{"date":"2030-01-01","public_holiday":true,"label":"Jour de l'an"},{"date":"2030-04-22","public_holiday":true,"label":"Lundi de Pâques"},{"date":"2030-05-01","public_holiday":true,"label":"Fête du travail"},{"date":"2030-05-08","public_holiday":true,"label":"Victoire des alliés"},{"date":"2030-05-30","public_holiday":true,"label":"Ascension"},{"date":"2030-06-10","public_holiday":true,"label":"Lundi de Pentecôte"},{"date":"2030-07-14","public_holiday":true,"label":"Fête Nationale"}]
} ;

const config = process.env.REACT_APP_STAGE === 'prod'  ? prod : other;

  export default { ...config};