// import React from "react";
// import { Container, Row, Col, Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// export default function Dashboard() {
//   const navigate=useNavigate();
//   return (
//     <div className="d-flex flex-column min-vh-100 bg-dark text-white">

//       <div className="flex-grow-1 d-flex flex-column justify-content-center text-center">
//         <Container className="py-5">
//           <h1 className="display-4 fw-bold">Welcome to Equipment Rental</h1>
//           <p className="lead">
//             Rent high-quality equipment for your needs, from tools to gadgets, at the best prices.
//           </p>
//           <Button variant="primary" className="mt-3" onClick={()=>navigate("/login")}>Explore Now</Button>
//         </Container>

//         <Container className="py-5">
//           <Row className="justify-content-center">
//             <Col md={8} className="text-center">
//               <h2>Why Choose Us?</h2>
//               <p className="fs-5">
//                 We offer a wide range of equipment for rental, with affordable pricing and secure transactions.
//                 Whether you're a professional or a hobbyist, we have the right tools for you.
//               </p>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      
      {/* Hero Section */}
      <div className="position-relative bg-dark text-white text-center d-flex flex-column justify-content-center" style={{ minHeight: "70vh" }}>
        <Container>
          <h1 className="display-2 fw-bold mb-3">
            Rent Smarter, Work Faster
          </h1>
          <p className="lead mb-4">
            Find the best tools and equipment to get your job done — easy, affordable, and fast.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="rounded-pill px-5 py-2"
            onClick={() => navigate("/login")}
          >
            Get Started
          </Button>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <Row className="g-4 text-center">
          <Col md={4}>
            <Card className="h-100 shadow border-0">
              <Card.Body>
                <i className="bi bi-truck fs-1 text-primary mb-3"></i>
                <Card.Title className="fw-bold">Fast Delivery</Card.Title>
                <Card.Text>
                  Get your equipment delivered wherever you are, whenever you need it.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow border-0">
              <Card.Body>
                <i className="bi bi-shield-lock fs-1 text-primary mb-3"></i>
                <Card.Title className="fw-bold">Secure Payments</Card.Title>
                <Card.Text>
                  Safe and easy payments with industry-leading security standards.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow border-0">
              <Card.Body>
                <i className="bi bi-award fs-1 text-primary mb-3"></i>
                <Card.Title className="fw-bold">Top Quality</Card.Title>
                <Card.Text>
                  Choose from a wide range of well-maintained, high-quality equipment.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Call to Action Section */}
      <div className="bg-primary text-white py-5 text-center">
        <Container>
          <h2 className="fw-bold mb-3">Ready to Rent?</h2>
          <p className="lead mb-4">
            Sign up today and start exploring our collection.
          </p>
          <Button
            variant="light"
            size="lg"
            className="rounded-pill px-5 py-2 text-primary fw-bold"
            onClick={() => navigate("/login")}
          >
            Join Now
          </Button>
        </Container>
      </div>
      
    </div>
  );
}
