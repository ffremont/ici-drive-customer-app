import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
import 'moment/locale/fr';
import testResource from './resources/test.resource';
import makerResource from './resources/maker.resource';
import myOrderResource from './resources/myorder.resource';
import myProfilResource from './resources/myprofil.resource';
import context from './context';
import express = require('express');

const customCreds: any = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (customCreds) {
    let serviceAccount = require(customCreds);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    admin.initializeApp();
}
context.db(admin.firestore());
moment.locale('fr');


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// https://firebase.google.com/docs/functions/config-env
// https://medium.com/@tacomanator/environments-with-create-react-app-7b645312c09d
//

const app = express();

app.get('/api/makers', makerResource.search.bind(makerResource));
app.get('/api/makers/:id', makerResource.getFullMaker.bind(makerResource));

app.post('/api/my-orders', myOrderResource.newCart.bind(myOrderResource));
app.get('/api/my-orders', myOrderResource.getAll.bind(myOrderResource));
app.get('/api/my-orders/:id', myOrderResource.get.bind(myOrderResource));
app.put('/api/my-orders/:id', myOrderResource.update.bind(myOrderResource));

app.get('/api/my-profil', myProfilResource.get.bind(myProfilResource));
app.put('/api/my-profil', myProfilResource.update.bind(myProfilResource));

export const api = functions.https.onRequest(app);
export const searchMaker = functions.https.onRequest(makerResource.search.bind(makerResource));
export const testAdd = functions.https.onRequest(testResource.add.bind(testResource));
export const testFind = functions.https.onRequest(testResource.findAll.bind(testResource));


