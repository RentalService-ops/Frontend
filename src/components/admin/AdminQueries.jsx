import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import {Container,Row,Col,Card,Table,Badge,Button,Form,InputGroup,Spinner,Alert} from "react-bootstrap";
import { CheckCircle } from "lucide-react";
import Pagination from "../../layout/Pagination";
import _ from 'lodash';

const AdminQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [resolvingQuery, setResolvingQuery] = useState(null);
  const [cookie] = useCookies();
  const [error, setError] = useState(null);

  const [totalQueries, setTotalQueries] = useState(0);

  // Pagination
  const productsPerPage = 5;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchQueries();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [queries]);

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/queries/pending`,
        {
          headers: {
            Authorization: `Bearer ${cookie.jwtToken}`
          }
        }
      );
      if(!_.isEqual(response.data,queries)){
      setQueries(response.data);
      const total = response.data;
      setTotalQueries(total.length);
      }
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



  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <Badge bg="success">Resolved</Badge>;
      case 'pending':
        return <Badge bg="warning" text="dark">Pending</Badge>;
      default:
        return <Badge bg="danger">Not Resolved</Badge>;
    }
  };

  const indexOfLastQuery = page * productsPerPage;
  const indexOfFirstQuery = indexOfLastQuery - productsPerPage;
  const currentQueries = queries.slice(
    indexOfFirstQuery,
    indexOfLastQuery
  );

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Query Management</h2>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-primary h-100 shadow-sm">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Total Pending Queries</h6>
                <h3 className="mb-0">{totalQueries}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded">
                <CheckCircle size={24} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>

          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading query data...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover striped bordered>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Query</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQueries.length > 0 ? (
                    currentQueries.map((query,index) => (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{query.username}</td>
                        <td>{query.useremail}</td>
                        <td>{query.query}</td>
                        <td>{getStatusBadge(query.queryStatus)}</td>
                        <td>
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

          {!loading && queries.length > 0 && (
            <Pagination
              data={queries}
              currentPage={page}
              setCurrentPage={setPage}
              productsPerPage={productsPerPage}
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminQueries;