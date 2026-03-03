import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Add to Cart Logic
  const addToCart = (item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.name === item.name);
      if (exists) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove from Cart
  const removeFromCart = (name) => {
    setCartItems(prev => prev.filter(i => i.name !== name));
  };

  // Update Quantity
  const updateQuantity = (name, type) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.name === name) {
          const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  // Total Price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, updateQuantity, 
      totalPrice, totalItems, isCartOpen, setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};