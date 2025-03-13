import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import MyFooter from "../layout/MyFooter";
import MyNavbar from "../layout/MyNavbar";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

export default function HomePage() {
  const [cookie] = useCookies(["jwtToken"]);
  const [equipmentData, setEquipmentData] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // ✅ Default 6 items per page

  useEffect(() => {
    async function fetchEquipmentData() {
      try {
        const userId = jwtDecode(cookie.jwtToken).user_id;
        const response = await axios.get(
          `http://localhost:8080/api/user/getAllEquipment`,
          { headers: { Authorization: `Bearer ${cookie.jwtToken}` }, withCredentials: true }
        );
        setEquipmentData(response.data);
        fetchImages(response.data);
      } catch (err) {
        console.error("Error fetching equipment:", err);
      }
    }

    async function fetchImages(data) {
      const imageMap = {};
      await Promise.all(
        data.map(async (item) => {
          try {
            const imageResponse = await axios.get(
              `http://localhost:8080/api/user/${item.imageUrl}`,
              { headers: { Authorization: `Bearer ${cookie.jwtToken}` }, responseType: "blob", withCredentials: true }
            );
            imageMap[item.imageUrl] = URL.createObjectURL(imageResponse.data);
          } catch {
            imageMap[item.imageUrl] = "/defaultImage.png";
          }
        })
      );
      setImageUrls(imageMap);
    }

    fetchEquipmentData();
  }, [cookie.jwtToken]);

  // ** Pagination Logic **
  const totalPages = Math.ceil(equipmentData.length / itemsPerPage);
  const paginatedData = equipmentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleShowDetails = (item) => {
    setSelectedProduct(item);
    setQuantity(1);
    setShowModal(true);
  };

  const handleRentNow = () => {
    alert(`You rented ${quantity} of ${selectedProduct.name}`);
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navbar */}
      <MyNavbar />

      {/* Hero Section */}
      <section className="text-center py-5 bg-primary text-white">
        <h1 className="fw-bold">Rent Equipment with Ease</h1>
        <p className="lead">Find, rent, and manage equipment for any project in just a few clicks.</p>
        <Button variant="light" className="fw-bold mt-3">Get Started</Button>
      </section>

      {/* Equipment Section */}
      <Container className="py-5">
        <h2 className="text-center fw-bold text-dark mb-4">Available Equipment</h2>
        {paginatedData.length > 0 ? (
          <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3">
            {paginatedData.map((item) => (
              <Col key={item.equipmentId}>
                <Card
                  className="shadow-sm border-0 h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleShowDetails(item)}
                >
                  <Card.Img
                    variant="top"
                    src={imageUrls[item.imageUrl] || "/loadingImage.png"}
                    alt="Equipment"
                    className="object-fit-cover"
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => (e.target.src = "/defaultImage.png")}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold text-dark">{item.name}</Card.Title>
                    <Card.Text className="text-muted">
                      <span className="fw-semibold">Price Per Day:</span> ₹{item.pricePerDay} <br />
                      <span className="fw-semibold">Quantity:</span> {item.quantity}
                    </Card.Text>
                    <Button variant="primary" className="mt-auto">View Details</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center text-muted fs-5 mt-4">No equipment available</p>
        )}

        {/* Pagination Controls */}
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="outline-primary"
            className="me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="align-self-center mx-3">Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </Container>

      {/* Product Details Modal */}
      {selectedProduct && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={imageUrls[selectedProduct.imageUrl] || "/loadingImage.png"}
              alt={selectedProduct.name}
              className="img-fluid rounded mb-3"
              style={{ height: "150px", objectFit: "cover", width: "50%" }}
            />
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Price Per Day:</strong> ₹{selectedProduct.pricePerDay}</p>
            <p><strong>Available Quantity:</strong> {selectedProduct.quantity}</p>

            {/* Quantity Selector */}
            <Form.Group className="mb-3">
              <Form.Label>Enter Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={selectedProduct.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleRentNow}>Rent Now</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Footer */}
      <MyFooter />
    </div>
  );
}
