
import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Card, Button } from "react-bootstrap";
import ProductModal from "./ProductModal";

const UserDashboard = ({ isSidebarOpen }) => {
  const [cookies] = useCookies(["jwtToken"]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [imageUrls, setImageUrls] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category/getAllCategory", {
          headers: { Authorization: `Bearer ${cookies.jwtToken}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [cookies.jwtToken]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/equipment/getAllEquipments", {
          headers: { Authorization: `Bearer ${cookies.jwtToken}` },
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
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
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  function handleFilter(category) {
    setSelectedCategory(category);
    // Filter Products based on selected Category
    const newFilteredProducts =
      category === "All Categories"
        ? products
        : products.filter((product) => product.categoryName === category);
    setFilteredProducts(newFilteredProducts);
    setCurrentPage(1); // Reset to first page when filtering
  }

  // Handle Search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Filter Products based on search query
    const newFilteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        product.description.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(newFilteredProducts);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

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

        {/* Filters Row */}
        <div className="d-flex justify-content-between mb-3">
          {/* Search Bar */}
          <div className="w-50">
            <h4>Search Products:</h4>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or description"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="w-45">
            <h4>Filter by Category:</h4>
            <select
              className="form-select"
              onChange={(e) => handleFilter(e.target.value)}
              value={selectedCategory}
            >
              <option value="All Categories">All Categories</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

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
                  <small className="text-muted">
                    Category: {product.categoryName || "Uncategorized"}
                  </small>
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

export default UserDashboard;
