import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Container, Card, Button, Form } from "react-bootstrap";
// import MyNavbar from "../layout/MyNavbar";
// import MyFooter from "../layout/MyFooter";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [cookie] = useCookies(["jwtToken"]);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/user/getEquipmnetById/${id}`,
          { headers: { Authorization: `Bearer ${cookie.jwtToken}` }, withCredentials: true }
        );
        setProduct(response.data);

        // Fetch image
        const imageResponse = await axios.get(
          `http://localhost:8080/api/user/${response.data.imageUrl}`,
          { headers: { Authorization: `Bearer ${cookie.jwtToken}` }, responseType: "blob", withCredentials: true }
        );
        setImageUrl(URL.createObjectURL(imageResponse.data));
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    }

    fetchProductDetails();
  }, [id, cookie.jwtToken]);

  const handleRentNow = () => {
    alert(`You rented ${quantity} of ${product.name}`);
  };

  if (!product) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* <MyNavbar /> */}
      <Container className="py-5">
        <Card className="shadow-lg border-0 mx-auto" style={{ maxWidth: "600px" }}>
          <Card.Img
            variant="top"
            src={imageUrl || "/loadingImage.png"}
            alt={product.name}
            className="object-fit-cover"
            style={{ height: "300px", objectFit: "cover" }}
          />
          <Card.Body>
            <h2 className="fw-bold text-dark">{product.name}</h2>
            <p className="text-muted">{product.description}</p>
            <p>
              <strong>Price Per Day:</strong> ₹{product.pricePerDay}
            </p>
            <p>
              <strong>Available Quantity:</strong> {product.quantity}
            </p>

            <Form.Group className="mb-3">
              <Form.Label>Select Quantity</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" className="w-100" onClick={handleRentNow}>
              Rent Now
            </Button>
          </Card.Body>
        </Card>
        <div className="text-center mt-3">
          <Link to="/home" className="btn btn-outline-secondary">Back to Home</Link>
        </div>
      </Container>
      {/* <MyFooter /> */}
    </div>
  );
}
