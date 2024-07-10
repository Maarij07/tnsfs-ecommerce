import React from "react";
import Home from './components/Home';
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Admin from "./components/Admin";
import { useLocalContext } from "./context/context";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const { loggedInUser } = useLocalContext();

  return (
    <Router>
      <Routes>
        {loggedInUser ? (
          loggedInUser.email === "arsal@gmail.com" ? (
            <Route path="/" element={<Admin />} />
          ) : (
            <Route path="/" element={<Home />} />
          )
        ) : (
          <>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
        {/* Redirect to home or admin if route does not exist */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
