import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Index from "./components/Pages";
import HomePage from "./components/Pages/HomePage";
import LoginPage from "./components/Pages/Loginpage";
import SignupPage from "./components/Pages/SignupPage";
import ProductDetailPage from "./components/Pages/ProductDetailPage";
import ProfilePage from "./components/Pages/ProfilePage";

function AppRoutes() {
  const [cookies] = useCookies(["jwtToken"]); // Read JWT from cookies
  const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.jwtToken); // Store authentication state

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route
        path="/home"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />

    </Routes>
  );
}

export default AppRoutes;
