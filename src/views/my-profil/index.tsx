import React from 'react';
import './MyProfil.scss';
import { Subscription } from 'rxjs';
import myProfilStore from '../../stores/my-profil';
import { User } from '../../models/user';
import MenuApp from '../../components/menu-app';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


class MyProfil extends React.Component<{ history: any }, { email: string, firstname:string, lastname:string, phone:string, address:string }>{
  state = { firstname: '', lastname: '', phone: '', address: '', email:'' };
  subMyProfil: Subscription | null = null;

  componentWillUnmount() {
    this.subMyProfil?.unsubscribe();
  }

  componentDidMount() {
    this.subMyProfil = myProfilStore.subscribe((myProfil: User) => {
      if (myProfil.email) {
        this.setState({ email:myProfil.email, firstname: myProfil.firstname||'', lastname: myProfil.lastname||'', phone: myProfil.phone||'', address: myProfil.address||'' });
      }
    });
  }

  onSubmit() {

  }

  render() {
    return (<div className="my-profil">
      <MenuApp mode={'my-profil'} history={this.props.history} />
      {this.state.email && (<form onSubmit={() => this.onSubmit()}>
        <Grid container spacing={2} alignContent="center" direction="column" alignItems="stretch" justify="center">

          <Grid item>
            <TextField onChange={(e) => this.setState({firstname:e.target.value})} id="mp-firstname" label="Prénom" fullWidth={true} value={this.state.firstname} />
          </Grid>

        </Grid>
      </form>)}

    </div>)
  }
}

export default MyProfil;
