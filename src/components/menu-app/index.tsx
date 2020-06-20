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
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import BugReportIcon from '@material-ui/icons/BugReport';
import InfoIcon from '@material-ui/icons/Info';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import IciDriveTypoIcon from '../../assets/images/ici-drive-icon.png';
import IciDriveBannerIcon from '../../assets/images/ici-drive-banner.png';
import Button from '@material-ui/core/Button';

import './MenuApp.scss';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import HelpIcon from '@material-ui/icons/Help';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import BuildIcon from '@material-ui/icons/Build';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import cartStore from '../../stores/cart';
import { Order } from '../../models/order';
import conf from '../../confs';
import authService from '../../services/auth.service';
import About from '../about';
import myProfilStore from '../../stores/my-profil';
import { User } from '../../models/user';
import ClearIcon from '@material-ui/icons/Clear';
import { grey } from '@material-ui/core/colors';
import GetAppIcon from '@material-ui/icons/GetApp';
import pwaService from '../../services/pwa.service';
import LockIcon from '@material-ui/icons/Lock';
import ShareIcon from '@material-ui/icons/Share';
import historyService from '../../services/history.service';


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
      paddingRight: 50,
    },
    titleNoPadding:{
      paddingRight:0
    },
    catalogTitleCanShare:{
      paddingLeft:50
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    installBar: {
      color: theme.palette.common.white,
      backgroundColor: grey[500],
      marginBottom: 10,
      padding: '10px 10px'
    },
    getApp: {
      color: theme.palette.common.white,
      borderColor: theme.palette.common.white
    }
  }),
);

const MenuApp = (props: any) => {
  const classes = useStyles();
  const [mode, setMode] = useState('full');
  const [auth] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [email, setEmail] = useState('');
  const [share, setShare] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [open, setOpen] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [showCgu, setShowCgu] = useState(false);

  React.useEffect(() => {
    setMode(props.mode);
  }, [props.mode]);
  React.useEffect(() => {
    setShare(props.share);
  }, [props.share]);

  React.useEffect(() => {
    setShowCgu(!window.localStorage.acceptCgu);
  },[]);

  useEffect(() => {
    const subscription = cartStore.subscribe((order: Order) => {
      setQuantity(order.choices.map(pc => pc.quantity).reduce((acc, cv) => acc + cv, 0));
    });
    const subHistory = historyService.stack.subscribe((r) => {
      setCanGoBack(historyService.canGoBack());
    });
    const subMyProfil = myProfilStore.subscribe((user: User) => {
      if (user && user.email)
        setEmail(user.email.substr(0, user.email.indexOf('@')));
    })
    const subInstalled = pwaService.installed.subscribe((installed) => {
      if (installed)
        setShowInstall(false)
    });
    const subCancelled = pwaService.cancelled.subscribe((cancelled) => {
      if (cancelled)
        setShowInstall(false)
    });
    const subBeforeinstallprompt = pwaService.beforeinstallprompt.subscribe((beforeinstallprompt) => {
      if (beforeinstallprompt)
        setShowInstall(true)
    });
    return () => {
      // Nettoyage de l'abonnement
      subHistory.unsubscribe();
      subscription.unsubscribe();
      subMyProfil.unsubscribe();
      subInstalled.unsubscribe();
      subCancelled.unsubscribe();
      subBeforeinstallprompt.unsubscribe();
    };
  });

  const logout = () => {
    if (window.confirm('Voulez-vous déconnecter votre appareil de votre compte ?')) {
      authService.signout();
      window.location.reload();
    }
  }

  const closeBannerCgu = () => {
    window.localStorage.acceptCgu="1";
    setShowCgu(false);
  };


  const shareMaker = () => {
    (window as any).navigator.share({
      title: `Drive de produits locaux`,
      text: `Découvrez ce producteur ${share}`,
    }); // partage l'URL de MDN
    
  };

  return (
    <div className={classes.root}>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List className="drawer-list">
          {!email && (<ListItem selected button key="login" onClick={() => props.history.push('/login')}>
            <ListItemIcon><LockIcon /></ListItemIcon>
            <ListItemText primary="Se connecter" />
          </ListItem>)}
          {email && (<ListItem selected button key="connected">
            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Connecté" secondary={email} />
          </ListItem>)}
          {email && (<ListItem button key="orders" onClick={() => props.history.push('/my-orders')}>
            <ListItemIcon><ReceiptIcon /></ListItemIcon>
            <ListItemText primary="Mes réservations" secondary="En cours et passées" />
          </ListItem>)}
          {email && (<ListItem button key="account" onClick={() => props.history.push('/my-profil')}>
            <ListItemIcon><BuildIcon /></ListItemIcon>
            <ListItemText primary="Mon compte" secondary="Informations personnelles" />
          </ListItem>)}
          <ListItem button key="how-to" onClick={() => props.history.push('/how')}>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="Premiers pas" secondary="" />
          </ListItem>
          <ListItem button key="concept" onClick={() => props.history.push('/concept')} >
            <ListItemIcon><EmojiObjectsIcon /></ListItemIcon>
            <ListItemText primary="Concept &amp; histoire" secondary="" />
          </ListItem>
          <ListItem button key="support" onClick={() => window.open(conf.support)}>
            <ListItemIcon><BugReportIcon /></ListItemIcon>
            <ListItemText primary="Support" secondary="Déclarer un incident" />
          </ListItem>
          <ListItem button key="mentions" onClick={() => props.history.push('/mentions')}>
            <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
            <ListItemText primary="Mentions" secondary="CGU, CGR, ..." />
          </ListItem>

          <ListItem button key="about" onClick={() => setOpenAbout(true)}>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="A propos" secondary="De l'application" />
          </ListItem>
          {email && (<ListItem button key="logout" onClick={logout}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Se déconnecter" secondary="Dissocier cet appareil" />
          </ListItem>)}
        </List>
      </Drawer>
      <AppBar position="fixed" className={`${classes.appBar} ${canGoBack ? 'canGoBack': 'cantGoBack'}`}>
        <Toolbar>
          {(['full', 'makers'].indexOf(mode) > -1) && (
            <IconButton edge="start" className={`${classes.firstButton}`} onClick={() => setOpen(true)} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
          {canGoBack && (['full', 'makers'].indexOf(mode) === -1) && (
            <IconButton edge="start" className={classes.firstButton} onClick={() => props.history.goBack()} color="inherit" aria-label="précédent">
              <ArrowBackIosIcon />
            </IconButton>
          )}


          {['full', 'makers'].indexOf(mode) > -1 && (
            <Typography variant="h6" className={`${classes.title} ${canGoBack ? '': classes.titleNoPadding}`}>
              <img alt="icon ici drive" className="ici-drive-icon" src={IciDriveBannerIcon} />
            </Typography>
          )}
          {['light', 'catalog'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={`${classes.title} ${canGoBack ? '': classes.titleNoPadding} ${(window as any).navigator.share && mode === 'catalog' ? classes.catalogTitleCanShare: ''}`}>
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
          {['summary'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Récapitulatif
            </Typography>
          )}
          {['my-orders'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Mes réservations
            </Typography>
          )}
          {['my-profil'].indexOf(mode) > -1 && (
            <Typography variant="h6" align="center" className={classes.title}>
              Mon compte
            </Typography>
          )}

          {(['catalog'].indexOf(mode) > -1 )&&  (window as any).navigator.share && (<IconButton aria-label="partager" onClick={shareMaker} color="inherit">
            <ShareIcon />
          </IconButton>)}

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

          <About open={openAbout} onClose={() => setOpenAbout(false)} />

          {auth && (
            <div>
              <IconButton
                aria-label="Mes réservations"
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
      <div className="ghost-appbar"></div>

      {showInstall && (<div className={`install-bar ${classes.installBar}`}>
        <div className="install-close" onClick={() => pwaService.close()}>
          <ClearIcon />
        </div>
        <div className="install-content">
          <div className="install-icon">
            <img src={IciDriveTypoIcon} alt="logo" />
          </div>
          <div className="install-title">
            Drive de produits locaux
          </div>
        </div>
        <div className="install-actions">

          <Button onClick={() => pwaService.install()} variant="outlined" startIcon={<GetAppIcon />} className={classes.getApp}>Installer</Button>
        </div>
      </div>)}

      {showCgu && (<div className="banner-cgu">
        <div className="text">En cliquant sur OK ou en poursuivant la navigation, vous acceptez les CGU / politique de confidentialité.&nbsp;
            <a href={conf.cgu} rel="noreferrer noopener" target="_blank">En savoir plus</a>
        </div>
        <div className="action">
        <Button variant="contained" onClick={() => closeBannerCgu()} >
          OK
</Button>
        </div>
      </div>)}


    </div>
  );
}

export default MenuApp;