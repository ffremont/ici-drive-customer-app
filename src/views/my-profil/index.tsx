import React from 'react';
import './MyProfil.scss';
import { Subscription } from 'rxjs';
import myProfilStore, {MyProfilStore} from '../../stores/my-profil';
import { User } from '../../models/user';
import MenuApp from '../../components/menu-app';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import notifStore from '../../stores/notif';
import {NotifType} from '../../models/notif';
import SnackAdd from '../../components/snack-add';
import historyService from '../../services/history.service';


class MyProfil extends React.Component<{ history: any }, { email: string, firstname: string, lastname: string, phone: string, address: string }>{
  state = { firstname: '', lastname: '', phone: '', address: '', email: '' };
  subMyProfil: Subscription | null = null;

  componentWillUnmount() {
    this.subMyProfil?.unsubscribe();
  }

  componentDidMount() {
    historyService.on(window.location.pathname);
    this.subMyProfil = myProfilStore.subscribe((myProfil: User) => {
      if (myProfil && myProfil.email) {
        this.setState({ email: myProfil.email, firstname: myProfil.firstname || '', lastname: myProfil.lastname || '', phone: myProfil.phone || '', address: myProfil.address || '' });
      }
    });
  }

  onSubmit(e:any) {
    e.preventDefault();

    const newUser = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address
    };
    MyProfilStore.update(newUser).then( () => {
      myProfilStore.set(newUser);
      notifStore.set({type: NotifType.MY_PROFIL, message: 'Modification effectuée'});
    }).catch(() => this.props.history.push('/error'));
  }

  render() {
    return (<div className="my-profil">
      <MenuApp mode={'my-profil'} goBackPath="/" history={this.props.history} />
      <SnackAdd />
      
      {this.state.email && (<form onSubmit={(e) => this.onSubmit(e)}>
        <Grid container spacing={2} alignContent="center" direction="column" alignItems="stretch" justify="center">

          <Grid item>
            <TextField variant="outlined" type="email" disabled onChange={(e) => this.setState({ email: e.target.value })} id="mp-email" inputProps={{ maxLength: 128, readOnly: true }} label="Email" fullWidth={true} value={this.state.email} />
          </Grid>

          <Grid item>
            <TextField variant="filled" onChange={(e) => this.setState({ firstname: e.target.value })} id="mp-firstname" inputProps={{ maxLength: 80 }} label="Prénom" fullWidth={true} value={this.state.firstname} />
          </Grid>
          <Grid item>
            <TextField variant="filled" onChange={(e) => this.setState({ lastname: e.target.value })} id="mp-lastname" inputProps={{ maxLength: 80 }} label="Nom" fullWidth={true} value={this.state.lastname} />
          </Grid>

          <Grid item>
            <TextField variant="filled" type="tel" required onChange={(e) => this.setState({ phone: e.target.value })} id="mp-phone" inputProps={{ maxLength: 12 }} label="Téléphone" fullWidth={true} value={this.state.phone} />
          </Grid>

          <Grid item>
            <TextField variant="filled" multiline rowsMax={2} type="text" onChange={(e) => this.setState({ address: e.target.value })} id="mp-address" inputProps={{ maxLength: 256 }} label="Adresse" fullWidth={true} value={this.state.address} />
          </Grid>

          <Grid item className="actions"> 
            <Button type="submit" size="large" color="secondary" variant="contained">Valider</Button>
          </Grid>
        </Grid>
      </form>)}

    </div>)
  }
}

export default MyProfil;
