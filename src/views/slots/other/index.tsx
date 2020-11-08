
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Alert } from '@material-ui/lab';
import * as moment from 'moment';
import './Other.scss';
import { Grid, TextField } from '@material-ui/core';

const Other = (props: any) => {
  const [open, setOpen] = React.useState(false);
  const [firstSlot, setFirstSlot] = React.useState();
  const [note, setNote] = React.useState('');
  const [slot, setSlot] = React.useState();

  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  React.useEffect(() => {
    setFirstSlot(props.firstSlot);
  }, [props.firstSlot]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const handleValidate = () => {
    if(slot && note){
      setOpen(false);
      props.onValidate(note, slot);
    }else{
      alert(`Merci en renseigner une date valide ainsi qu'une note avec d'autres dates`);
    }
    
  }

  const onSubmit = (e: any) => {
    e.preventDefault();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Autre créneau</DialogTitle>
      <DialogContent>
        <Alert severity="info">
          Merci d'indiquer en détail vos disponibilités de livraison (heures et jours). Le producteur examinera votre demande.
          <br/>
          <strong>Date possible à partir du {moment.default(firstSlot).format('ddd D MMM à HH:mm')} </strong>
        </Alert>
        <form onSubmit={(e) => onSubmit(e)}><Grid className="other-form" container spacing={2} alignContent="center" direction="column" alignItems="stretch" justify="center">
          <Grid item className="mp-field">
            <TextField
              label="Le moment qui vous conviendrait"
              type="datetime-local"
              required
              onChange={(e: any) => {
                const v = new Date(e.target.value);
                if(firstSlot && (v.getTime() > firstSlot.getTime())){
                  setSlot(v)
                }
              }}
              fullWidth={true}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item className="mp-field">
            <TextField variant="outlined" required type="text" multiline rows={2} onChange={(e: any) => setNote(e.target.value)} id="o-note" inputProps={{ maxLength: 512 }} label="Autres créneaux" fullWidth={true} value={note} />
          </Grid>
        </Grid></form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Fermer
          </Button>
        <Button onClick={handleValidate} color="secondary" autoFocus>
          Valider
          </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Other;