import React from 'react';
import './Catalog.scss';
import MenuApp from '../../components/menu-app';
import { Subscription } from 'rxjs';
import productStore from '../../stores/products';
import makerStore from '../../stores/makers';
import basketStore from '../../stores/basket';
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
import MapIcon from '@material-ui/icons/Map';
import { Maker } from '../../models/marker';
import { Order } from '../../models/order';
import BasketConflit from './basket-conflit';
import SnackAdd from '../../components/snack-add';

interface GraphicProduct extends Product {
  category?: Item
}

class Catalog extends React.Component<{ history: any, match: any }, { products: GraphicProduct[], openPreview: string, maker: Maker | null, activeIndex: number, wantToAdd: Product | null, openCleanBasket: boolean, basket: Order | null }>{

  state = { products: [], openCleanBasket: false, activeIndex: -1, maker: null, openPreview: '', basket: null, wantToAdd: null };
  subProducts: Subscription | null = null;
  subMakers: Subscription | null = null;
  subOrder: Subscription | null = null;

  componentWillUnmount() {
    this.subProducts?.unsubscribe();
    this.subMakers?.unsubscribe();
    this.subOrder?.unsubscribe();
  }

  componentDidMount() {
    const makerId = this.props.match.params.id;

    this.subProducts = productStore.subscribe((products: Product[]) => {
      this.setState({
        products: products.map((p: GraphicProduct) => {
          p.category = conf.categories.find(c => c.id === p.categoryId);
          return p;
        })
      });
    });
    this.subOrder = basketStore.subscribe((order: Order) => {
      this.setState({ basket: order.ref ? order : null });
    });


    this.subMakers = makerStore.subscribe((markers: Maker[]) => {
      const maker = markers.find((p: Maker) => p.id === makerId) || null;
      if (!maker) {
        console.error("maker not found : " + makerId);
        this.props.history.push('/');
      } else {
        this.setState({
          maker
        })
      }


    })

    productStore.refresh(makerId);
  }

  addCart(p: Product) {
    debugger;
    if (this.state.basket !== null && this.state.maker !== null) {
      const basket: Order = (this.state.basket as any) as Order;
      const maker: Maker = (this.state.maker as any) as Maker;

      if (basket?.maker?.id !== maker.id) {
        // cas, panier commencé sur un autre maker
        this.setState({ openCleanBasket: true, wantToAdd: p })
      } else {
        //cas panier commencé avec le même maker
        basketStore.addProduct(p);
      }
    } else {

      if (this.state.maker !== null) {
        basketStore.addFirstProductWithMaker(this.state.maker as any, {product:p, quantity:1});
      } else {
        console.error("add cart where maker is null");
        this.props.history.push('/');
      }

    }
  }

  render() {
    const myPart: any = this.state.maker;

    return (
      <div className="maker">
        <MenuApp mode="catalog" history={this.props.history} />

        <SnackAdd/>
        <Fab className="place-btn" size="medium" color="primary" aria-label="add">
          <MapIcon />
        </Fab>

        <BasketConflit open={this.state.openCleanBasket} onCleanAndAdd={() => basketStore.addFirstProductWithMaker(this.state.maker as any, { product: this.state.wantToAdd, quantity: 1 } as any)} />

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

        {this.state.maker && (<Grid container alignContent="center" alignItems="center" justify="center">
          <Grid item>
            <Discover image={myPart.image} height={140} description={myPart.description} title={myPart.name} learnMore={myPart.webPage} />
          </Grid>
        </Grid>)}


        <Grid className="products-grid" container alignContent="center" alignItems="center" justify="center" spacing={0}>
          {this.state.products.map((p: GraphicProduct, i: number) => (
            <Grid item key={i}>
              <Card className="product-card" >
                <CardHeader
                  title={p.label}
                  subheader={p.category?.label}
                />
                <CardMedia onClick={() => this.setState({ openPreview: p.image })}
                  component="img"
                  alt="Contemplative Reptile"
                  height="140"
                  className="maker-media"
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
                  <IconButton aria-label="share">
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
                    {p.volume && (<Typography className="my-p" paragraph>Volume: {parseFloat(`${p.volume}`).toFixed(2)}L</Typography>)}
                    {p.weight && (<Typography className="my-p" paragraph>Poids: {p.weight > 1000 ? parseFloat(`${p.weight / 1000}`).toFixed(1) + 'k' : parseFloat(`${p.weight}`).toFixed(0)}g</Typography>)}

                    {p.description && (<Typography className="my-p" paragraph>
                      {p.description}
                    </Typography>)}

                  </CardContent>
                </Collapse>
              </Card>
            </Grid>

          ))}


        </Grid>



      </div>
    );
  }
}

export default Catalog;

