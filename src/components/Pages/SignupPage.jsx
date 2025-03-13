import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Form, Button } from 'react-bootstrap';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) errors.username = 'Name is required.';
    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Enter a valid 10-digit phone number.';
    }

    if (!formData.role) errors.role = "Role is required.";

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
    if (validateForm()) {
      try {
        await axios.post("http://localhost:8080/register", formData);
        navigate("/login"); // Navigate only after successful API call
      } catch (err) {
        console.log(err.message);
      }
      setFormData({ username: '', email: '', password: '', phoneNumber: '', address: '', role: '' });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Form className="p-4 border rounded shadow bg-white" style={{ maxWidth: "400px", width: "100%" }} onSubmit={handleSubmit} noValidate>
        <h2 className="text-center mb-3">Signup</h2>

        <Form.Group className="mb-3">
          {/* <Form.Label>Name</Form.Label> */}
          <Form.Control
            type="text"
            name="username"
            placeholder="Enter your name"
            value={formData.username}
            onChange={handleChange}
            isInvalid={!!errors.username}
          />
          <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          {/* <Form.Label>Email</Form.Label> */}
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          {/* <Form.Label>Password</Form.Label> */}
          <div className="d-flex align-items-center position-relative">
            <Form.Control
              type={isPasswordShown ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <i
              onClick={() => setIsPasswordShown((prev) => !prev)}
              className={`bi ${isPasswordShown ? 'bi-eye-slash' : 'bi-eye'} position-absolute end-0 me-2`}
              style={{ cursor: 'pointer', paddingRight: "10px" }}
            />
          </div>
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          {/* <Form.Label>Phone Number</Form.Label> */}
          <Form.Control
            type="text"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            isInvalid={!!errors.phoneNumber}
          />
          <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          {/* <Form.Label>Address</Form.Label> */}
          <Form.Control
            type="text"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          {/* <Form.Label>Role</Form.Label> */}
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            isInvalid={!!errors.role}
          >
            <option value="" disabled hidden>Please select your role</option>
            <option value="rental">Rental</option>
            <option value="user">User</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">Sign Up</Button>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </Form>
    </Container>
  );
}

export default SignupPage;
