"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Provider component that wraps your app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on initial render (client-side only)
  useEffect(() => {
    try {
      const storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item already exists, increment its quantity
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Otherwise, add the new item with a quantity of 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      // If quantity drops to 0 or less, remove the item
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Calculate total price of items in the cart
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const clearCart = () => {
    setCartItems([]);
    // This will also update localStorage because of the useEffect
  };
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart, 
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};