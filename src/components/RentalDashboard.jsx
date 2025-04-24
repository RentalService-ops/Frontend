import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import Equipments from "./Equipments";
import Categories from "./Categories";
import RentalBookingHistory from "./RentalBookingHistory";
import { Row, Col, Card } from "react-bootstrap";
import { ChevronRight, Folder, Box, Calendar, CreditCard } from "lucide-react";
import Pagination from "../layout/Pagination";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const RentalDashboard = (props) => {
  const [cookies] = useCookies(["jwtToken"]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [paymentList, setPaymentList] = useState([]);
  const [showAllEquipments, setShowAllEquipments] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const loading = false;

  const decodedToken = cookies.jwtToken ? jwtDecode(cookies.jwtToken) : null;
  const userId = decodedToken?.user_id;
  const headers = { Authorization: `Bearer ${cookies.jwtToken}` };

  const paginatedPayments = paymentList.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/category/category/${userId}`, { headers });
        setCategoryCount(response.data.body?.length || 0);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchEquipments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/equipment/getEquipmentByUserId?id=${userId}`, { headers });
        setEquipmentList(response.data || []);
      } catch (error) {
        console.error("Error fetching equipments:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/bookings/getBookings?id=${userId}`, { headers });
        setBookingCount(response.data.length || 0);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/payments/getRentalPayment/${userId}`, { headers });
        setPaymentList(response.data || []);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchCategories();
    fetchEquipments();
    fetchBookings();
    fetchPayments();
  }, [userId]);

  const summaryCards = [
    {
      title: "Categories",
      value: categoryCount,
      color: "primary",
      icon: <Folder size={24} />,
      onClick: () => {
        setShowCategories(true);
        localStorage.setItem("state", "My Categories");
        props.setActiveLink("My Categories");
      },
    },
    {
      title: "Equipments",
      value: equipmentList.length,
      color: "success",
      icon: <Box size={24} />,
      onClick: () => {
        setShowAllEquipments(true);
        localStorage.setItem("state", "My Equipments");
        props.setActiveLink("My Equipments");
      },
    },
    {
      title: "Bookings",
      value: bookingCount,
      color: "warning",
      icon: <Calendar size={24} />,
      onClick: () => {
        setShowBookings(true);
        localStorage.setItem("state", "History");
        props.setActiveLink("History");
      },
    },
    {
      title: "Payments",
      value: paymentList.length,
      color: "info",
      icon: <CreditCard size={24} />,
    },
  ];

  const barData = [
    { name: "Bookings", value: bookingCount },
    { name: "Payments", value: paymentList.length },
  ];

  const pieData = [
    { name: "Equipments", value: equipmentList.length },
    { name: "Categories", value: categoryCount },
  ];

  const darkStyles = { backgroundColor: "#212529", color: "white", minHeight: "100vh" };
  const darkCard = { backgroundColor: "#343a40", color: "white" };

  if (showAllEquipments) return <Equipments onBack={() => setShowAllEquipments(false)} />;
  if (showCategories) return <Categories onBack={() => setShowCategories(false)} />;
  if (showBookings) return <RentalBookingHistory onBack={() => setShowBookings(false)} />;

  return (
    <div className="container-fluid p-4" style={darkMode ? darkStyles : {}}>
      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        {summaryCards.map((card, index) => (
          <Col key={index} xl={3} md={6}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="text-muted mb-1">{card.title}</p>
                    <h3 className="mb-2">{loading ? "-" : card.value}</h3>
                  </div>
                  <div className={`bg-${card.color} bg-opacity-10 p-3 rounded d-flex align-items-center justify-content-center`}>
                    {card.icon}
                  </div>
                </div>
              </Card.Body>
              {card.onClick && (
                <Card.Footer className="bg-white border-top-0 pt-0">
                  <button className="btn btn-link p-0 text-decoration-none d-flex align-items-center" onClick={card.onClick}>
                    <span>View Details</span>
                    <ChevronRight size={16} />
                  </button>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="p-3">
            <h5 className="mb-3">Bookings vs Payments</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h5 className="mb-3">Equipment vs Category Distribution</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Payment Table */}
      <div className="card mt-4" style={darkMode ? darkCard : {}}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Payments</h5>
        </div>
        <div className="d-flex flex-column flex-grow-1">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Equipment Name</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((p, i) => (
                  <tr key={i}>
                    <td>{p.razorpayPaymentId || "-"}</td>
                    <td>{p.equpmentName}</td>
                    <td>{p.amount}</td>
                    <td>
                      <span className={`badge bg-${p.status === "success" ? "success" : "danger"}`}>{p.status}</span>
                    </td>
                    <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No payments found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-center mt-auto">
            <Pagination
              data={paymentList}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              productsPerPage={productsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDashboard;
