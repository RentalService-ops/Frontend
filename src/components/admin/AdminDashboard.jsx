import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, ProgressBar, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import axios from "axios";
import { 
  Users, Package, ClipboardList, MessageCircle, 
  TrendingUp, Calendar, ArrowUp, ArrowDown, 
  MoreHorizontal, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: { total: 0, trend: 5.2 },
    equipment: { total: 0, trend: 8.1 },
    bookings: { total: 0, trend: -2.3 },
    queries: { total: 0, trend: 3.7 }
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookie] = useCookies();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      
      const userResponse = await axios.get(
        "http://localhost:8080/api/admin/users?page=0&size=1",
        { headers: { Authorization: `Bearer ${cookie.jwtToken}` } }
      );
      
      const bookingsResponse = await axios.get(
        "http://localhost:8080/api/admin/getAllBookings",
        { headers: { Authorization: `Bearer ${cookie.jwtToken}` } }
      );

      setStats(prev => ({
        ...prev,
        users: { ...prev.users, total: userResponse.data.totalItems || 0 },
        bookings: { ...prev.bookings, total: bookingsResponse.data.totalBookings || 0 }
      }));

      setRecentBookings(bookingsResponse.data.recentbookings || []);
      
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };


  const summaryCards = [
    { 
      title: "Total Users", 
      value: stats.users.total, 
      trend: stats.users.trend, 
      icon: <Users size={24} />, 
      color: "primary",
      link: "/admin/users"
    },
    { 
      title: "Total Equipment", 
      value: stats.equipment.total, 
      trend: stats.equipment.trend, 
      icon: <Package size={24} />, 
      color: "success",
      link: "/admin/equipments"
    },
    { 
      title: "Total Bookings", 
      value: stats.bookings.total, 
      trend: stats.bookings.trend, 
      icon: <ClipboardList size={24} />, 
      color: "warning",
      link: "/admin/bookings"
    },
    { 
      title: "Pending Queries", 
      value: stats.queries.total, 
      trend: stats.queries.trend, 
      icon: <MessageCircle size={24} />, 
      color: "danger",
      link: "/admin/queries"
    }
  ];

  const popularCategories = [
    { name: "Camera Equipment", percentage: 35 },
    { name: "Audio Systems", percentage: 25 },
    { name: "Lighting Equipment", percentage: 20 },
    { name: "Drones", percentage: 15 },
    { name: "Others", percentage: 5 }
  ];

  const recentActivities = [
    { id: 1, action: "New user registered", time: "10 minutes ago", user: "Bhavik Kumar" },
    { id: 2, action: "Equipment added", time: "1 hour ago", user: "Vipul Sahani" },
    { id: 3, action: "Booking approved", time: "2 hours ago", user: "Nehal" },
    { id: 4, action: "Query resolved", time: "3 hours ago", user: "Admin" },
  ];

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Dashboard</h2>
        <div>
          <Button variant="outline-secondary" className="me-2">
            <Calendar size={18} className="me-2" /> Filter by Date
          </Button>
          <Button variant="primary">
            <TrendingUp size={18} className="me-2" /> Generate Report
          </Button>
        </div>
      </div>
      
      <Row className="g-3 mb-4">
        {summaryCards.map((card, index) => (
          <Col key={index} xl={3} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">{card.title}</p>
                    <h3 className="mb-2">{loading ? "-" : card.value}</h3>
                    <div className={`text-${card.trend > 0 ? 'success' : 'danger'} d-flex align-items-center small`}>
                      {card.trend > 0 ? 
                        <ArrowUp size={16} className="me-1" /> : 
                        <ArrowDown size={16} className="me-1" />
                      }
                      <span>{Math.abs(card.trend)}% {card.trend > 0 ? 'increase' : 'decrease'}</span>
                    </div>
                  </div>
                  <div className={`bg-${card.color} bg-opacity-10 p-3 rounded d-flex align-items-center justify-content-center`}>
                    {card.icon}
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-top-0 pt-0">
                <Link to={card.link} className="btn btn-link p-0 text-decoration-none d-flex align-items-center">
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </Link>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row className="g-3">
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0">Recent Bookings</h5>
              <div className="d-flex align-items-center">
                <Link to="/admin/bookings" className="btn btn-link p-0 text-decoration-none">View All</Link>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3">ID</th>
                      <th className="py-3">Equipment</th>
                      <th className="py-3">Customer</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center py-3">
                          <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Loading...
                        </td>
                      </tr>
                    ) : recentBookings.length > 0 ? (
                      recentBookings.map((booking,index) => (
                        <tr key={booking.bookingId}>
                          <td>{index+1}</td>
                          <td>{booking.equipmentName}</td>
                          <td>{booking.userName}</td>
                          <td>
                            <span className={`badge rounded-pill bg-${booking.status === 'APPROVED' ? 'success' 
                              : booking.status === 'PENDING' ? 'warning' 
                              : booking.status=== 'CANCELLED' ? 'danger' 
                            : booking.status === 'COMPLETED' ? 'primary' : 'secondary'}`}>
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-3">No recent bookings</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow-sm border-0 mb-3">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Popular Categories</h5>
            </Card.Header>
            <Card.Body>
              {popularCategories.map((category, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1 small">
                    <span>{category.name}</span>
                    <span>{category.percentage}%</span>
                  </div>
                  <ProgressBar 
                    now={category.percentage} 
                    variant={
                      index === 0 ? "primary" :
                      index === 1 ? "success" :
                      index === 2 ? "warning" :
                      index === 3 ? "danger" : "info"
                    }
                    className="progress-sm"
                    style={{ height: "6px" }}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Recent Activities</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <ul className="list-group list-group-flush">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="list-group-item px-3 py-3">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p className="mb-0">{activity.action}</p>
                        <small className="text-muted">by {activity.user}</small>
                      </div>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;