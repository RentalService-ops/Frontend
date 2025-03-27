import { Container, Row, Col, Card, Button, Modal, Form, Pagination } from "react-bootstrap";
import { useCookies } from "react-cookie";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Footer from "../layout/Footer";


export default function UserDashboard(){

    const [cookie] = useCookies(["jwtToken"]);
    const [equipmentData, setEquipmentData] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
  
    // Rental State
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [totalDays, setTotalDays] = useState(1);
    const [totalCost, setTotalCost] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");
  
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    useEffect(() => {
        async function fetchEquipmentData() {
          try {
            const response = await axios.get(`http://localhost:8080/api/equipment/getAllEquipments`, {
              headers: { Authorization: `Bearer ${cookie.jwtToken}` },
              withCredentials: true,
            });
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
                const imageResponse = await axios.get(`http://localhost:8080/api/equipment/${item.imageUrl}`, {
                  headers: { Authorization: `Bearer ${cookie.jwtToken}` },
                  responseType: "blob",
                  withCredentials: true,
                });
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
    
      const fetchUserAddresses = async () => {
        try {
          const userId = jwtDecode(cookie.jwtToken).user_id;
          const response = await axios.get(`http://localhost:8080/api/address/getAddressesByUser/${userId}`, {
            headers: { Authorization: `Bearer ${cookie.jwtToken}` },
            withCredentials: true,
          });
          setAddresses(response.data);
          if (response.data.length > 0) setSelectedAddress(response.data[0].id);
        } catch (error) {
          console.error("Error fetching addresses:", error);
        }
      };
    
      const handleShowDetails = (item) => {
        setSelectedProduct(item);
        setStartDate("");
        setEndDate("");
        setQuantity(1);
        setTotalDays(1);
        setTotalCost(item.pricePerDay);
        setShowModal(true);
        fetchUserAddresses();
      };
    
      useEffect(() => {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const days = Math.max((end - start) / (1000 * 60 * 60 * 24), 1);
          setTotalDays(days);
          setTotalCost(days * (selectedProduct ? selectedProduct.pricePerDay : 0) * quantity);
        }
      }, [startDate, endDate, quantity, selectedProduct]);
    
      const handleRentNow = async () => {
        if (!startDate || !endDate || !selectedAddress) {
          alert("Please select start date, end date, and address.");
          return;
        }
    
        try {
          const userId = jwtDecode(cookie.jwtToken).user_id;
          const bookingData = {
            user: { id: userId },
            equipment: { equipmentId: selectedProduct.equipmentId },
            address: { id: selectedAddress },
            startDate,
            endDate,
            totalPrice: totalCost,
            equipment_quantity: quantity,
            status: "PENDING",
          };
    
          await axios.post("http://localhost:8080/api/bookings/equipmentBooking", bookingData, {
            headers: { Authorization: `Bearer ${cookie.jwtToken}` },
            withCredentials: true,
          });
    
          alert("Booking successful!");
          setShowModal(false);
        } catch (error) {
          console.error("Error booking equipment:", error);
          alert("Failed to book equipment. Please try again.");
        }
      };
    
      // Pagination logic
      const totalPages = Math.ceil(equipmentData.length / itemsPerPage);
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = equipmentData.slice(indexOfFirstItem, indexOfLastItem);
    

    return(
        <>
        <Container className="py-5">
        <h2 className="text-center fw-bold text-dark mb-4">Available Equipment</h2>
        <Row className="d-flex flex-row justify-content-evenly flex-wrap">
          {currentItems.map((item) => (
            <Col style={{width:"400px"}}>
            <Card className="shadow-lg border-0 h-100 w-100" onClick={() => handleShowDetails(item)} key={item.equipmentId}>
              <Card.Img
                variant="top"
                src={imageUrls[item.imageUrl] || "/defaultImage.png"}
                alt="Equipment"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title>{item.name}</Card.Title>
                  <Card.Text className="fw-bold">₹{item.pricePerDay} / Day</Card.Text>
                </div>
                <Button variant="primary" className="mt-auto">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
          
          ))}
        </Row>

        {/* Pagination Controls */}
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setCurrentPage(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
        </Pagination>
      </Container>

      {/* Product Modal */}
      {selectedProduct && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              {/* Left Side - Image */}
              <Col md={5} className="d-flex align-items-center">
                <img
                  src={imageUrls[selectedProduct.imageUrl] || "/defaultImage.png"}
                  alt="Equipment"
                  className="img-fluid"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              </Col>

              {/* Right Side - Booking Details */}
              <Col md={7}>
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Select Address</Form.Label>
                  <Form.Select value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                    {addresses.map((address) => (
                      <option key={address.id} value={address.id}>{address.street}, {address.city}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <p><strong>Total Days:</strong> {totalDays}</p>
                <p><strong>Total Cost:</strong> ₹{totalCost}</p>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleRentNow}>Rent Now</Button>
          </Modal.Footer>
        </Modal>
      )}
      
        </>
    )
}