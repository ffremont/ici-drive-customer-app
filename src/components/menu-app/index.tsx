import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PersonIcon from '@material-ui/icons/Person';
import BugReportIcon from '@material-ui/icons/BugReport';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import IciDriveTypoIcon from '../../assets/images/ici-drive-icon.png';
import IciDriveBannerIcon from '../../assets/images/ici-drive-banner.png';
import './MenuApp.scss';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import cartStore from '../../stores/cart';
import { Order } from '../../models/order';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    firstButton: {
      marginRight: theme.spacing(2),
    },
    appBar: {
      color: theme.palette.grey[900],
      background: theme.palette.common.white
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  }),
);

const MenuApp = (props: any) => {
  const classes = useStyles();
  const [mode, setMode] = useState('full');
  const [auth] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    setMode(props.mode);
  }, [props.mode])

  useEffect(() => {
    const subscription = cartStore.subscribe((order: Order) => {
      setQuantity(order.choices.map(pc => pc.quantity).reduce((acc, cv) => acc + cv, 0));
    });
    return () => {
      // Nettoyage de l'abonnement
      subscription.unsubscribe();
    };
  });

  return (
    <div className={classes.root}>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List className="drawer-list">
          <ListItem button key="orders">
            <ListItemIcon><ReceiptIcon /></ListItemIcon>
            <ListItemText primary="Mes commandes" secondary="En cours et passées" />
          </ListItem>
          <ListItem button key="account">
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="Mon compte" secondary="Informations personnelles" />
          </ListItem>
          <ListItem button key="support">
            <ListItemIcon><BugReportIcon /></ListItemIcon>
            <ListItemText primary="Support" secondary="Déclarer un incident" />
          </ListItem>
          <ListItem button key="about">
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="A propos" secondary="De l'application" />
          </ListItem>
          <ListItem button key="logout">
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Se déconnecter" secondary="Dissocier cet appareil" />
          </ListItem>
        </List>
      </Drawer>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {mode === 'full' && (
            <IconButton edge="start" className={classes.firstButton} onClick={() => setOpen(true)} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
          {mode !== 'full' && (
            <IconButton edge="start" className={classes.firstButton} onClick={() => props.history.goBack()} color="inherit" aria-label="précédent">
              <ArrowBackIosIcon />
            </IconButton>
          )}


          {mode === 'full' && (
            <Typography variant="h6" className={classes.title}>
              <img alt="icon ici drive" className="ici-drive-icon" src={IciDriveBannerIcon} />
            </Typography>
          )}
          {['light', 'catalog'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              <img alt="icon ici drive" className="ici-drive-icon" src={IciDriveTypoIcon} />

            </Typography>
          )}
          {['cart'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Mon panier
            </Typography>
          )}
          {['slots'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Heure du retrait
            </Typography>
          )}

          {['full', 'catalog'].indexOf(mode) > -1 && (
            <IconButton aria-label="nb. de produits" onClick={() => props.history.push('/cart')} color="inherit">
              <Badge badgeContent={quantity} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
          
          {['cart'].indexOf(mode) > -1 && (
            <IconButton aria-label="vider le panier" onClick={props?.onResetCart} color="inherit">
              <RemoveShoppingCartIcon />
            </IconButton>
          )}


          {auth && (
            <div>
              <IconButton
                aria-label="Mes commandes"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>


            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default MenuApp;