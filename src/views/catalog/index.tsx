import React from 'react';
import './Catalog.scss';
import MenuApp from '../../components/menu-app';
import { Subscription } from 'rxjs';
import makerStore from '../../stores/makers';
import cartStore from '../../stores/cart';
import notifStore from '../../stores/notif';
import { Product } from '../../models/product';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Discover from '../../components/discover';
import { Item } from '../../models/item';
import conf from '../../confs';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { Maker } from '../../models/maker';
import { Order } from '../../models/order';
import CartConflit from './cart-conflit';
import SnackAdd from '../../components/snack-add';
import { NotifType } from '../../models/notif';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import historyService from '../../services/history.service';


interface GraphicProduct extends Product {
  category?: Item
}

class Catalog extends React.Component<{ history: any, match: any }, { waiting: boolean,products: GraphicProduct[], openPreview: string, maker: Maker | null, activeIndex: number, wantToAdd: Product | null, openCleanCart: boolean, cart: Order | null }>{

  state = { waiting:false, products: [], openCleanCart: false, activeIndex: -1, maker: null, openPreview: '', cart: null, wantToAdd: null };
  subMakers: Subscription | null = null;
  subOrder: Subscription | null = null;

  componentWillUnmount() {
    this.subMakers?.unsubscribe();
    this.subOrder?.unsubscribe();
  }

  componentDidMount() {
    historyService.on(window.location.pathname);
    const makerId = this.props.match.params.id;

    this.subOrder = cartStore.subscribe((order: Order) => {
      this.setState({ cart: order.ref ? order : null });
    });

    this.subMakers = makerStore.subscribe((makers: Maker[]) => {
      const maker = makers.find((p: Maker) => p.id === makerId) || null;
      if (!maker) {
        console.info("maker not found : " + makerId);
      } else {
        const products = (maker.products || []).map((p: GraphicProduct) => {
          p.category = conf.categories.find(c => c.id === p.categoryId);
          p.topOfList = (p.topOfList ? 1 : 0) as any;
          return p;
        }).filter((p: GraphicProduct) => p.available);

        (products as any).sortBy('topOfList',true, 'label', true);

        this.setState({
          maker, products
        });
      }      
    });

    this.setState({waiting:true});
    makerStore.refresh(makerId).finally(() => this.setState({waiting:false}));
  }

  addCart(p: Product) {
    if (this.state.cart !== null && this.state.maker !== null) {
      const cart: Order = (this.state.cart as any) as Order;
      const maker: Maker = (this.state.maker as any) as Maker;

      if (cart?.maker?.id !== maker.id) {
        // cas, panier commencé sur un autre maker
        this.setState({ openCleanCart: true, wantToAdd: p })
        notifStore.set({type: NotifType.SNACK_CART, message:`"${p.label}" ajouté`, duration:3000});
      } else {
        //cas panier commencé avec le même maker
        cartStore.addProduct(p)
          .then(() => notifStore.set({type: NotifType.SNACK_CART, message:`"${p.label}" ajouté`, duration:3000}))
          .catch((err:any) => {
            if(err?.badQuantity){
              notifStore.set({type: NotifType.SNACK_CART, message:'Quantité max atteinte', duration:2000});
            }
          });        
      }
    } else {
      if (this.state.maker !== null) {
        cartStore.addFirstProductWithMaker(this.state.maker as any, {product:p, quantity:1});
        notifStore.set({type: NotifType.SNACK_CART, message:`"${p.label}" ajouté`, duration:3000})
      } else {
        console.error("add cart where maker is null");
        this.props.history.push('/');
      }
    }
  }

  shareProduct(p:GraphicProduct){
    if((window as any).navigator.share){
      (window as any).navigator.share({
        title: `ici-drive.fr : ${p.label}`,
        text: `Découvrez ce produit local "${p.label}" sur ${conf.baseURL}/makers/${(this.state.maker as any).id}`,
      }); // partage l'URL de MDN
    }
  }

  cleanAndAdd(){
    cartStore.addFirstProductWithMaker(this.state.maker as any, { product: this.state.wantToAdd, quantity: 1 } as any)
    //notifStore.set({type: NotifType.SNACK_CART, message:'Panier actualisé'});
    if(this.state.wantToAdd)
      notifStore.set({type: NotifType.SNACK_CART, message:`"${(this.state.wantToAdd as any).label}" ajouté`, duration:3000})
    this.setState({openCleanCart:false});
  }

  render() {
    const myPart = (this.state.maker as any)as Maker;

    return (
      <div className="maker">
        <MenuApp mode="catalog" share={`${conf.baseURL}/makers/${myPart ? myPart.id : ''}/catalog`} history={this.props.history} />

        <SnackAdd />


        <CartConflit open={this.state.openCleanCart} onClose={() => this.setState({openCleanCart:false})} onCleanAndAdd={() => this.cleanAndAdd()} />

        <Modal
          open={!!this.state.openPreview}
          onClose={() => this.setState({ openPreview: '' })}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Paper className="preview-paper" onClick={() => this.setState({ openPreview: '' })}>
            <img src={this.state.openPreview} alt="preview" />
          </Paper>
        </Modal>

        <div className="maker-container">
        {this.state.maker && (<Discover  payments={myPart.payments} goToPlace={() => this.props.history.push(`/makers/${myPart.id}/place`)} image={myPart.image} height={140} description={myPart.description} title={myPart.name} learnMore={myPart.webPage} />)}
        </div>

      
        <Grid className="products-grid" container alignContent="center" alignItems="center" justify="center" spacing={0}>
          {this.state.products.length === 0 && (<Grid item className="bientot">
            Bientôt des produits...
          </Grid>)}
          {this.state.products.map((p: GraphicProduct, i: number) => (
            <Grid item key={i}>
              <Card className="product-card" >
                <CardHeader
                  title={p.label}
                  subheader={p.category?.label}
                />
                <CardMedia onClick={() => this.setState({ openPreview: p.image })}
                  component="img"
                  alt="product"
                  height="140"
                  className="maker-media"
                  onError={(e:any) => {
                    e.target.onerror = null;
                    e.target.src = "https://app.ici-drive.fr/default_image.jpg"
                  }}
                  image={p.image}
                  title={p.label}
                />
                <CardContent className="content-price">
                  <Typography className="typo-price" variant="h5" color="textSecondary">
                    <div className="price">
                      {parseFloat(`${p.price}`).toFixed(2)}<sup>€</sup>
                    </div>
                    <Fab size="large" color="secondary" onClick={() => this.addCart(p)} aria-label="add to cart">
                      <AddShoppingCartIcon />
                    </Fab>
                  </Typography>
                </CardContent>
                <CardActions disableSpacing className="cardaction-product">
                  <IconButton aria-label="share" onClick={() => this.shareProduct(p)}>
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    className={(this.state.activeIndex === i ? 'expandOpen' : 'expanded')}
                    onClick={() => this.state.activeIndex === i ? this.setState({ activeIndex: -1 }) : this.setState({ activeIndex: i })}
                    aria-expanded={this.state.activeIndex === i}
                    aria-label="voir plus"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </CardActions>
                <Collapse in={this.state.activeIndex === i} timeout="auto" unmountOnExit>
                  <CardContent>
                    {p && ((p.volume||0) > 0) && (<Typography className="my-p" paragraph>Volume: {parseFloat(`${p.volume}`).toFixed(2)}L</Typography>)}
                    {p && ((p.weight||0) > 0) && (<Typography className="my-p" paragraph>Poids: {(p.weight||0) > 1000 ? parseFloat(`${(p.weight||0) / 1000}`).toFixed(1) + 'k' : parseFloat(`${p.weight}`).toFixed(0)}g</Typography>)}

                    {p.description && (<Typography className="my-p" paragraph>
                      {p.description}
                    </Typography>)}

                  </CardContent>
                </Collapse>
              </Card>
            </Grid>

          ))}


        </Grid>

        {this.state.waiting && (<Backdrop className="backdrop" open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>)}
      </div>
    );
  }
}

export default Catalog;

