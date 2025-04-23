import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Spinner, 
  Alert,
  Form,
  InputGroup 
} from "react-bootstrap";
import { List } from "lucide-react";
import Pagination from "../../layout/Pagination";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const productsPerPage = 5;
  
  const getToken = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("jwtToken="))
      ?.split("=")[1];
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("JWT Token not found");
      }

      const response = await axios.get(
        `http://localhost:8080/api/admin/categories?page=${currentPage - 1}&size=${productsPerPage}&search=${search}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setCategories(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, search]);

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Category Management</h2>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-primary h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Total Categories</h6>
                <h3 className="mb-0">{categories.length}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <List size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <div className="mb-4 border border-primary border-1">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading categories...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="table-responsive">
              <Table hover striped bordered>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.categoryId}>
                      <td>{category.categoryId}</td>
                      <td>{category.name}</td>
                      <td>
                        {category.description? category.description : "No description available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Pagination 
                data={categories}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                productsPerPage={productsPerPage}
                totalPages={totalPages}
              />
            </div>
          ) : (
            <Alert variant="info">
              No categories found. Please add categories to view them here.
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminCategory;