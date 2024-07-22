import React, { createContext, useContext, useState } from "react";

const LocalContext = createContext();

export const useLocalContext = () => useContext(LocalContext);

export const LocalProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // State for user role
  const [cart, setCart] = useState([]); // New state for cart management

  // Add a product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  // Remove a product from the cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Get all cart items
  const getCartItems = () => cart;

  return (
    <LocalContext.Provider
      value={{
        loggedInUser,
        setLoggedInUser,
        userRole,
        setUserRole,
        addToCart,
        removeFromCart,
        getCartItems,
        cart,
      }}
    >
      {children}
    </LocalContext.Provider>
  );
};
