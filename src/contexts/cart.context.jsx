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

const removeCartItem = (cartItems, product) => {
  const existingCartItem = cartItems.find(
    cartItem => cartItem.id === product.id);
  if (existingCartItem.quantity === 1) {
    return cartItems.filter(cartItem => cartItem.id !== product.id);
  } else {
    return cartItems.map(cartItem => cartItem.id === product.id ? {
      ...cartItem, quantity: cartItem.quantity - 1
    } : cartItem);
  }
}

const clearCartItem = (cartItems, product) => {
  const existingCartItem = cartItems.find(
    cartItem => cartItem.id === product.id);
  if (existingCartItem) {
    return cartItems.filter(cartItem => cartItem.id !== product.id);
  }
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
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Pass in the function for how to reduce and the initial value
    const newCartCount = cartItems.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity, 0);
    setCartCount(newCartCount);
  }, [cartItems]);

  useEffect(() => {
    // Pass in the function for how to reduce and the initial value
    const newCartTotal = cartItems.reduce(
      (accumulator, currentValue) => accumulator + currentValue.quantity * currentValue.price, 0);
    setCartTotal(newCartTotal);
  }, [cartItems]);

  const addItemToCart = (productToAdd) => {
    setCartItems(addCartItem(cartItems, productToAdd));
  }
  const removeItemFromCart = (productToRemove) => {
    setCartItems(removeCartItem(cartItems, productToRemove));
  }
  const clearItemFromCart = (productToClear) => {
    setCartItems(clearCartItem(cartItems, productToClear));
  }
  const value = {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
    cartCount,
    cartTotal,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
