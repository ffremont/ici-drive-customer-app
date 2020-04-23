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
import { Order } from '../../models/order';
import { Subscription } from 'rxjs';
import cartStore from '../../stores/cart';
import Button from '@material-ui/core/Button';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import CartFooter from '../../components/cart-footer';


class Cart extends React.Component<{ history: any, match: any }, { order: Order | null }>{

  state = { order: null };
  subOrder: Subscription | null = null;

  componentWillUnmount() {
    this.subOrder?.unsubscribe();
  }

  componentDidMount() {
    this.subOrder = cartStore.subscribe((order: Order) => {
      this.setState({ order: order.ref ? order : null });
    });
  }

  render() {
    const order: Order = (this.state.order as any) as Order;

    return (
      <div className="cart">
        <MenuApp mode="cart" history={this.props.history} />

        {!this.state.order && (<div className="cart-container empty">
          <RemoveShoppingCartIcon className="icon" />
          <Button variant="outlined" onClick={() => this.props.history.push('/makers')}>Voir le catalogue</Button>
        </div>)}


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

        {this.state.order && (
          <CartFooter quantity={order.choices.map(pc => pc.quantity).reduce((acc, cv) => acc + cv, 0)} total={order.total}/>
        )}
      </div>
    );
  }
}

export default Cart;
