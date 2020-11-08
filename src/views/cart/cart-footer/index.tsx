
import React from 'react';
import Button from '@material-ui/core/Button';
import './CartFooter.scss';
import { Avatar, Chip } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

const CartFooter = (props: any) => {

  return (
    <div className="cart-footer">
      <div className="total">
        <div>
          {!props.wantDelivery && (<span>Total :</span>)}
          {props.wantDelivery && (<span>Total (hors livraison) :</span>)}
        </div>
        <div className="price">{props.total.toFixed(2)}€</div>
      </div>
      { props.wantDelivery && (props.total < props.deliveryAvailableFrom) && <div className="delivery-available-from">
        <div className="delivery-wrapper">
        <Chip className="d-info"
          avatar={<Avatar className="avatar-transparent"><ShoppingBasketIcon /></Avatar>}
          label={props.deliveryAvailableFrom ? `Minimum ${props.deliveryAvailableFrom}€` : `Aucun min. d'achats`}
          color="secondary"
        />
          </div>
      </div>}
      {props.wantDelivery && (<div className="delivery">
        <div>Frais de livraison :</div>
        <div className="free">{props.deliveryCost.toFixed(2)}€</div>
      </div>)}
      <div className="products">
        <div>Articles :</div>
        <div className="qantity">{props.quantity}</div>
      </div>
      <div className="actions">
        <Button 
        className="main-action" 
        variant="contained" 
        disabled={props.wantDelivery && (props.total < props.deliveryAvailableFrom)}
        onClick={props.onClickContinue} color="secondary">{props.text}</Button>
      </div>
    </div>
  );
}

export default CartFooter;