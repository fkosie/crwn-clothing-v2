import { createContext, useState, useEffect } from 'react';

const addCartItem = (cartItems, product) => {
  const existingCartItem = cartItems.find(
    cartItem => cartItem.id === product.id);
  if (existingCartItem) {
    return cartItems.map(cartItem => cartItem.id === product.id ? {
      ...cartItem, quantity: cartItem.quantity + 1
    } : cartItem);
  }
  return [...cartItems, { ...product, quantity: 1 }];
}

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => { },
  cartItems: [],
  addItemToCart: () => { }
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Pass in the function for how to reduce and the initial value
    const newCartCount = cartItems.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity, 0);
    setCartCount(newCartCount)
  }, [cartItems]);

  const addItemToCart = (productToAdd) => {
    setCartItems(addCartItem(cartItems, productToAdd));
  }
  const value = { isCartOpen, setIsCartOpen, cartItems, addItemToCart, cartCount };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
