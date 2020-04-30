import {QuerySnapshot, DocumentData} from '@google-cloud/firestore';
import { Response, Request } from 'express';
import * as admin from 'firebase-admin';

export class AppUtil{
    /**
     * Retourne un tableau à partir du snap
     * @param aSnap 
     */
    public static arrOfSnap(aSnap: QuerySnapshot<DocumentData>): DocumentData[]{
        const data: DocumentData[] = [];

        aSnap.forEach(doc => {
            data.push(doc.data());
        });

        return data;
    }

    public static firstOfSnap(aSnap: QuerySnapshot<DocumentData>): DocumentData|null{
        const arr = AppUtil.arrOfSnap(aSnap);
        if(arr.length){
            return arr[0];
        }else{
            return null;
        }
    }



    public static ok(res: Response, data:any){
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        
        if(data instanceof QuerySnapshot){
            res.send(JSON.stringify(AppUtil.arrOfSnap(data)));
        }else{
            res.send(JSON.stringify(data));
        }        
    }

    public static async authorized(request:Request) : Promise<string|null>{
        if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
            return null;
        }

        const idToken = request.headers.authorization.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // @see https://firebase.google.com/docs/reference/admin/node/admin.auth.UserRecord
        const userRecord = await admin.auth().getUser(decodedToken.uid);

        return userRecord.email || null;
    }

    public static notAuthorized(res:Response){
        res.status(403).send('Unauthorized');
    }
    public static badRequest(res:Response){
        res.status(400).send(JSON.stringify({ message: 'Bad request'}));
    }
    public static notFound(res:Response){
        res.status(404).send(JSON.stringify({ message: 'Not found'}));
    }
    public static methodNotAllowed(res:Response){
        res.status(405).send(JSON.stringify({ message: 'Method not allowed'}));
    }
    public static internalError(res:Response, e:any){
        res.status(500).send(JSON.stringify({ message: e || 'une erreur est survenue'}));
    }
}