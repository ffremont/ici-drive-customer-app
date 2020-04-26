
import React from 'react';
import Button from '@material-ui/core/Button';
import './CartFooter.scss';

const CartFooter = (props: any) => {

  return (
    <div className="cart-footer">
      <div className="total">
        <div>Total :</div>
  <div className="price">{props.total.toFixed(2)}€</div>
      </div>
      <div className="products">
        <div>Articles :</div>
        <div className="qantity">{props.quantity}</div>
      </div>
      <div className="actions">
        <Button className="main-action" variant="contained" onClick={props.onClickContinue} color="secondary">Réserver</Button>
      </div>
    </div>
  );
}

export default CartFooter;