import React from 'react';
import './Cart.scss';
import MenuApp from '../../components/menu-app';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { Order, ProductChoice } from '../../models/order';
import { Subscription } from 'rxjs';
import cartStore from '../../stores/cart';
import makerService from '../../services/maker.service';
import notifStore from '../../stores/notif';
import Button from '@material-ui/core/Button';
import conf from '../../confs';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import CartFooter from './cart-footer';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import Paper from '@material-ui/core/Paper';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { Item } from '../../models/item';
import * as moment from 'moment';
import CONF from '../../confs';
import { Alert, AlertTitle } from '@material-ui/lab';
import Checkbox from '@material-ui/core/Checkbox';
import { NotifType } from '../../models/notif';
import { Product } from '../../models/product';
import myProfilStore, { MyProfilStore } from '../../stores/my-profil';
import { User } from '../../models/user';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Chip from '@material-ui/core/Chip';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import historyService from '../../services/history.service';
import RoomIcon from '@material-ui/icons/Room';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormControlLabel, Switch } from '@material-ui/core';

interface CategoryProductChoice {
  products: ProductChoice[],
  category: Item
}

class Cart extends React.Component<{ history: any, location: any, match: any }, { showErrors: boolean, expension: any, waiting: boolean, showPhone: boolean, myProfil: User, phone: string, checkCgr: boolean, summaryMode: boolean, firstSlot: string, order: Order | null, groups: CategoryProductChoice[], wantResetCard: boolean, wantDelivery: boolean, eraseProduct: Product | null }>{

  state = { showErrors: false, expension: [], waiting: false, order: null, wantDelivery: false, myProfil: { address: '', email: '' }, showPhone: false, phone: '', checkCgr: false, wantResetCard: false, firstSlot: '', groups: [], eraseProduct: null, summaryMode: false };
  subOrder: Subscription | null = null;
  subMyProfil: Subscription | null = null;
  categories: Item[] = CONF.categories;

  componentWillUnmount() {
    this.subOrder?.unsubscribe();
    this.subMyProfil?.unsubscribe();
  }

  componentDidMount() {
    historyService.on(window.location.pathname);
    this.setState({ summaryMode: window.location.pathname.indexOf('/summary') > -1 });

    this.subMyProfil = myProfilStore.subscribe((myProfil: User) => {
      if (myProfil && myProfil.email) {
        this.setState({ myProfil, phone: myProfil.phone || '', showPhone: !myProfil.phone });
      }
    });

    this.subOrder = cartStore.subscribe((order: Order) => {
      if (order?.ref) {
        const groups = this.categories.map((cat: Item) => {
          return {
            products: order.choices.filter(pc => pc.product.categoryId === cat.id),
            category: cat
          }
        }).filter(group => group && group.products?.length);

        const slots: Date[] = makerService.getSlots((order.maker as any), 1, order.wantDelivery);
        let newFirstSlot = '';
        if (slots && slots.length) {
          newFirstSlot = moment.default(slots[0]).format('ddd D MMM à HH:mm');
        }
        this.setState({ order, groups, firstSlot: newFirstSlot, wantDelivery: !!order.wantDelivery, expension: groups.map(g => true) });
      } else {
        this.setState({ order: null, groups: [], expension: [] });
      }
    });
  }
  handleChangeQty(event: React.ChangeEvent<{ value: unknown }>, pc: ProductChoice) {
    const newQty = parseInt(event.target.value as string, 10);
    if (newQty === 0) {
      this.setState({ eraseProduct: pc.product });
    } else {
      cartStore.setQuantityOf(pc.product, newQty)
        .catch((err: { badQuantity?: boolean }) => {
          if (err && err.badQuantity) {
            notifStore.set({ type: NotifType.SNACK_CART, message: 'Quantité trop élevé' });
          }
        })
    }
  }

  private handleContinue() {
    if (this.state.summaryMode) {
      const newOrder: Order = { ...(this.state.order as any), wantDelivery:this.state.wantDelivery };
      newOrder.customer = this.state.myProfil;

      this.setState({ waiting: true });
      cartStore.save(newOrder)
        .then(() => {
          cartStore.resetCart();
          // navigue vers la liste des commandes
          this.props.history.push(`/my-orders`);
        }).catch(() => {
          this.props.history.push('/error');
        });

    } else {
      if (this.state.checkCgr) {
        this.props.history.push('/cart/slots');
      } else {
        (window as any).scrollTo(0, document.body.scrollHeight);
        this.setState({ showErrors: true });
      }
    }
  }

  /**
   * FIN DU PROCESSUS PANIER
   */
  continue() {

    if(this.state.summaryMode){
      // si mode résumé, on continue
      this.handleContinue();
    }else{
      const actions = [];
      // si mode PANIER
      if(this.state.wantDelivery) actions.push(new Promise<void>((res, rej) => {
        if (!(document as any).getElementById('address-form').checkValidity()) {
          (window as any).scrollTo(0, document.body.scrollHeight);
          rej();
          return;
        }else{
          // adresse de livraison valide
          // update address /my-profil
          const newUser = { ...this.state.myProfil } as User;
          this.setState({ waiting: true });
          MyProfilStore.update(newUser)
            .then(() => {
              // refresh my-profil
              this.setState({ waiting: false });
              myProfilStore.set(newUser);
              res();
            })
            .catch(() => {
              this.props.history.push('/error');
              rej();
            });
          }
      }));
      if(this.state.showPhone) actions.push(new Promise<void>((res, rej) => {
        if (!(document as any).getElementById('cart-form').checkValidity() || !this.state.checkCgr) {
          (window as any).scrollTo(0, document.body.scrollHeight);
          rej();
          return;
        }
  
        // update phone /my-profil
        const newUser = { ...this.state.myProfil } as User;
        newUser.phone = this.state.phone;
        this.setState({ waiting: true });
        MyProfilStore.update(newUser)
          .then(() => {
            // refresh my-profil
            this.setState({ waiting: false });
            myProfilStore.set(newUser);
            res();
          })
          .catch(() => {
            this.props.history.push('/error');
            rej();
          });
      }));

      Promise.all(actions).then(() => {
        this.setState({ showErrors: false });
        this.handleContinue();
      }).catch(() => {
        this.setState({ showErrors: true });
      })
    }
  }

  render() {
    const order: Order = (this.state.order as any) as Order;
    const payments: any = order && order.maker ? order.maker.payments || { acceptCoins: true, acceptBankCheck: true, acceptCards: true } : {};
    const handleClose = () => this.setState({ wantResetCard: false });
    const handleCloseEraseProduct = () => this.setState({ eraseProduct: null });
    const reset = () => {
      cartStore.resetCart();
      handleClose();
    }
    const eraseProduct = () => {
      const p: any = this.state.eraseProduct;
      cartStore.setQuantityOf(p, 0);
      notifStore.set({ type: NotifType.SNACK_CART, message: 'Produit retiré' })

      handleCloseEraseProduct();
    };

    return (
      <div className="cart">
        <MenuApp mode={this.state.summaryMode ? 'summary' : 'cart'} onResetCart={() => this.setState({ wantResetCard: true })} history={this.props.history} />

        {!this.state.order && (<div className="cart-container empty">
          <RemoveShoppingCartIcon className="icon" />
          <Button variant="outlined" onClick={() => this.props.history.push('/makers')}>Voir le catalogue</Button>
        </div>)}

        {/** EFFACER PRODUIT */}
        <Dialog
          open={this.state.eraseProduct !== null}
          onClose={handleCloseEraseProduct}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Retirer le produit</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Souhaitez-vous retirer ce produit de votre panier ?
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEraseProduct} color="primary">
              Annuler
          </Button>
            <Button onClick={eraseProduct} color="primary" autoFocus>
              Retirer
          </Button>
          </DialogActions>
        </Dialog>

        {/** EFFACER PANIER */}
        <Dialog
          open={this.state.wantResetCard}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Vider le panier</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Souhaitez-vous effacer l'ensemble des produits qui composent votre panier ?
          </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Annuler
          </Button>
            <Button onClick={reset} color="primary" autoFocus>
              Vider
          </Button>
          </DialogActions>
        </Dialog>

        {this.state.order && (<Grid spacing={2} className="cart-container" container direction="column" alignContent="center" alignItems="center" justify="center">
          <Grid item>
            <Card className="card-info">
              <CardHeader
                avatar={
                  <Avatar>
                    <PermIdentityIcon />
                  </Avatar>
                }
                title={order.maker?.name}
              />
            </Card>
          </Grid>
          <Grid item>
            <Card className="card-info" onClick={() => this.props.history.push(`/makers/${order.maker?.id}/place`)}>
              <CardHeader
                avatar={
                  <Avatar>
                    <RoomIcon />
                  </Avatar>
                }
                title={order.maker?.place.address}
                subheader={order.maker?.place.label}
              />
            </Card>
          </Grid>
          {order.maker && !this.state.summaryMode && (<Grid item>
            <Card className="card-info">
              <CardHeader
                avatar={
                  <Avatar>
                    <DriveEtaIcon />
                  </Avatar>
                }
                title={`Drive chez le vendeur`}
                subheader={`Aucun frais de retrait`}
              />
            </Card>
          </Grid>)}
          {order.maker && !this.state.summaryMode && order.maker.delivery && (<Grid item>
            <Card className="card-info">
              <CardHeader
                avatar={
                  <Avatar>
                    <LocalShippingIcon />
                  </Avatar>
                }
                title={`Livraison possible pour ${order.maker.deliveryCost?.toFixed(2)}€`}
                subheader={`Rayon : ${order.maker.deliveryRadius}km`}
              />
            </Card>
          </Grid>)}
          
          {order.maker && order.wantDelivery && this.state.summaryMode && (<Grid item>
            <Card className="card-info">
              <CardHeader
                avatar={
                  <Avatar>
                    <LocalShippingIcon />
                  </Avatar>
                }
                title={`Livraison le ${moment.default(order.slot).format('ddd D MMM à HH:mm')}`}
                subheader={`Créneau`}
              />
            </Card>
          </Grid>)}

          {this.state.firstSlot && order && !order.wantDelivery && this.state.summaryMode && (<Grid item>
            <Card className="card-info" onClick={() => {
              window.scrollTo(0, document.body.scrollHeight);
            }}>
              <CardHeader
                avatar={
                  <Avatar>
                    <AccessTimeIcon />
                  </Avatar>
                }
                title={moment.default(order.slot).format('ddd D MMM à HH:mm')}
                subheader="Horaire du retrait au Drive"
              />
            </Card>
          </Grid>)}

        </Grid>)}

        {this.state.order && (<div className="info-area">
          <Alert severity="info">
            Prix TTC. En cas de rupture de stock d'un produit, vous en serez informé.</Alert>
        </div>)}



        {/* les categories avec les produits */}
        <div className="groups"> {this.state.groups.map((group: CategoryProductChoice, i) => (
          <ExpansionPanel key={`cat_${i}`} expanded={true}>
            <ExpansionPanelSummary

              aria-controls="panel1a-content"
              id={`panel${i}-header`}

            >
              <Typography className="cat-title">{group.category.label}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className="group-detail">
              <Grid container spacing={2} alignContent="center" direction="column" alignItems="stretch" justify="center">
                {group.products.map((pc: ProductChoice, j) => (
                  <Grid item key={`product${j}`} className="item-product" >
                    <Paper>
                      <div className="my-product">
                        <div className="product-preview">
                          <img src={pc.product.image} alt={pc.product.label} />
                        </div>
                        <div className="product-info">
                          <div className="product-title">{pc.product.label}</div>
                          <div className="product-main">
                            <div className="product-qty">
                              <FormControl className="formcontrol-qty">
                                <InputLabel id="demo-simple-select-label">Quantité</InputLabel>
                                <Select
                                  labelId={`qty_${pc.product.ref}`}
                                  id={`id_${pc.product.ref}`}
                                  value={pc.quantity}
                                  onChange={(evt) => this.handleChangeQty(evt, pc)}
                                >
                                  {Array.from(Array(15).keys()).map((v, k) => (
                                    <MenuItem key={`mi_${j}_${k}`} value={v}>{v}</MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </div>
                            <div className="product-price">{(pc.product.price * pc.quantity).toFixed(2)}€</div>
                          </div>
                        </div>
                      </div>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
        </div>

        {order && order?.maker?.delivery && (<div className="switch-delivery">
          <FormControlLabel
            control={
              <Switch
                checked={this.state.wantDelivery}
                disabled={this.state.summaryMode}
                onChange={(e: any) => { 
                  this.setState({ wantDelivery: e.target.checked });
                  cartStore.setDelivery(e.target.checked);
                }}
                name="delivery"
                color="secondary"
              />
            }
            label="Opter pour la livraison à domicile"
          />
        </div>)}
        {this.state.order && !this.state.wantDelivery && (<div className="info-area">
          <Alert icon={false} className="option-choisie">
            Option choisie : retrait au Drive chez le vendeur</Alert>
        </div>)}
        {this.state.order && this.state.wantDelivery && (<div className="info-area">
          <Alert icon={false} className="option-choisie">
            Option choisie : livraison chez vous</Alert>
        </div>)}

        {this.state.order && this.state.wantDelivery && (<div className="info-area">
          <Alert severity="info">
            Veuillez vérifier que vous respectez la distance de {order.maker?.deliveryRadius}km entre votre adresse et le vendeur{order.maker?.place.address ? ` (${order.maker?.place.address})` : ''}. Si vous êtes hors zone, votre commande sera invalidée par le vendeur.</Alert>
        </div>)}

        {this.state.order && this.state.wantDelivery && (<div className="cart-address"><form id="address-form">
          <TextField 
            className="delivery-address" 
            variant="filled" multiline
            rowsMax={2} type="text" 
            required
            onChange={(e) => this.setState({
              myProfil: {...this.state.myProfil, address: e.target.value}
            })} id="cat-address" 
            inputProps={{ maxLength: 512 }} 
            disabled={this.state.summaryMode}
            label="Adresse complète de livraison" 
            error={!this.state.myProfil.address && this.state.showErrors} 
            value={this.state.myProfil.address} />
        </form></div>)}


        {this.state.order && (<div className="comment-area">
          <TextField
            id="comment-multiline-flexible"
            label="Commentaire"
            multiline
            rowsMax={3}
            inputProps={{ maxLength: 512 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ModeCommentOutlinedIcon color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder={order.maker?.placeholderOrderComment || conf.defaultPlaceholderOrderComment}
            fullWidth
            value={order.comment}
            onChange={(e) => {
              this.setState({ order: { ...order, comment: e.target.value } });
              cartStore.setComment(e.target.value);
            }}
          />
        </div>)}

        {this.state.order && (<Alert severity="warning" className="instruction-payments">
          <AlertTitle>Pas de paiement sur ici-drive</AlertTitle>
          <strong>Paiement directement et intégralement au vendeur</strong>
        </Alert>)}

        <div className="payments">
          {payments.acceptCoins && (<Chip className="payment" label="espèce" />)}
          {payments.acceptCards && (<Chip className="payment" label="carte bancaire" />)}
          {payments.acceptBankCheck && (<Chip className="payment" label="chèque" />)}
          {payments.acceptPaypal && (<Chip className="payment" label="paypal" />)}
        </div>

        {this.state.order && !this.state.summaryMode && this.state.showPhone && (<div className="cart-phone"><form id="cart-form">
          <TextField error={!this.state.phone && this.state.showErrors} type="tel" required onChange={(e) => this.setState({ phone: e.target.value })} id="cart-phone" inputProps={{ maxLength: 12 }} label="Téléphone" fullWidth={true} value={this.state.phone} />
        </form></div>)}


        {this.state.order && !this.state.summaryMode && (<div className={`reglementation`}>
          <Checkbox
            checked={this.state.checkCgr}
            onChange={(e) => this.setState({ checkCgr: e.target.checked })}
            className={`${!this.state.checkCgr && this.state.showErrors ? 'apperror' : ''}`}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          /> <Typography variant="body1" className="accept-cgr">Accepter les <a href={CONF.cgr} rel="noreferrer noopener" target="_blank">Conditions Générales de Réservation</a>*</Typography>
        </div>)}
        {this.state.order && !this.state.summaryMode && !this.state.checkCgr && this.state.showErrors && (<div className="reg-ko">
          Veuillez lire et cocher les CGR
        </div>)}


        {this.state.order && (
          <CartFooter
            text={this.state.summaryMode ? 'Envoyer la réservation' : 'Chosir le créneau'}
            onClickContinue={() => this.continue()}
            quantity={order.choices.map(pc => pc.quantity).reduce((acc, cv) => acc + cv, 0)} total={order.total}
            deliveryAvailableFrom={order?.maker?.deliveryAvailableFrom}
            deliveryCost={order?.maker?.deliveryCost}
            wantDelivery={this.state.wantDelivery}
          />
        )}

        {this.state.waiting && (<Backdrop className="backdrop" open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>)}
      </div>
    );
  }
}

export default Cart;
