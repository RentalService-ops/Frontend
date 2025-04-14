import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

export default function ProfilePage() {
  const [cookies] = useCookies(["jwtToken"]);
  const [user, setUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [userId, setUserId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);

  useEffect(() => {
    if (cookies.jwtToken) {
      try {
        const decodedToken = jwtDecode(cookies.jwtToken);
        setUserId(decodedToken.user_id);
        fetchUserDetails(decodedToken.user_id);
        fetchUserAddresses(decodedToken.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("JWT Token not found in cookies.");
    }
  }, [cookies.jwtToken]);

  const fetchUserDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/user/getUser`, {
        headers: { Authorization: `Bearer ${cookies.jwtToken}` },
        params:{id:`${id}`},
        withCredentials: true,
      });
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  const fetchUserAddresses = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/address/getAddressesByUser/${id}`, {
        headers: { Authorization: `Bearer ${cookies.jwtToken}` },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching user addresses", error);
    }
  };

  const handleUpdateProfile = async () => {
    console.log(formData);
    
    try {
      await axios.put(`http://localhost:8080/api/user/updateUser`, formData, {
        headers: { Authorization: `Bearer ${cookies.jwtToken}` },
        params:{
            id:`${userId}`
        }
      });
      setShowProfileModal(false);
      fetchUserDetails(userId);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };
  

  const handleAddOrEditAddress = async () => {
    try {
      if (editingAddressId) {
        await axios.put(`http://localhost:8080/api/address/updateAddress/${editingAddressId}`, addressData, {
          headers: { Authorization: `Bearer ${cookies.jwtToken}` },
        });
      } else {
        await axios.post(`http://localhost:8080/api/address/addAddress?userId=${userId}`, addressData, {
          headers: { Authorization: `Bearer ${cookies.jwtToken}` },
        });
      }
      setShowAddressModal(false);
      setAddressData({ street: "", city: "", state: "", zipCode: "", country: "" });
      fetchUserAddresses(userId);
    } catch (error) {
      console.error("Error saving address", error);
    }
  };

  const handleDeleteAddress = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/address/deleteAddress/${deletingAddressId}`, {
        headers: { Authorization: `Bearer ${cookies.jwtToken}` },
      });
      setShowDeleteModal(false);
      fetchUserAddresses(userId);
    } catch (error) {
      console.error("Error deleting address", error);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Container className="py-5 mt-5">
        {user && (
          <Row>

<Col lg="4">
  <Card className="mb-4 text-center shadow">
    <Card.Body>
      <Card.Img
        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
        alt="User Avatar"
        className="rounded-circle"
        style={{ width: "150px" }}
      />
      <p className="text-muted mb-1 fw-bold">{user.username}</p>
      <p className="text-muted mb-1">{user.email}</p> {/* Moved email here */}
      <p className="text-muted mb-3">{user.phoneNo}</p> {/* Moved phone number here */}
      <Button variant="primary" onClick={() => setShowProfileModal(true)}>
        Edit Profile
      </Button>
    </Card.Body>
  </Card>
</Col>

            <Col lg="8">
              <Card className="shadow">
                <Card.Body>
                  <h5 className="fw-bold d-flex justify-content-between">
                    Address Details
                    <Button 
                      variant="success" 
                      onClick={() => {
                        setEditingAddressId(null);
                        setAddressData({ street: "", city: "", state: "", zipCode: "", country: "" });
                        setShowAddressModal(true);
                      }}
                    >
                      Add Address
                    </Button>
                  </h5>
                  {addresses.length > 0 ? (
                    addresses.map((address) => (
                      <div key={address.id} className="mb-3 d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-1">{address.street}, {address.city}</p>
                          <p className="text-muted">{address.country}, {address.zipCode}</p>
                        </div>
                        <div>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setEditingAddressId(address.id);
                              setAddressData({ ...address });
                              setShowAddressModal(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setDeletingAddressId(address.id);
                              setShowDeleteModal(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No addresses found.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Add/Edit Address Modal */}
        <Modal show={showAddressModal} onHide={() => {
          setShowAddressModal(false);
          setEditingAddressId(null);
          setAddressData({ street: "", city: "", state: "", zipCode: "", country: "" });
        }} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editingAddressId ? "Edit Address" : "Add Address"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {Object.keys(addressData).filter((field) => field !== "id").map((field) => (
                <Form.Group key={field} className="mb-2">
                  <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={addressData[field]} 
                    onChange={(e) => setAddressData({ ...addressData, [field]: e.target.value })} 
                  />
                </Form.Group>
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowAddressModal(false);
              setEditingAddressId(null);
              setAddressData({ street: "", city: "", state: "", zipCode: "", country: "" });
            }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddOrEditAddress}>
              {editingAddressId ? "Update Address" : "Save Address"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Profile Modal */}
<Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Edit Profile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group className="mb-2">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={formData.username || ""}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          value={formData.phoneNo || ""}
          onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleUpdateProfile}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>


        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this address?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDeleteAddress}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );

}





