import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = ({ setIsAuthenticated }) => {
  const [cookies, setCookie] = useCookies(['jwtToken', 'role']);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const getHomeRoute = (role) => {
    switch (role) {
      case "admin": return "/admin-home";
      case "rental": return "/rental-home";
      case "user": return "/home";
      default: return "/login";
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:8080/login", formData, { withCredentials: true });
        const userRole = jwtDecode(response.data.token).role;
        setCookie('role', userRole, { path: "/", maxAge: 86400 });
        setIsAuthenticated(true);
        navigate(getHomeRoute(userRole));
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Form className="p-4 border rounded shadow bg-white" style={{ maxWidth: "400px", width: "100%" }} onSubmit={handleSubmit} noValidate>
        <h2 className="text-center mb-3">Login</h2>
        
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control 
            type="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">Log In</Button>

        <p className="text-center mt-3">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </Form>
    </Container>
  );
};

export default LoginPage;
