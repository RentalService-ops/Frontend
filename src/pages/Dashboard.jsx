import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export default function Index() {
  const navigate=useNavigate();
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center text-center">
        {/* Hero Section */}
        <Container className="py-5">
          <h1 className="display-4 fw-bold">Welcome to Equipment Rental</h1>
          <p className="lead">
            Rent high-quality equipment for your needs, from tools to gadgets, at the best prices.
          </p>
          <Button variant="primary" className="mt-3" onClick={()=>navigate("/login")}>Explore Now</Button>
        </Container>

        {/* About Section */}
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2>Why Choose Us?</h2>
              <p className="fs-5">
                We offer a wide range of equipment for rental, with affordable pricing and secure transactions.
                Whether you're a professional or a hobbyist, we have the right tools for you.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}