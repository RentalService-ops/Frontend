import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import AdminHome from "./components/AdminHome";
import RentalHome from "./components/RentalHome";
import UserHome from "./components/UserHome";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [cookies] = useCookies(["jwtToken", "role"]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!cookies.jwtToken);
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
        <Route path="/" element={isAuthenticated ? <Navigate to={getHomeRoute()} /> : <Navigate to="/login" />} />
        <Route path="/admin-home" element={isAuthenticated && cookies.role === "admin" ? <AdminHome /> : <Navigate to="/login" />} />
        <Route path="/rental-home" element={isAuthenticated && cookies.role === "rental" ? <RentalHome /> : <Navigate to="/login" />} />
        <Route path="/user-home" element={isAuthenticated && cookies.role === "user" ? <UserHome /> : <Navigate to="/login" />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={getHomeRoute()} /> : <Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
