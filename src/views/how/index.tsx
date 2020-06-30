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

    return (<div className="how">
    <MenuApp mode="light" history={this.props.history} />
<div className="how-content">
    <Typography variant="h5">Premiers pas</Typography>

    <Stepper orientation="vertical">

      <Step active={true} key="reservation">
        <StepLabel>Réservation</StepLabel>
        <StepContent>
        <Typography variant="body1">
        Chaque producteur adapte la date du retrait (au plus tôt) en fonction de son  activité. Lorsque votre réservation est terminée sur <Link href="app.ici-drive.fr">app.ici-drive.fr</Link>. 
        <strong> Le producteur doit la vérifier</strong>, au plus tard, 3h avant le retrait si le retrait est prévu dans les moins de 5 jours, sinon 48h avant le retrait.
        </Typography>
          
        </StepContent>
      </Step>
      <Step active={true} key="verification">
        <StepLabel>Vérification par le producteur</StepLabel>
        <StepContent>
        <Typography variant="body1">Le producteur s'assure d'avoir le stock suffisant pour honorer la réservation. Le cas échéant une note sera transmise.</Typography>
        </StepContent>
      </Step>
      <Step active={true} key="confirmation">
        <StepLabel>Confirmation</StepLabel>
        <StepContent>
        <Typography variant="body1">Si le retrait se fait dans - de 5j, la confirmation est automatique.</Typography>
        <Typography variant="body1">Si le retrait se fait dans + de 5j, la confirmation par le consommateur sera nécessaire et cela pour éviter tout oubli. Elle peut se faire jusqu'à 48h avant la date du retrait.
</Typography>
<Typography variant="body1">En cas de réservation compatible par PayPal, le producteur enverra la demande de paiement.</Typography>
        </StepContent>
      </Step>
      <Step active={true} key="retrat">
        <StepLabel>Retrait</StepLabel>
        <StepContent>
        <Typography variant="body1">Le retrait se fera à la date choisie lors de la réservation sur le lieu du Drive du producteur.
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
        Les paiements sont du ressort du producteur. Ils se dérouleront soit via PayPal ou sur le lieu du retrait en fonction des préférences du producteur.
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
        Le producteur et le consommateur peuvent annuler la réservation depuis leur espace respectif.
        </Typography>
      </CardContent>
      </Card>
      </div>
  </div>);
  }
}


export default How;
