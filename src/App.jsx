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
import CategoriesShow from "./components/CategoriesShow";  // Import CategoriesShow
import { useLocalContext } from "./context/context";

function App() {
  const { loggedInUser, userRole } = useLocalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]); // Initialize categories state

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Simulate fetching categories data
    // Replace this with actual data fetching logic
    setCategories([
      { id: 1, name: "Category 1" },
      { id: 2, name: "Category 2" },
      { id: 3, name: "Category 3" },
    ]);
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
            {/* Add the Products route */}
            <Route path="/products" element={<Products />} />
            <Route path="/" element={<Home />} />
            {/* Pass categories state to CategoriesShow component */}
            <Route path="/categories" element={<CategoriesShow categories={categories} />} />
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
