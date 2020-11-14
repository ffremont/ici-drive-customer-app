import React from 'react';
import './How.scss';
import MenuApp from '../../components/menu-app';
import Typography from '@material-ui/core/Typography';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import EuroIcon from '@material-ui/icons/Euro';
import ClearIcon from '@material-ui/icons/Clear';
import historyService from '../../services/history.service';

class How extends React.Component<{ history: any, match: any }, {}>{


  componentWillUnmount() {
  }

  componentDidMount() {
    historyService.on(window.location.pathname);
  }

  render() {

    return (<div className="how how-content">
    <MenuApp mode="light" history={this.props.history} />
<div className="how-content">
    <Typography variant="h5">Premiers pas</Typography>

    <Stepper orientation="vertical">

    <Step active={true} key="reservation">
          <StepLabel>Je réserver des produits</StepLabel>
          <StepContent>
          <Typography variant="body1">
            
          En mode Drive ou livraison si le producteur / commerçant / restaurateur / artisan le permet. Les créneaux horaires sont proposés par le vendeur.         
          </Typography>
            
          </StepContent>
        </Step>
        <Step active={true} key="verify">
          <StepLabel>Vérification par le vendeur</StepLabel>
          <StepContent>
            <Typography variant="body1">Pour les commandes prévues :</Typography>
            <ul>
              <li>- 5j : le vendeur a maximum 24h pour vérifier la commande, et elle est automatiquement confirmée</li>
              <li>+ 5j : le vendeur a jusqu'à 3 jours avant la date du Drive / livraison pour vérifier la commande
                <ul>
                  <li>Pour éviter tous oublis, une confirmation vous est demandée.</li>
                </ul>
              </li>
            </ul>
            <Typography variant="body1">Le vendeur s'assure d'avoir le stock suffisant pour honorer la réservation. Le cas échéant une note pourra être transmise.</Typography>
          </StepContent>
        </Step>
        <Step active={true} key="retrat">
          <StepLabel>Retrait / livraison</StepLabel>
          <StepContent>
          <Typography variant="body1">Le retrait / livraison se fera à la date choisie lors de la réservation sur le lieu du Drive du venduer ou chez vous.
Toutes les informations se trouvent sur votre app dans "mes réservations".</Typography>
          </StepContent>
        </Step>
    </Stepper>

    <Card>
      <CardHeader avatar={
        <Avatar aria-label="euro">
          <EuroIcon/>
        </Avatar>
      } title="Paiement"/>
      <CardContent>
        <Typography variant="body1">
        Les paiements sont du ressort du vendeur. Ils se dérouleront soit via PayPal ou sur le lieu du retrait en fonction des préférences du vendeur.
        </Typography>
      </CardContent>
      </Card>

      <Card>
      <CardHeader avatar={
        <Avatar aria-label="clear">
          <ClearIcon/>
        </Avatar>
      } title="Annuler"/>
      <CardContent>
        <Typography variant="body1">
        Le producteur / commerçant / restaurateur / artisan et le consommateur peuvent annuler la réservation depuis leur espace respectif.
        </Typography>
      </CardContent>
      </Card>
      </div>
  </div>);
  }
}


export default How;
