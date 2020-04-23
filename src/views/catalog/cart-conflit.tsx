import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const CartConflit = (props: any) => {

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Conflit de panier</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Votre panier contient des produits d'un autre producteur, que souhaitez-vous faire ?
          </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Annuler
          </Button>
        <Button onClick={props.onCleanAndAdd} color="primary" autoFocus>
          Vider et ajouter
          </Button>
      </DialogActions>
    </Dialog>
  );

}

export default CartConflit;