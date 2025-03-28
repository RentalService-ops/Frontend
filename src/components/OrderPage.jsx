import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const OrderPage = ({ isSidebarOpen }) => {
  const [cookies] = useCookies(["jwtToken"]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;

  useEffect(() => {
    fetchOrders();
  }, [cookies]);

  const fetchOrders = async () => {
    try {
      const token = cookies.jwtToken;
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      const response = await axios.get(
        `http://localhost:8080/api/bookings/bookingDetails/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log(response.data);
      
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   // Function to calculate total days
   const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Convert ms to days
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PENDING":
        return "badge bg-warning text-dark";
      case "APPROVED":
        return "badge bg-success";
      case "REJECTED":
        return "badge bg-danger";
      case "CANCELLED":
        return "badge bg-secondary";
      case "COMPLETED":
        return "badge bg-primary";
      default:
        return "badge bg-light text-dark";
    }
  };

  const bookingStatuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"];

  const filteredOrders =
    activeTab === "ALL" ? orders : orders.filter((order) => order.status === activeTab);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <>
    
    <div
  className="container-fluid d-flex flex-column"
  style={{
    marginLeft: isSidebarOpen ? "250px" : "0px",
    transition: "margin-left 0.3s ease-in-out",
    height: "100vh", // Ensure full viewport height
    overflow: "auto", // Prevents unnecessary height expansion
  }}
>
  <h1 className="mb-4">My Orders</h1>

  {/* Filter Buttons */}
  <div className="card mb-4">
    <div className="card-body">
      <h5 className="card-title">Filter Orders</h5>
      <div className="d-flex flex-wrap gap-2">
        {["ALL", ...bookingStatuses].map((status) => (
          <button
            key={status}
            className={`btn ${activeTab === status ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveTab(status)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  </div>

  {/* Orders Table and Pagination Wrapper */}
  {loading ? (
    <p>Loading orders...</p>
  ) : error ? (
    <p className="text-danger">{error}</p>
  ) : (
    <div className="d-flex flex-column flex-grow-1">
    {/* Table Container */}
    <div className="table-responsive flex-grow-1">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Equipment Name</th>
            {/* <th>User</th> */}
            <th>Rental Period</th>
            <th>Total Days</th>
            <th>Quantity</th>
            <th>Total Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.equipmentName}</td>
                {/* <td>{order.userName}</td> */}
                <td>
                  {order.startDate} to {order.endDate}
                </td>
                <td>{calculateTotalDays(order.startDate, order.endDate)}</td>
                <td>{order.equipmentQuantity}</td>
                <td>₹{order.totalAmount.toFixed(2)}</td>
                <td>
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="d-flex justify-content-center align-items-center py-3">
        <button
          className="btn btn-outline-primary me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary ms-2"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    )}
  </div>
  )}
</div>

    </>
  );
  
};

export default OrderPage;
