// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { jwtDecode } from "jwt-decode";
// import MyNavbar from "../layout/MyNavbar";
// import MyFooter from "../layout/MyFooter";
// import { Card, Button, Container, Row, Col } from "react-bootstrap";

// export default function Index() {
//   const [cookie] = useCookies(["jwtToken"]);
//   const [equipmentData, setEquipmentData] = useState([]);
//   const [imageUrls, setImageUrls] = useState({});

//   useEffect(() => {
//     async function fetchEquipmentData() {
//       try {
//         const userId = jwtDecode(cookie.jwtToken).user_id;
//         const response = await axios.get(
//           `http://localhost:8080/api/equipment/getEquipment/${userId}`,
//           { headers: { Authorization: `Bearer ${cookie.jwtToken}` }, withCredentials: true }
//         );
//         setEquipmentData(response.data);
//         fetchImages(response.data);
//       } catch (err) {
//         console.error("Error fetching equipment:", err);
//       }
//     }

//     async function fetchImages(data) {
//       const imageMap = {};
//       await Promise.all(
//         data.map(async (item) => {
//           try {
//             const imageResponse = await axios.get(
//               `http://localhost:8080/api/equipment/${item.imageUrl}`,
//               { headers: { Authorization: `Bearer ${cookie.jwtToken}` }, responseType: "blob", withCredentials: true }
//             );
//             imageMap[item.imageUrl] = URL.createObjectURL(imageResponse.data);
//           } catch {
//             imageMap[item.imageUrl] = "/defaultImage.png";
//           }
//         })
//       );
//       setImageUrls(imageMap);
//     }

//     fetchEquipmentData();
//   }, [cookie.jwtToken]);

//   return (
//     <div className="min-h-screen flex flex-col bg-light">
//       {/* Navbar */}
//       <MyNavbar />

//       {/* Hero Section */}
//       <section className="text-center py-5 bg-light border-bottom">
//         <h1 className="text-primary fw-bold">Rent High-Quality Equipment</h1>
//         <p className="text-muted">Find the right equipment for your project.</p>
//       </section>

//       {/* Equipment Section */}
//       <Container className="py-5">
//         <h2 className="text-center text-dark mb-4">Available Equipment</h2>

//         {equipmentData.length > 0 ? (
//           <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-lg-3">
//             {equipmentData.map((item) => (
//               <Col key={item.equipmentId}>
//                 <Card className="shadow-sm border-0 h-100">
//                   {/* Equipment Image */}
//                   <Card.Img
//                     variant="top"
//                     src={imageUrls[item.imageUrl] || "/loadingImage.png"}
//                     alt="Equipment"
//                     className="object-fit-cover"
//                     style={{ height: "180px" }}
//                     onError={(e) => (e.target.src = "/defaultImage.png")}
//                   />
                  
//                   {/* Equipment Details */}
//                   <Card.Body className="d-flex flex-column">
//                     <Card.Title className="fw-bold text-dark">{item.name}</Card.Title>
//                     <Card.Text className="text-muted">
//                       <span className="fw-semibold">Price Per Day:</span> ${item.pricePerDay} <br />
//                       <span className="fw-semibold">Quantity:</span> {item.quantity} <br />
//                       <span className="fw-semibold">Description:</span> {item.description}
//                     </Card.Text>

//                     {/* Rent Button */}
//                     <Button variant="primary" className="mt-auto">Rent Now</Button>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         ) : (
//           <p className="text-center text-muted fs-5 mt-4">No equipment available</p>
//         )}
//       </Container>

//       {/* Footer */}
//       <MyFooter />
//     </div>
//   );
// }

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import MyNavbar from "../layout/MyNavbar";
import MyFooter from "../layout/MyFooter";

export default function Index() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      {/* Navbar */}
      <MyNavbar />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column justify-content-center text-center">
        {/* Hero Section */}
        <Container className="py-5">
          <h1 className="display-4 fw-bold">Welcome to Equipment Rental</h1>
          <p className="lead">
            Rent high-quality equipment for your needs, from tools to gadgets, at the best prices.
          </p>
          <Button variant="primary" className="mt-3">Explore Now</Button>
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

      {/* Footer */}
      <MyFooter />
    </div>
  );
}
