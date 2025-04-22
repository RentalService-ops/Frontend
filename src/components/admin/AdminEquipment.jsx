import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {
  Container,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert
} from "react-bootstrap";
import { Trash } from "lucide-react";
import Pagination from "../../layout/Pagination";

const AdminEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cookie] = useCookies();
  const productsPerPage = 5;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEquipment();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/equipment?page=${page - 1}&size=${productsPerPage}&search=${search}`, // Adjusted for 1-based indexing
        {
          headers: {
            Authorization: `Bearer ${cookie.jwtToken}`,
          },
        }
      );
      console.log(response.data.content)
      setEquipment(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error.message || "Failed to fetch equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await axios.delete(`http://localhost:8080/api/equipment/deleteEquipment/${id}`, {
          headers: {
            Authorization: `Bearer ${cookie.jwtToken}`,
          },
        });
        fetchEquipment();
      } catch (error) {
        setError(error.message || "Failed to delete equipment");
      }
    }
  };

  return (
    <Container fluid>
      {/* Heading similar to AdminUsers */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Equipment Management</h2>
      </div>

      {/* Search Bar and Table Container */}
      <Card className="shadow-sm">
        <Card.Body>
          {/* Search Bar similar to AdminDataTable */}
          <div className="mb-4 border border-primary border-1">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search equipment by name, category or owner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {/* Equipment Table */}
          <div className="table-responsive">
            <Table hover striped bordered>
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Equipment Name</th>
                  <th>Owner Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price Per Day</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                      <p className="mt-2">Loading equipment data...</p>
                    </td>
                  </tr>
                ) : equipment.length > 0 ? (
                  equipment.map((item) => (
                    <tr key={item.equipmentId}>
                      <td>{item.equipmentId}</td>
                      <td>{item.categoryName || "N/A"}</td>
                      <td>{item.name}</td>
                      <td>{item.userName || "N/A"}</td>
                      <td>
                        {item.description.length > 50
                          ? `${item.description.substring(0, 50)}...`
                          : item.description}
                      </td>
                      <td>{item.quantity}</td>
                      <td>₹{item.pricePerDay?.toFixed(2)}</td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(item.equipmentId)}
                        >
                          <Trash size={16} className="me-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-3">
                      No equipment found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Custom Pagination Component */}
          <Pagination
            data={equipment}
            currentPage={page}
            setCurrentPage={setPage}
            productsPerPage={productsPerPage}
            totalPages={totalPages}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminEquipment;