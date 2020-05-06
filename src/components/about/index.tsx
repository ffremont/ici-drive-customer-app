
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const About = (props: any) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        setOpen(props.open);
      }, [props.open])

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">A propos</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <strong>ici-drive.fr</strong> est un service GRATUIT et ouvert à tous les producteurs, artisans, fabriquants souhaitant vendre en directe en mode "drive". Il a pour objectif de permettre la réservation de produits locaux afin de les rétirer auprès du producteur.
            Cette application web est conçue et maintenue par Pascaline VIOLLEAU et Florent FREMONT, un couple Niortais voulant participer au commerce local.
            Il existe 2 applications, l'une pour les consommateurs (https://app.ici-drive.fr), une autre pour les producteurs (https://admin.ici-drive.fr). 
            Le service ne gère AUCUNEMENT les paiements, ni les stocks.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default About;