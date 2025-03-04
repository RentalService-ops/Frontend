import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; 
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminHome from "./components/AdminHome";
import RentalHome from "./components/RentalHome";
import UserHome from "./components/UserHome";
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const decode=document.cookie?.split("=")[1]
  let cookies=""
  if(decode){
  cookies=jwtDecode(decode)
  console.log(cookies.role)
  }
  useEffect(() => {
    if(cookies){
    setIsAuthenticated(true);
    }
  }, [cookies]);

  // Determine home route based on role
  const getHomeRoute = () => {
    switch (cookies.role) {
      case "admin":
        return "/admin-home";
      case "rental":
        return "/rental-home";
      case "user":
        return "/user-home";
      default:
        return "/login"; // Redirect to login if role is invalid
    }
  };

  return (
    <Router>
      <Routes>
        {/* Redirect unauthenticated users to /login */}
        <Route path="/" element={isAuthenticated ? <Navigate to={getHomeRoute()} /> : <Dashboard />} />
        <Route path="/admin-home" element={isAuthenticated && cookies.role === "admin" ? <AdminHome /> : <Navigate to="/login" />} />
        <Route path="/rental-home" element={isAuthenticated && cookies.role === "rental" ? <RentalHome /> : <Navigate to="/login" />} />
        <Route path="/user-home" element={isAuthenticated && cookies.role === "user" ? <UserHome /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={getHomeRoute()} /> : <LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;
