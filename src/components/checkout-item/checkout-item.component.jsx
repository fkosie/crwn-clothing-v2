import { useContext } from 'react';

import { CartContext } from '../../contexts/cart.context';

import Button from '../button/button.component';

import './checkout-item.styles.scss';

const CheckoutItem = ({ cartItem }) => {
  const { addItemToCart, removeItemFromCart, clearItemFromCart } = useContext(CartContext);

  const clearItemHandler = (cartItem) => {
    clearItemFromCart(cartItem);
  }
  const addItemHandler = (cartItem) => {
    addItemToCart(cartItem);
  }
  const removeItemHandler = (cartItem) => {
    removeItemFromCart(cartItem);
  }

  const { name, imageUrl, price, quantity } = cartItem;
  return (
    <div className='checkout-item-container'>
      <div className='image-container'><img src={imageUrl} alt={name} /></div>
      <span className='name'>{name}</span>
      <span className='quantity'>
        <div className='arrow' onClick={() => removeItemHandler(cartItem)}>
          &lt;
        </div>
        <div className='value'>{quantity}</div>
        <div className='arrow' onClick={() => addItemHandler(cartItem)}>
          &gt;
        </div>
      </span>
      <span className='price'>${price}</span>
      <div className='remove-button' onClick={() => clearItemHandler(cartItem)}>&#10005;</div>
    </div>
  );
}

export default CheckoutItem;
