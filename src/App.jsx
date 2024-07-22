import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Admin from "./components/Admin";
import Seller from "./components/Seller";
import LoadingScreen from "./components/LoadingScreen";
import Cart from "./components/Cart";
import { useLocalContext } from "./context/context";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
            {userRole === "admin" && (
              <Route path="/admin" element={<Admin />} />
            )}
            {userRole === "seller" && (
              <Route path="/seller" element={<Seller />} />
            )}
            {/* Default route for authenticated users */}
            <Route path="/" element={<Home />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
        {/* Redirect to home or admin or seller if route does not exist */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    // <Cart/>
  );
}

export default App;
