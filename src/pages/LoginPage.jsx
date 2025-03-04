import { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/index.css'
import SocialLogin from "../components/SocialLogin";
import { useCookies } from "react-cookie";
import axios from "axios"
import { jwtDecode } from 'jwt-decode';


const LoginPage = () => {
  const [cookies,setCookie]=useCookies(['jwtToken','role'])
  const getHomeRoute = (role) => {
    switch (role) {
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

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 


  const validateForm = async () => {
    const errors = {};
    // Email Validation
    if (!formData.email) {
      errors.email = 'Email is required.';
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        errors.email = 'Enter a valid email.';
      } 
    }

    // Password Validation
    if (!formData.password) {
      errors.password = 'Password is required.';
    }
    // else if (formData.password.length < 6) {
    //   errors.password = 'Password must be at least 6 characters.';
    // }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Logging in with:', formData);
      
      try{
        const response=await axios.post("http://localhost:8080/login",{
          email:formData.email,
          password:formData.password
        },{withCredentials:true})
        let userRole=jwtDecode(response.data.token).role;
        console.log(userRole)
        setCookie('role',userRole, { path: "/", maxAge: 86400 })
        if (userRole === "admin") navigate("/admin-home");
        else if (userRole === "rental") navigate("/rental-home");
        else navigate("/user-home"); // Default for 'user'
      }
      catch(err){
        console.log(err)
      }
    }
  };

  return (

    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2 className="form-title">Login</h2>
        <SocialLogin />
        <p className="separator"><span>or</span></p>
        <div className="form-group">
          <div className='input-wrapper'>

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
          <div className='input-wrapper'>
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

        <button type="submit" className="login-button">Log In</button>

        <p className="signup-prompt">
          Don&apos;t have an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
export default LoginPage;
