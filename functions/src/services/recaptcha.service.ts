import axios from 'axios';
import * as functions from 'firebase-functions';

export class RecaptchaService{

    public async verify(response:any){       
       return await axios({
        method:'POST',
        url: 'https://recaptcha.google.com/recaptcha/api/siteverify',
        data : {
            secret:functions.config().recaptcha.secret,
            response
        }
    });
    }

}

export default new RecaptchaService();