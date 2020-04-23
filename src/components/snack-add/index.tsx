
import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const SnackAdd = (props: any) => {
    const [open, setOpen] = React.useState(false);
    const [text, setText] = React.useState(-1);

    React.useEffect(() => {
        setOpen(props.show);
        setText(props.text);
      }, [props.show, props.text])

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={800}
            onClose={handleClose}
            message={text ? text : "Action réalisée"}
            action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </React.Fragment>
            }
        />
    );
}

export default SnackAdd;