import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Tab,
  Nav,
  ListGroup,
} from "react-bootstrap";

export default function ProfilePage() {
  const [cookies] = useCookies(["jwtToken"]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const isUserRole =
    cookies.jwtToken && jwtDecode(cookies.jwtToken).role === "user";

  useEffect(() => {
    if (cookies.jwtToken) {
      const decoded = jwtDecode(cookies.jwtToken);
      setUserId(decoded.user_id);
      fetchUserDetails(decoded.user_id);
      if (decoded.role === "user") fetchUserAddresses(decoded.user_id);
    }
  }, [cookies.jwtToken]);

  const fetchUserDetails = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/user/getUser?id=${id}`,
        { headers: { Authorization: `Bearer ${cookies.jwtToken}` } }
      );
      setUser(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchUserAddresses = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/address/getAddressesByUser/${id}`,
        { headers: { Authorization: `Bearer ${cookies.jwtToken}` } }
      );
      setAddresses(res.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/user/updateUser?id=${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${cookies.jwtToken}` } }
      );
      setShowProfileModal(false);
      fetchUserDetails(userId);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleAddOrEditAddress = async () => {
    try {
      if (editingAddressId) {
        await axios.put(
          `http://localhost:8080/api/address/updateAddress/${editingAddressId}`,
          addressData,
          { headers: { Authorization: `Bearer ${cookies.jwtToken}` } }
        );
      } else {
        await axios.post(
          `http://localhost:8080/api/address/addAddress?userId=${userId}`,
          addressData,
          { headers: { Authorization: `Bearer ${cookies.jwtToken}` } }
        );
      }
      fetchUserAddresses(userId);
      setShowAddressModal(false);
      resetAddressForm();
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/address/deleteAddress/${deletingAddressId}`,
        { headers: { Authorization: `Bearer ${cookies.jwtToken}` } }
      );
      fetchUserAddresses(userId);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddressData({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  return (
    <Container style={{ paddingTop: "50px" ,height:"80vh"}}>
      <Card className="shadow p-4">
        <h3 className="text-center mb-4">Personal Details</h3>
        <Tab.Container defaultActiveKey="profile">
          <Row>

            <Col md={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile Info</Nav.Link>
                </Nav.Item>
                {isUserRole && (
                  <Nav.Item>
                    <Nav.Link eventKey="address">My Addresses</Nav.Link>
                  </Nav.Item>
                  )}
              </Nav>
            </Col>

            <Col md={9}>
              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  {user && (
                    <Card className="border-0">
                      <Card.Body>
                        <h5><strong>Name:</strong> {user.username || "None"}</h5><br />
                        <h5><strong>Email:</strong> {user.email || "None"}</h5><br />
                        <h5><strong>Phone:</strong> {user.phoneNo || "None"}</h5><br />
                        <Button onClick={() => setShowProfileModal(true)} variant="primary">
                          Edit Profile
                        </Button>
                      </Card.Body>
                    </Card>
                  )}
                </Tab.Pane>

                <Tab.Pane eventKey="address">
                  <Card className="border-0">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Saved Addresses</h5>
                        <Button
                          variant="success"
                          onClick={() => {
                            resetAddressForm();
                            setShowAddressModal(true);
                          }}
                        >
                          Add New Address
                        </Button>
                      </div>
                      {addresses.length > 0 ? (
                        <ListGroup>
                          {addresses.map((addr) => (
                            <ListGroup.Item key={addr.id} className="d-flex justify-content-between">
                              <div>
                                {addr.street}, {addr.city}, {addr.state} - {addr.zipCode}, {addr.country}
                              </div>
                              <div>
                                <Button
                                  size="sm"
                                  variant="warning"
                                  className="me-2"
                                  onClick={() => {
                                    setEditingAddressId(addr.id);
                                    setAddressData({ ...addr });
                                    setShowAddressModal(true);
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() => {
                                    setDeletingAddressId(addr.id);
                                    setShowDeleteModal(true);
                                  }}
                                >
                                  Delete
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <p className="text-muted">No addresses found.</p>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Card>

      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phoneNo || ""}
                onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateProfile}>Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingAddressId ? "Edit Address" : "Add Address"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.entries(addressData).slice(1).map(([key, value]) => (
              <Form.Group className="mb-3" key={key}>
                <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={value}
                  onChange={(e) => setAddressData({ ...addressData, [key]: e.target.value })}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddressModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddOrEditAddress}>
            {editingAddressId ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this address?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAddress}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
