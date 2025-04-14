import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/index.css";
import { useCookies } from "react-cookie";
import axios from "axios";

const LoginPage = ({ setIsAuthenticated, isAuthenticated }) => {
  const [cookies, setCookie] = useCookies(["jwtToken", "role"]);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(""); // Store login error message
  const navigate = useNavigate();

  const getHomeRoute = useCallback((role) => {
    switch (role) {
      case "admin":
        return "/admin-home";
      case "rental":
        return "/rental-home";
      case "user":
        return "/user-home";
      default:
        return "/login";
    }
  }, []);

  const validateForm = async () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required.";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        errors.email = "Enter a valid email.";
      }
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!(await validateForm())) return;
  
    try {
      const response = await axios.post("http://localhost:8080/login", {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });
      
      setIsAuthenticated(true);
  
      setTimeout(() => {
        navigate("/"); // Navigate first
        window.location.reload(); // Reload after navigation
      }, 1);
      
    } catch (err) {
      console.error("Login Error:", err);
      alert("Invalid login credentails!!");
    }
  };
  
  useEffect(() => {
    if (isAuthenticated && cookies.role) {
      navigate(getHomeRoute(userRole)); // Navigate first
      setTimeout(() => {
        window.location.reload(); // Then reload after a short delay
      }, 300);
    }
  }, [isAuthenticated, cookies.role, navigate, getHomeRoute]);

  return (
    <div  style={{height:"80vh"}}>
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2 className="form-title">Login</h2>

        {loginError && <p className="error-message">{loginError}</p>}

        <div className="form-group">
          <div className="input-wrapper">
            <i className="material-symbols-outlined">mail</i>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              className="input-field"
              value={formData.email}
              required
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <div className="input-wrapper">
            <i className="material-symbols-outlined">lock</i>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="input-field"
              value={formData.password}
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
        </div>

        <button type="submit" className="login-button">
          Log In
        </button>

        <p className="signup-prompt">
          Don&apos;t have an account? <Link to="/register">Sign Up</Link>
        </p>
        <p className="signup-prompt">
          Forgot password? <Link to="/verify-email">Forgot Password</Link>
        </p>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;
