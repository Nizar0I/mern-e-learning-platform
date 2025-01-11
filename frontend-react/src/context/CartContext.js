// src/context/CartContext.js
import React, { createContext, useContext, useState } from "react";

// Create a context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add a course to cart
  const addToCart = (course) => {
    // Optional: Check if the course is already in the cart
    const exists = cart.some((item) => item._id === course._id);
    if (exists) return; // or handle quantity, etc.

    setCart((prev) => [...prev, course]);
  };

  // Remove a course from cart
  const removeFromCart = (courseId) => {
    setCart((prev) => prev.filter((item) => item._id !== courseId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook for easy usage
export const useCart = () => useContext(CartContext);
