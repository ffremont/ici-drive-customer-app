import React from 'react';
import './How.scss';
import MenuApp from '../../components/menu-app';
import Typography from '@material-ui/core/Typography';

class How extends React.Component<{ history: any, match: any }, { }>{


  componentWillUnmount() {
  }

  componentDidMount() {
    
  }

  render() {

    return (<div className="how">
      <MenuApp mode="light" history={this.props.history} />

      <Typography variant="h5">Comment ça marche ?</Typography>
      <p>Sur l'application, vous avez accès aux producteurs autour de chez vous. Ils mettent à votre disposition leur catalogue de produits à retirer auprès de leur point de retrait. </p>
      
      <br/>
      <Typography variant="h6">Etapes</Typography>
      <p>
        <ul>
          <li>Je réserve les produits sur app.ici-drive.fr</li>
          <li>Le producteur vérifie la disponiblité des produits</li>
          <li>En fonction des consignes de paiement, je paie via Paypal ou directement au moment du retrait.</li>
        </ul>
        
      ICI DRIVE est un service GRATUIT et OUVERT, la gestion des paiements est à l'entière charge des producteurs. 

      </p>
    </div>);
  }
}


export default How;
