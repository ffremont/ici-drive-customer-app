
import React, { useEffect } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import cartStore from '../../stores/cart';
import { Order } from '../../models/order';

const SnackAdd = (props: any) => {
    const [open, setOpen] = React.useState(false);
    const [qty, setQty] = React.useState(0);

    useEffect(() => {
        const subscription = cartStore.subscribe((order: Order) => {
            const newQty = order.choices.map(pc => pc.quantity).reduce((acc, cv) => acc + cv, 0);
            if (newQty !== qty) {
                setOpen(true);
            } 

            setQty(newQty);
        });
        return () => {
            // Nettoyage de l'abonnement
            subscription.unsubscribe();
        };
    });


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
            message="Action réalisée"
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