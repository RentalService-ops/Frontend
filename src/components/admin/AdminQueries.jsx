import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Badge, 
  Button, 
  Form, 
  InputGroup, 
  Spinner, 
  Alert 
} from "react-bootstrap";
import { CheckCircle, Clock } from "lucide-react";
import Pagination from "../../layout/Pagination";

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [resolvingQuery, setResolvingQuery] = useState(null);
  const [cookie] = useCookies();
  const [error, setError] = useState(null);
  
  // states for summary
  const [totalQueries, setTotalQueries] = useState(0);
  const [resolvedQueries, setResolvedQueries] = useState(0);
  const [pendingQueries, setPendingQueries] = useState(0);
  
  // Pagination
  const productsPerPage = 5;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchQueries();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/queries/unresolved?page=${page - 1}&size=${productsPerPage}&sortBy=query_id&direction=asc&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${cookie.jwtToken}`
          }
        }
      );

      setQueries(response.data);
      setTotalPages(response.data.totalPages || 1);
      
      const total = response.data;
      setTotalQueries(total.length);
      setResolvedQueries(total.filter((u) => u.queryStatus === "resolved").length);
      setPendingQueries(total.filter((u) => u.queryStatus === "pending").length);
    } catch (error) {
      setError(error.message || "Failed to fetch queries");
    }
    setLoading(false);
  };

  const handleMarkResolved = async (queryId) => {
    const confirmResolve = window.confirm("Are you sure you want to mark this query as resolved?");
    if (!confirmResolve) return;

    setResolvingQuery(queryId);
    try {
      await axios.put(
        `http://localhost:8080/api/admin/queries/${queryId}/resolve`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${cookie.jwtToken}`
          }
        }
      );

      alert("Query marked as resolved!");
      fetchQueries();
    } catch (error) {
      setError(error.message || "Failed to update status");
      alert("Failed to mark the query as resolved. Please try again.");
    }
    setResolvingQuery(null);
  };

  const handleMarkNotResolved = async (queryId) => {
    const confirmReopen = window.confirm("Are you sure you want to mark this query as Not Resolved?");
    if (!confirmReopen) return;

    setResolvingQuery(queryId);
    try {
      await axios.put(
        `http://localhost:8080/api/admin/queries/${queryId}/notresolved`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${cookie.jwtToken}`
          }
        }
      );

      alert("Query status changed to Not Resolved!");
      fetchQueries();
    } catch (error) {
      setError(error.message || "Failed to update status");
      alert("Failed to update the query status. Please try again.");
    }
    setResolvingQuery(null);
  };

  // Status badge style helper
  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'resolved':
        return <Badge bg="success">Resolved</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      default:
        return <Badge bg="danger">Not Resolved</Badge>;
    }
  };

  return (
    <Container fluid>
      {/* Heading similar to AdminUsers */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Query Management</h2>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-primary h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Total Queries</h6>
                <h3 className="mb-0">{totalQueries}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <CheckCircle size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-success h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Resolved</h6>
                <h3 className="mb-0 text-success">{resolvedQueries}</h3>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded">
                <CheckCircle size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-warning h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Pending</h6>
                <h3 className="mb-0 text-warning">{pendingQueries}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded">
                <Clock size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

{/* <div>
  in my react springboot project of online rental service system in which i am working on admin module i want a count of pending query on my adminsidebar against the query
</div> */}
      {/* Query Table Container */}
      <Card className="shadow-sm">
        <Card.Body>
          {/* Search Bar similar to AdminDataTable */}
          <div className="mb-4 border border-primary border-1">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Search queries..."
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

          {/* Loading Spinner */}
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading query data...</p>
            </div>
          ) : (
            /* Query Table */
            <div className="table-responsive">
              <Table hover striped bordered>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Query</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {queries.length > 0 ? (
                    queries.map((query) => (
                      <tr key={query.id}>
                        <td>{query.id}</td>
                        <td>{query.username}</td>
                        <td>{query.useremail}</td>
                        <td>{query.query}</td>
                        <td>{getStatusBadge(query.queryStatus)}</td>
                        <td>
                          {query.queryStatus.toLowerCase() === "pending" ? (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleMarkResolved(query.id)}
                              disabled={resolvingQuery === query.id}
                            >
                              {resolvingQuery === query.id ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                  <span className="ms-1">Processing...</span>
                                </>
                              ) : (
                                "Mark as Resolved"
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleMarkNotResolved(query.id)}
                              disabled={resolvingQuery === query.id}
                            >
                              {resolvingQuery === query.id ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                  />
                                  <span className="ms-1">Processing...</span>
                                </>
                              ) : (
                                "Mark as Pending"
                              )}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-3">
                        No queries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Custom Pagination Component */}
          {!loading && queries.length > 0 && (
            <Pagination 
              data={queries}
              currentPage={page}
              setCurrentPage={setPage}
              productsPerPage={productsPerPage}
              totalPages={totalPages}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminQueries;