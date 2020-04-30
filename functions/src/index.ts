import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import testResource from './resources/test.resource';
import makerResource from './resources/maker.resource';
import myOrderResource from './resources/myorder.resource';
import context from './context';

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


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
// https://firebase.google.com/docs/functions/config-env
// https://medium.com/@tacomanator/environments-with-create-react-app-7b645312c09d
//
export const testAdd = functions.https.onRequest(testResource.add.bind(testResource));
export const testFindAll = functions.https.onRequest(testResource.findAll.bind(testResource));

export const makerSearch = functions.https.onRequest(makerResource.search.bind(makerResource));
export const makerGetFull = functions.https.onRequest(makerResource.getFullMaker.bind(makerResource));

export const myOrderNewCart = functions.https.onRequest(myOrderResource.newCart.bind(myOrderResource));


