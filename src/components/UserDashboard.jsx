import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Card, Button } from "react-bootstrap";
import ProductModal from "./ProductModal";
import Pagination from "../layout/Pagination";

const UserDashboard = ({ isSidebarOpen }) => {
  const [cookies] = useCookies(["jwtToken"]);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [imageUrls, setImageUrls] = useState({});

  const [showModal, setShowModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/category/getAllCategory", {
          headers: { Authorization: `Bearer ${cookies.jwtToken}` },
        });
        setCategories(response.data.body);
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
    setSelectedProduct(null);
  };

  function handleFilter(category) {
    console.log("Selected Category:", category); // Log the selected category
    setSelectedCategory(category);
    const newFilteredProducts =
      category === "All Categories"
        ? products
        : products.filter((product) => product.categoryName.toLowerCase() === category.toLowerCase()); // Case-insensitive matching
    console.log("Filtered Products:", newFilteredProducts); // Log filtered products
    setFilteredProducts(newFilteredProducts);
    setCurrentPage(1); // Reset to first page after applying filter
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const newFilteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        product.description.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredProducts(newFilteredProducts);
    setCurrentPage(1);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div
      className="d-flex flex-column min-vh-100 bg-light"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "0px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      <div className="container-fluid p-4">
        {/* Filters */}
        <div className="d-flex justify-content-between mb-4">
          <div className="w-50 pe-3">
            <h5 className="text-info">Search Products</h5>
            <input
              type="text"
              className="form-control border border-primary shadow-sm"
              placeholder="Search by name or description"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="w-45">
            <h5 className="text-success">Filter by Category</h5>
            <select
              className="form-select border border-success shadow-sm"
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
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
          {currentProducts.map((product) => (
            <div className="col" key={product.equipmentId}>
              <Card className="h-100 shadow-sm product-card">
                <Card.Img
                  variant="top"
                  src={imageUrls[product.imageUrl] || "/defaultImage.png"}
                  alt="Equipment"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>{product.description}</Card.Text>

                  {/* Quantity Display */}
                  {product.quantity > 0 ? (
                    <span className="badge bg-success mb-2">In stock: {product.quantity}</span>
                  ) : (
                    <span className="badge bg-danger mb-2">Not in stock</span>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <Button
                      variant="primary"
                      disabled={product.quantity <= 0}
                      onClick={() => handleProductClick(product)}
                    >
                      Rent Now
                    </Button>
                    <span className="badge bg-warning text-dark">₹{product.pricePerDay}/day</span>
                  </div>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center bg-gradient">
                  <span className="badge bg-light text-dark">
                    {product.categoryName || "Uncategorized"}
                  </span>
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          data={filteredProducts}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
        />
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} show={showModal} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default UserDashboard;
