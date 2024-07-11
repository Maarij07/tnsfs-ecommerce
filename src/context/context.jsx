// context.js or similar file
import React, { createContext, useContext, useState } from "react";

const LocalContext = createContext();

export const useLocalContext = () => useContext(LocalContext);

export const LocalProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // New state for user role

  return (
    <LocalContext.Provider value={{ loggedInUser, setLoggedInUser, userRole, setUserRole }}>
      {children}
    </LocalContext.Provider>
  );
};
