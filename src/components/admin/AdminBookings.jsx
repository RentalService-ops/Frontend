import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { 
  Container, 
  Card, 
  Table, 
  Badge, 
  Form, 
  InputGroup, 
  Spinner, 
  Alert 
} from "react-bootstrap";
import Pagination from "../../layout/Pagination"; 

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [cookie] = useCookies();

  const productsPerPage = 5;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBookings();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/bookings?page=${page - 1}&size=${productsPerPage}&search=${search}`, // Adjusted for 1-based indexing
        {
          headers: { Authorization: `Bearer ${cookie.jwtToken}` },
        }
      );
      setBookings(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings", error);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch(status) {
      case "APPROVED":
        return <Badge bg="success">APPROVED</Badge>;
      case "PENDING":
        return <Badge bg="warning" text="dark">PENDING</Badge>;
      case "REJECTED":
        return <Badge bg="danger">REJECTED</Badge>;
      case "CANCELLED":
        return <Badge bg="secondary">CANCELLED</Badge>;
      default:
        return <Badge bg="info">{status}</Badge>;
    }
  };

  return (
    <Container fluid>
      {/* Heading similar to AdminUsers */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Booking Management</h2>
      </div>

      {/* Search Bar and Table Container */}
      <Card className="shadow-sm">
        <Card.Body>
          {/* Search Bar similar to AdminDataTable */}
          <div className="mb-4 border border-primary border-1">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search bookings..."
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

          {/* Bookings Table */}
          <div className="table-responsive">
            <Table hover striped bordered>
              <thead className="table-dark">
                <tr>
                  <th>Booking ID</th>
                  <th>Quantity</th>
                  <th>Owner</th>
                  <th>Customer</th>
                  <th>Equipment Name</th>
                  <th>Owner&apos;s Total Bookings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                      <p className="mt-2">Loading booking data...</p>
                    </td>
                  </tr>
                ) : bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr key={booking.bookingId}>
                      <td>{booking.bookingId}</td>
                      <td>{booking.equipmentQuantity}</td>
                      <td>{booking.renterName}</td>
                      <td>{booking.userName}</td>
                      <td>{booking.equipmentName}</td>
                      <td>{booking.totalBookingsByRenter}</td>
                      <td className="text-center">{getStatusBadge(booking.status)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-3">
                      No bookings found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Custom Pagination Component */}
          <Pagination 
            data={bookings}
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

export default AdminBookings;