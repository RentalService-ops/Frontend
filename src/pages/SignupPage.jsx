import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/index.css'
import axios from "axios"

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    role:''
  });


  const [errors, setErrors] = useState({});
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // Validate form fields
  const validateForm = async () => {
    const errors = {};

    // Name Validation
    if (!formData.username.trim()) {
      errors.name = 'Name is required.';
    }

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
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    // Phone Number Validation
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required.';
    } else {
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Enter a valid 10-digit phoneNumber number.';
      }
    }

    if(!formData.role){
      errors.role="Role is required"
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };


  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await validateForm()) {
      try{
        await axios.post("http://localhost:8080/register",formData)
        useNavigate("/login")
      }
      catch(err){
        console.log(err.message)
      }

      // Reset form after successful submission
      setFormData({ username: '', email: '', password: '', phoneNumber: '', address: '',role:'' });
    }

  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <h2 className="form-title">Signup</h2>


        <div className="form-group">

          <div className='input-wrapper'>
            <i className="material-symbols-outlined">person</i>
            <input
              type="text"
              id="name"
              name="username"
              placeholder="Enter your name"
              className="input-field"
              value={formData.name}
              required
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
        </div>

        <div className="form-group">
          <div className='input-wrapper'>
            <i className="material-symbols-outlined">mail</i>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="input-field"
              value={formData.email}
              required
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <div className='input-wrapper'>
            <i className="material-symbols-outlined">lock</i>
            <input
              type={isPasswordShown ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="input-field"
              value={formData.password}
              required
              onChange={handleChange}
            />
            <i
              onClick={() => setIsPasswordShown((prevState) => !prevState)}
              className="material-symbols-outlined eye-icon"
              style={{ cursor: 'pointer' }}
            >
              {isPasswordShown ? 'visibility' : 'visibility_off'}
            </i>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
        </div>

        <div className="form-group">
          <div className='input-wrapper'>
            <i className="material-symbols-outlined">call</i>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phoneNumber number"
              className="input-field"
              value={formData.phoneNumber}
              required
              onChange={handleChange}
            />
            {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
          </div>
        </div>

        <div className="form-group">
          <div className='input-wrapper'>
            <i className="material-symbols-outlined">home</i>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter your address"
              className="input-field"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-group">
          <div className='input-wrapper' >
              <select className="input-field" required onChange={(event)=>setFormData({...formData,role:event.target.value})}>
                <option value="" hidden disabled selected>Please select your role: </option>
                <option value="rental">Rental</option>
                <option value="user">User</option>
              </select> 
              {errors.phoneNumber && <span className="error">{errors.role}</span>}
           </div>
        </div>       

        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>
      <p className="signup-prompt">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}

export default SignupPage;
