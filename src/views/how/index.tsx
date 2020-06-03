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

class How extends React.Component<{ history: any, match: any }, {}>{


  componentWillUnmount() {
  }

  componentDidMount() {

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
          Chaque producteur adapte la date du retrait en fonction de son  activité (min 5jrs après). Lorsque votre réservation est terminée sur <Link href="app.ici-drive.fr">app.ici-drive.fr</Link>. 
          <strong> Le producteur peut la vérifier jusqu'à 72h avant la date du retrait.</strong>
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
          <StepLabel>Confirmation par le consommateur</StepLabel>
          <StepContent>
          <Typography variant="body1">Un lapse de temps peut s'écouler entre la réservation et la vérification. Pour éviter tout oubli. Une confirmation est nécessaire jusqu'à 48h avant la date du retrait.

<br/>
En cas de réservation compatible par PayPal, le producteur enverra la demande de paiement.</Typography>
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
