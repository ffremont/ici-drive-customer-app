class ProviderStub{
    public addProfile(name: string){

    }
}

export class FirebaseStub {

    private isSigned = false;

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
        me.auth.FacebookAuthProvider = () => new ProviderStub();
        me.auth.EmailAuthProvider = () => new ProviderStub();
        me.auth.GoogleAuthProvider = () => new ProviderStub();

        return this;
    }

    public auth() {
        return {
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

