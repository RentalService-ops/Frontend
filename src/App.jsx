import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import RentalHome from "./pages/RentalHome";
import AdminLayout from "./pages/AdminLayout";
import AdminUsers from "./components/admin/AdminUsers";
import AdminEquipment from "./components/admin/AdminEquipment";
import AdminBookings from "./components/admin/AdminBookings";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminQueries from "./components/admin/AdminQueries";
import AdminCategory from "./components/admin/AdminCategory";
import UserHome from "./pages/UserHome";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Footer from "./layout/Footer";
import ContactUs from "./pages/ContactUs";
import Profile from "./pages/Profile";
import NavBar from "./layout/NavBar";

import "./styles/index.css";
import ForgotPassword from "./components/ForgotPassword";
import EmailVerification from "./components/EmailVerification";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookies, setCookies] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = document.cookie?.split("=")[1];
    if (token) {
      const decoded = jwtDecode(token);
      setCookies(decoded);
      setIsAuthenticated(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); 
  };

  const getHomeRoute = () => {
    switch (cookies?.role) {
      case "admin":
        return "/admin/dashboard";
      case "rental":
        return "/rental-home";
      case "user":
        return "/user-home";
      default:
        return "/login";
    }
  };
  

  return (
    <Router>
      <NavBar toggleSidebar={toggleSidebar} />
          <Routes>

            <Route path="/" element={isAuthenticated ? <Navigate to={getHomeRoute()} /> : <Dashboard />} />
            <Route path="/admin/*" element={isAuthenticated && cookies?.role === "admin" ? <AdminLayout /> : <Navigate to="/login" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="equipments" element={<AdminEquipment />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="queries" element={<AdminQueries />} />
            <Route path="categories" element={<AdminCategory />} />
          </Route>
            <Route path="/rental-home" element={isAuthenticated && cookies?.role === "rental" ? <RentalHome isSidebarOpen={isSidebarOpen}/> : <Navigate to="/login" />} />
            <Route path="/user-home" element={isAuthenticated && cookies?.role === "user" ? <UserHome isSidebarOpen={isSidebarOpen}/> : <Navigate to="/login" />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to={getHomeRoute()} /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<EmailVerification />} />
          </Routes>
      <Footer />
    </Router>
  );
}

export default App;


