
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import conf from '../../confs';

const Mentions = (props: any) => {
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
        <DialogTitle id="alert-dialog-title">Mentions</DialogTitle>
        <DialogContent>
        <ul>
              <li>
              <a href={conf.cgu} target="_blank">Conditions générales d'utilisation</a>
              </li>
              <li>
              <a href={conf.cgr} target="_blank">Conditions générales de réservation</a>
              </li>
            </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
  );
}

export default Mentions;