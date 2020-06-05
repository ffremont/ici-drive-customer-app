import React from 'react';
import './MyOrders.scss';
import MenuApp from '../../components/menu-app';
import ordersStore from '../../stores/orders';
import { Subscription } from 'rxjs';
import { Order, OrderState } from '../../models/order';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import * as moment from 'moment';
import { withStyles, Theme } from '@material-ui/core/styles';
import { deepOrange, grey, green, common } from '@material-ui/core/colors';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import IconButton from '@material-ui/core/IconButton';



const useStyles = (theme: Theme) => ({
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },
  grey:{
    color: theme.palette.getContrastText(grey[500]),
    backgroundColor: grey[500],
  },
  green:{
    color: common.white,
    backgroundColor: green[500],
  }
});

class MyOrders extends React.Component<{ history: any, classes: any }, { orders: Order[] }>{

  
  statusLabel:any = {};
  state = { orders: [] };
  sub: Subscription | null = null;

  componentWillUnmount() {
    this.sub?.unsubscribe();
  }

  componentDidMount() {
    this.statusLabel[OrderState.PENDING] = {label: 'En cours de validation', color: this.props.classes.orange};
    this.statusLabel[OrderState.CANCELLED] = {label: 'Annulée', color: this.props.classes.grey};
    this.statusLabel[OrderState.VERIFIED] = {label: 'Vérifiée, en attente de confirmation', color: this.props.classes.orange};
    this.statusLabel[OrderState.CONFIRMED] = {label: 'Confirmée', color: this.props.classes.green};
    this.statusLabel[OrderState.REFUSED] = {label:'Refusée', color: this.props.classes.grey}

    
    this.sub = ordersStore.subscribe((orders: Order[]) => {
      if(orders)
        (orders as any).sortBy('slot',true);
      this.setState({ orders : orders || [] })
    });

    // charge la liste des commandes
    ordersStore.load();
  }

  render() {
    return (<div className="my-orders">
      <MenuApp mode={'my-orders'} history={this.props.history} />


       <div className="orders">
        <List>
          {this.state.orders.map((order: Order, i) => (
            <ListItem key={`li_${i}`} onClick={() => this.props.history.push(`/my-orders/${order.id}`)}>
              <ListItemAvatar>
                <Avatar className={this.statusLabel[(order.status as any)].color}>
                  {this.statusLabel[(order.status as any)].label.substr(0,1).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={this.statusLabel[(order.status as any)].label+` (${order.total}€)`} 
                secondary={moment.default(order.slot).format('ddd D MMM à HH:mm')} />
              <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="next">
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
            </ListItem>
          ))}



        </List>
      </div>
    </div>);
  }
}

export default withStyles(useStyles)(MyOrders);
