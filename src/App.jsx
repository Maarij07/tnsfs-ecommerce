import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Admin from "./components/Admin";
import Seller from "./components/Seller";
import LoadingScreen from "./components/LoadingScreen";
import Products from "./components/Products";
import Cart from "./components/Cart";
import { useLocalContext } from "./context/context";

function App() {
  const { loggedInUser, userRole } = useLocalContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {loggedInUser ? (
          <>
            {userRole === "admin" && <Route path="/admin" element={<Admin />} />}
            {userRole === "seller" && <Route path="/seller" element={<Seller />} />}
            {/* {userRole === "customer" && (
              <>
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
              </>
            )} */}
                <Route path="/" element={<Home />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
