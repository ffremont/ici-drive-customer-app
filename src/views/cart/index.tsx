import React from 'react';
import './Cart.scss';
import MenuApp from '../../components/menu-app';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import RoomIcon from '@material-ui/icons/Room';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import { Order, ProductChoice } from '../../models/order';
import { Subscription } from 'rxjs';
import cartStore from '../../stores/cart';
import notifStore from '../../stores/notif';
import Button from '@material-ui/core/Button';
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
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { Item } from '../../models/item';
import CONF from '../../confs';
import { NotifType } from '../../models/notif';
import { Product } from '../../models/product';

interface CategoryProductChoice {
  products: ProductChoice[],
  category: Item
}

class Cart extends React.Component<{ history: any, match: any }, { order: Order | null, groups: CategoryProductChoice[], wantResetCard: boolean, eraseProduct:Product|null }>{

  state = { order: null, wantResetCard: false, groups: [], eraseProduct:null };
  subOrder: Subscription | null = null;
  categories: Item[] = CONF.categories;

  componentWillUnmount() {
    this.subOrder?.unsubscribe();
  }

  componentDidMount() {
    this.subOrder = cartStore.subscribe((order: Order) => {
      if (order?.ref) {
        const groups = this.categories.map((cat: Item) => {
          return {
            products: order.choices.filter(pc => pc.product.categoryId === cat.id),
            category: cat
          }
        }).filter(group => group && group.products?.length);

        this.setState({ order, groups });
      } else {
        this.setState({ order: null, groups:[] });
      }
    });
  }
  handleChangeQty(event: React.ChangeEvent<{ value: unknown }>, pc:ProductChoice) {
    const newQty = parseInt(event.target.value as string,10);
    if(newQty === 0){
      this.setState({eraseProduct:pc.product});
    }else{
      cartStore.setQuantityOf(pc.product, newQty)      
      .catch((err:{badQuantity?:boolean}) => {
        if(err && err.badQuantity){
          notifStore.set({type: NotifType.SNACK_CART, message: 'Quantité trop élevé'});
        }
      })
    }
  }

  goToSlots(){
    this.props.history.push('/cart/slots');
  }

  render() {
    const order: Order = (this.state.order as any) as Order;
    const handleClose = () => this.setState({ wantResetCard: false });
    const handleCloseEraseProduct = () => this.setState({ eraseProduct: null });
    const reset = () => {
      cartStore.resetCart();
      handleClose();
    }
    const eraseProduct = () => {
      const p : any = this.state.eraseProduct;
      cartStore.setQuantityOf(p, 0);
      notifStore.set({type: NotifType.SNACK_CART, message: 'Produit retiré'})
      
      handleCloseEraseProduct();
    };

    return (
      <div className="cart">
        <MenuApp mode="cart" onResetCart={() => this.setState({ wantResetCard: true })} history={this.props.history} />

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
            <Card className="card-info">
              <CardHeader
                avatar={
                  <Avatar>
                    <RoomIcon />
                  </Avatar>
                }
                title={order.maker?.place.label}
                subheader="Retrait / livraison"
              />
            </Card>
          </Grid>
          <Grid item>
            <Card className="card-info">
              <CardHeader
                avatar={
                  <Avatar>
                    <AccessTimeIcon />
                  </Avatar>
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
              />
            </Card>
          </Grid>
        </Grid>)}

        {/* les categories avec les produits */}
        <div className="groups"> {this.state.groups.map((group: CategoryProductChoice, i) => (
          <ExpansionPanel key={`cat_${i}`}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id={`panel${i}-header`}
            >
              <Typography>{group.category.label}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className="group-detail">
              <Grid container spacing={2} alignContent="center" direction="column" alignItems="stretch" justify="center">
                {group.products.map((pc: ProductChoice, j) => (
                  <Grid item key={`product${j}`} >
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
                                  {Array.from(Array(15).keys()).map((v,k)=>(
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

        {this.state.order && (
          <CartFooter onClickContinue={() => this.goToSlots()} quantity={order.choices.map(pc => pc.quantity).reduce((acc, cv) => acc + cv, 0)} total={order.total} />
        )}
      </div>
    );
  }
}

export default Cart;
