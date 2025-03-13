// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { jwtDecode } from "jwt-decode";
// import MyNavbar from "../layout/MyNavbar";
// import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

// export default function ProfilePage() {
//   const [cookies] = useCookies(["jwtToken"]);
//   const [user, setUser] = useState(null);
//   const [show, setShow] = useState(false);
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (cookies.jwtToken) {
//       try {
//         const userId = jwtDecode(cookies.jwtToken).user_id;
//         fetchUserDetails(userId);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     } else {
//       console.error("JWT Token not found in cookies.");
//     }
//   }, [cookies.jwtToken]);

//   const fetchUserDetails = async (id) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/api/user/userDetail/${id}`,
//         {
//           headers: { Authorization: `Bearer ${cookies.jwtToken}` },
//           withCredentials: true,
//         }
//       );
//       setUser(response.data);
//       setFormData(response.data);
//     } catch (error) {
//       console.error("Error fetching user details", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSaveChanges = async () => {
//     try {
//       await axios.put(
//         `http://localhost:8080/api/user/userDetail/${user.id}`,
//         formData,
//         {
//           headers: { Authorization: `Bearer ${cookies.jwtToken}` },
//           withCredentials: true,
//         }
//       );
//       setUser(formData);
//       setShow(false);
//     } catch (error) {
//       console.error("Error updating user details", error);
//     }
//   };

//   return (
//     <div className="min-vh-100 d-flex flex-column bg-light">
//       {/* Fixed Navbar */}
//       <MyNavbar className="bg-dark text-white fixed-top" />

//       {/* Content */}
//       <Container className="py-5 mt-5">
//         {user && (
//           <Row>
//             <Col lg="4">
//               <Card className="mb-4 text-center shadow">
//                 <Card.Body>
//                   <Card.Img
//                     src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
//                     alt="User Avatar"
//                     className="rounded-circle"
//                     style={{ width: "150px" }}
//                   />
//                   <p className="text-muted mb-1 fw-bold">{user.username}</p>
//                   <p className="text-muted mb-4">{user.role}</p>
//                   {/* ✅ Fix: Prevent button from expanding */}
//                   <div className="text-center">
//                     <Button variant="primary" style={{ width: "auto" }} onClick={() => setShow(true)}>
//                       Edit Profile
//                     </Button>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>

//             <Col lg="8">
//               <Card className="mb-4 shadow">
//                 <Card.Body>
//                   <Row>
//                     <Col sm="3">
//                       <Card.Text className="fw-bold">Email</Card.Text>
//                     </Col>
//                     <Col sm="9">
//                       <Card.Text className="text-muted">{user.email}</Card.Text>
//                     </Col>
//                   </Row>
//                   <hr />
//                   <Row>
//                     <Col sm="3">
//                       <Card.Text className="fw-bold">Phone</Card.Text>
//                     </Col>
//                     <Col sm="9">
//                       <Card.Text className="text-muted">{user.phoneNumber}</Card.Text>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         )}

//         {/* Edit Profile Modal */}
//         <Modal show={show} onHide={() => setShow(false)} animation={false}>
//           <Modal.Header closeButton>
//             <Modal.Title>Edit Profile</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-2">
//                 <Form.Label>Username</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="username"
//                   value={formData.username || ""}
//                   onChange={handleInputChange}
//                 />
//               </Form.Group>
//               <Form.Group className="mb-2">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   name="email"
//                   value={formData.email || ""}
//                   onChange={handleInputChange}
//                 />
//               </Form.Group>
//               <Form.Group className="mb-2">
//                 <Form.Label>Phone</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="phoneNumber"
//                   value={formData.phoneNumber || ""}
//                   onChange={handleInputChange}
//                 />
//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShow(false)}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={handleSaveChanges}>
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import MyNavbar from "../layout/MyNavbar";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";

export default function ProfilePage() {
  const [cookies] = useCookies(["jwtToken"]);
  const [user, setUser] = useState(null);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (cookies.jwtToken) {
      try {
        const decodedToken = jwtDecode(cookies.jwtToken);
        setUserId(decodedToken.user_id);
        fetchUserDetails(decodedToken.user_id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("JWT Token not found in cookies.");
    }
  }, [cookies.jwtToken]);

  const fetchUserDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/userDetail/${id}`,
        {
          headers: { Authorization: `Bearer ${cookies.jwtToken}` },
          withCredentials: true,
        }
      );
      setUser(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    if (!userId) {
      console.error("User ID not found!");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/user/updateUser/${userId}`, // ✅ Updated API Endpoint
        formData,
        {
          headers: { Authorization: `Bearer ${cookies.jwtToken}` },
          withCredentials: true,
        }
      );
      setUser(formData);
      setShow(false);
    } catch (error) {
      console.error("Error updating user details", error);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Fixed Navbar */}
      <MyNavbar className="bg-dark text-white fixed-top" />

      {/* Content */}
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
                  <p className="text-muted mb-4">{user.role}</p>
                  {/* ✅ Fix: Prevent button from expanding */}
                  <div className="text-center">
                    <Button variant="primary" style={{ width: "auto" }} onClick={() => setShow(true)}>
                      Edit Profile
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg="8">
              <Card className="mb-4 shadow">
                <Card.Body>
                  <Row>
                    <Col sm="3">
                      <Card.Text className="fw-bold">Email</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{user.email}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text className="fw-bold">Phone</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{user.phoneNumber}</Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Edit Profile Modal */}
        <Modal show={show} onHide={() => setShow(false)} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}
