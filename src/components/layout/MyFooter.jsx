// import React from 'react'

// function MyFooter() {
//   return (
//     <div>
//         <footer className="bg-light py-3 text-center">
//         <p className="text-muted mb-0">&copy; 2025 Equipment Rental | All rights reserved.</p>
//          </footer>
//     </div>
//   )
// }

// export default MyFooter

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const MyFooter = () => {
  return (
    <footer className="bg-dark text-light py-3 mt-auto">
      <Container>
        <Row className="align-items-center text-center">
          <Col md={4} className="mb-3 mb-md-0">
            <p className="mb-0">&copy; 2025 Equipment Rental. All rights reserved.</p>
          </Col>
          <Col md={4}>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="text-light fs-4"><FaFacebook /></a>
              <a href="#" className="text-light fs-4"><FaTwitter /></a>
              <a href="#" className="text-light fs-4"><FaInstagram /></a>
            </div>
          </Col>
          <Col md={4}>
            <p className="mb-0">Made with ❤️ by RentPro Team</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MyFooter;
