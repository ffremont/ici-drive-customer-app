import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function Confirm(props:any) {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');

  React.useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
    props.onClose();
  };

  const handleConfirm = () => {
    setOpen(false);
    props.onConfirm(text);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.message}
          </DialogContentText>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            margin="dense"
            id="remarque"
            label="Remarque"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirm} color="primary">
            {props.okText || "Valider"}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
