import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Card, Button } from "react-bootstrap";
import ProductModal from "./ProductModal";

const HomePage = ({ isSidebarOpen }) => {
  const [cookies] = useCookies(["jwtToken"]);
  const [products, setProducts] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/equipment/getAllEquipments", {
          headers: { Authorization: `Bearer ${cookies.jwtToken}` },
        });
        setProducts(response.data);
        fetchImages(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [cookies.jwtToken]);

  // Fetch Images Function
  const fetchImages = async (data) => {
    const imageMap = {};
    await Promise.all(
      data.map(async (item) => {
        try {
          const imageResponse = await axios.get(`http://localhost:8080/api/equipment/${item.imageUrl}`, {
            headers: { Authorization: `Bearer ${cookies.jwtToken}` },
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
  };

  const handleProductClick = (product) => {
    setSelectedProduct({ ...product, image: imageUrls[product.imageUrl] || "/defaultImage.png" });
    // setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "0px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      <div className="container-fluid flex-grow-1">
        <h2 className="text-center mb-4">Rental Products</h2>

        {/* Product Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {currentProducts.map((product) => (
            <div className="col" key={product.equipmentId}>
              <Card className="shadow border-0 h-100" onClick={() => handleProductClick(product)}>
                <Card.Img
                  variant="top"
                  src={imageUrls[product.imageUrl] || "/defaultImage.png"}
                  alt="Equipment"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button variant="primary">Rent Now</Button>
                    <small className="text-muted">₹{product.pricePerDay}/day</small>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Category: {product.category}</small>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous
                </button>
              </li>

              {[...Array(totalPages)].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} show={showModal} onClose={handleCloseModal} />
      )}

     
    </div>
  );
};

export default HomePage;
