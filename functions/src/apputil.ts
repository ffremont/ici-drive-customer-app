import {QuerySnapshot, DocumentData} from '@google-cloud/firestore';
import { Response, Request } from 'express';
//import * as admin from 'firebase-admin';


let LEVEL = 'info';
if(process.env.REACT_APP_STAGE !== 'prod'){
    LEVEL = 'debug';
}

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

    public static info(data:any){
        console.log(data);
    }

    public static debug(...data:any){
        if(LEVEL === 'debug')
            console.log('DEBUG', data);
    }

    public static error(...data:any){
        console.error(data);
    }

    public static firstOfSnap(aSnap: QuerySnapshot<DocumentData>): DocumentData|null{
        const arr = AppUtil.arrOfSnap(aSnap);
        if(arr.length){
            return arr[0];
        }else{
            return null;
        }
    }

    public static expires(res:Response, delay:number){
        res.setHeader('Cache-Control', `public,max-age=${delay}`);
    }

    public static noCache(res:Response){
        res.setHeader('Cache-Control', `no-cache,no-store`);
    }

    public static ok(res: Response, data:any = null){
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        
        if(data instanceof QuerySnapshot){
            res.send(JSON.stringify(AppUtil.arrOfSnap(data)));
        }else if(data !== null){
            res.send(JSON.stringify(data));
        }else{
            res.send('{}');
        }
    }

    public static async authorized(request:Request) : Promise<string|null>{
        return 'ff.fremont.florent+auth@gmail.com';

        // TEST
       /* if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
            return null;
        }

        const idToken = request.headers.authorization.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // @see https://firebase.google.com/docs/reference/admin/node/admin.auth.UserRecord
        const userRecord = await admin.auth().getUser(decodedToken.uid);

        return userRecord.email || null;*/
    }

    public static notAuthorized(res:Response){
        res.status(403).send('Unauthorized');
    }
    public static badRequest(res:Response, message : string = 'Bad request'){
        res.status(400).send(JSON.stringify({ message}));
    }
    public static notFound(res:Response){
        res.status(404).send(JSON.stringify({ message: 'Not found'}));
    }
    public static methodNotAllowed(res:Response){
        res.status(405).send(JSON.stringify({ message: 'Method not allowed'}));
    }
    public static internalError(res:Response, e:any){
        AppUtil.error(e);
        res.status(500).send(JSON.stringify({ message: e || 'une erreur est survenue'}));
    }
}