import React from 'react';
import './Login.scss';
import {
  Redirect
} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleIcon from '../../assets/images/google.svg';
import FacebookIcon from '../../assets/images/facebook.svg';
import MailIcon from '../../assets/images/mail.svg';
import authService from '../../services/auth.service';
import {FirebaseStub} from '../../stubs/firebase';

const firebase:any = process.env.REACT_APP_STAGE === 'prod' ? (window as any).firebase : (new FirebaseStub()).init();

class Login extends React.Component<{location:any}, {loading:boolean, isSignedIn:boolean, from:string}> {
  unregisterAuthObserver: any;

  // The component's Local state.
  state = {
    loading: true, // waiting onAuthStateChanged
    isSignedIn: false, // Local signed-in state.
    from: '/makers'
  };

  private sign(provider:any){
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithRedirect(provider);
  }

  signFacebook(){
    this.sign(process.env.REACT_APP_STAGE === 'prod' ? 
      new firebase.auth.FacebookAuthProvider() : new (firebase.auth.FacebookAuthProvider()) );
  }

  signEmail(){
    this.sign(process.env.REACT_APP_STAGE === 'prod' ? new firebase.auth.EmailAuthProvider() : new (firebase.auth.EmailAuthProvider()));
  }

  signGoogle(){
    this.sign(process.env.REACT_APP_STAGE === 'prod' ?  new firebase.auth.GoogleAuthProvider() : new (firebase.auth.GoogleAuthProvider()));    
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user:any) => {
        this.setState({ loading: false, isSignedIn: !!user })
        if(user){
          firebase.auth().currentUser.getIdToken().then((token:string) => authService.setIdToken(token));
          authService.authenticate({email: user.email});
        }else{
          // no authenticated, noop show buttons
        }        
      }
    );
    if(this.props.location){
      this.setState({from: this.props.location.state.fromPathname});
    }
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    if(this.state.loading){
      return <div
      style={{
          position: 'absolute', 
          left: '50%', 
          top: '50%',
          transform: 'translate(-50%, -50%)'
      }}
  ><CircularProgress className="wait-auth" /></div>;
    }else{
      if (this.state.isSignedIn) {
        return <Redirect
          to={{
            pathname: this.state.from,
            state: { from: '/login' }
          }}
        />;
      } else {
        return <div className="login">
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className="paper">
              <Avatar className="avatar">
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Connexion
          </Typography>
              
              <Button
                type="button"
                fullWidth
                size="large"
                variant="contained"
                color="default"
                onClick={() => this.signGoogle()}
                className="provider google"
              >
                <img alt="google" src={GoogleIcon} /> Connexion par Google
            </Button>
  
            <Button
                type="button"
                fullWidth
                color="primary"
                size="large"
                variant="contained"
                onClick={() => this.signFacebook()}
                className="provider fb"
              >
                <img alt="facebook" src={FacebookIcon} /> Connexion par Facebook
            </Button>
            <Button
                type="button"
                fullWidth
                color="primary"
                size="large"
                onClick={() => this.signEmail()}
                variant="contained"
                className="provider email"
              >
                <img alt="mail" src={MailIcon} /> Connexion par email
            </Button>
            </div>
          </Container>
  
        </div>;
      }
    }

    
    
  }
}


export default Login;
