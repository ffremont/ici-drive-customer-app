function ProviderStub(){}
ProviderStub.prototype.addProfile = (name: string) => {}
ProviderStub.prototype.addScope = (name: string) => {}
ProviderStub.prototype.setCustomParameters = (data: any) => {}


export class FirebaseStub {

    private isSigned = true;

    private authFns:any = [];
    private userMock:any = { email: 'ff.fremont.florent@gmail.com' };
    private idTokenMock = 'azerty';
    private authDelayMock = 2000;

    getIdTokenPromise:any;
    getIdTokenPromiseResolve:any;


    constructor(){
        this.getIdTokenPromise = new Promise((resolve) => {
            this.getIdTokenPromiseResolve = resolve;
        });
    }

    public init(){
        const me:any = this;
        me.auth.FacebookAuthProvider = () => ProviderStub;
        me.auth.EmailAuthProvider = () => ProviderStub;
        me.auth.GoogleAuthProvider = () => ProviderStub;

        return this;
    }

    public messaging(){
        return {
            usePublicVapidKey: () => {},
            onMessage: () => {},
            onTokenRefresh: () => {}
        };
    }

    public auth() {
        return {
                signOut:() => {console.log('signOut')},
                onAuthStateChanged: (fn: any) => {
                this.authFns.push(fn);

                if(this.isSigned){
                    setTimeout( () => {
                        this.authFns.forEach((authFn:any) => authFn(this.userMock))
                        this.getIdTokenPromiseResolve(this.idTokenMock);
                    }, this.authDelayMock);                
                }else{
                    this.authFns.forEach((authFn:any) => authFn(null))
                }

                return () => { this.authFns.splice( this.authFns.findIndex((af:any) => af === fn), 1) };
            },
            signInWithRedirect: (provider:any) => {
                setTimeout(() =>{ // simulate auth process
                    this.authFns.forEach((authFn:any) => authFn(this.userMock));
                    this.getIdTokenPromiseResolve(this.idTokenMock);
                },1000);
            },
            currentUser: {
                getIdToken: () => this.getIdTokenPromise
            }
        };
    }
}

