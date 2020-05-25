import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as moment from 'moment';
import 'moment/locale/fr';
import testResource from './resources/test.resource';
import makerResource from './resources/maker.resource';
import myOrderResource from './resources/myorder.resource';
import myProfilResource from './resources/myprofil.resource';
import adminMakerResource from './resources/admin-maker.resource';
import adminOrderResource from './resources/admin-order.resource';
import schedulerResource from './resources/scheduler.resource';
import busboy from './middlewares/busboy';
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

const runtimeOpts = {
    timeoutSeconds: 300,
    memory: functions.VALID_MEMORY_OPTIONS[1]
}   


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

// ADMINISTRATION
app.get('/api/admin/makers/self', adminMakerResource.getSelf.bind(adminMakerResource));
app.post('/api/admin/makers/self/products/', busboy, adminMakerResource.addProduct.bind(adminMakerResource));
app.put('/api/admin/makers/self/products/:ref', busboy, adminMakerResource.updateProduct.bind(adminMakerResource));
app.delete('/api/admin/makers/self/products/:ref', adminMakerResource.deleteProduct.bind(adminMakerResource));

app.get('/api/admin/my-orders', adminOrderResource.getOrders.bind(adminOrderResource));
app.put('/api/admin/my-orders/:id', adminOrderResource.updateOrder.bind(adminOrderResource));
app.get('/api/admin/my-orders/:id', adminOrderResource.getOrder.bind(adminOrderResource));

// scheduler
app.post('/api/scheduler/heatbeat', schedulerResource.heatbeat.bind(schedulerResource));

export const api = functions.runWith(runtimeOpts).https.onRequest(app);
//export const searchMaker = functions.https.onRequest(makerResource.search.bind(makerResource));
//export const testAdd = functions.https.onRequest(testResource.addAmaker.bind(testResource));
//export const testFind = functions.https.onRequest(testResource.findAll.bind(testResource));


