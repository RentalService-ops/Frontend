import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Pagination from "../layout/Pagination";
import Table from "./Table"
const OrderPage = ({ isSidebarOpen }) => {
  const [cookies] = useCookies(["jwtToken"]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const ordersPerPage = 6;

  const config=[
    {
      label: "Sr No.",
      render: (order, index) => (currentPage - 1) * ordersPerPage + index + 1,
    },
    {
      label:"Equipment Name",
      render:(order)=>order.equipmentName
    },
    {
      label:"Rental Period",
      render:(order)=>(<>{order.startDate} to {order.endDate}</>)
    },
    {
      label:"Total Days",
      render:(order)=>calculateTotalDays(order.startDate,order.endDate)
    },
    {
      label:"Quantity",
      render:(order)=>order.equipmentQuantity
    },
    {
      label:"Total Cost",
      render:(order)=>order.totalAmount.toFixed(2)
    },
    {
      label:"Status",
      render:(order)=>( <span className={getStatusBadgeClass(order.status)}>
      {order.status}
    </span>)
    },
    {
      label:"Action",
      render:(order)=>(<button
        className="btn btn-danger btn-sm rounded-pill"
        onClick={() => handleCancelClick(order.bookingId)}
        disabled={order.status !== "PENDING"}
      >
        Cancel
      </button>)
    }
  ]

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

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
      const token = cookies.jwtToken;
      await axios.put(
        `http://localhost:8080/api/bookings/cancelBooking/${selectedOrderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
      setError("Failed to cancel order. Please try again.");
    } finally {
      setShowModal(false);
      setSelectedOrderId(null);
    }
  };

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <>
      <div
        className="container-fluid d-flex flex-column bg-light"
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0px",
          transition: "margin-left 0.3s ease-in-out",
          height: "100vh",
          overflow: "auto",
          padding: "20px",
        }}
      >
        <h2 className="mb-4 fw-bold text-primary"> My Orders</h2>
  
        {/* Filter */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <h5 className="card-title text-secondary">Filter Orders</h5>
            <div className="d-flex flex-wrap gap-2">
              {["ALL", ...bookingStatuses].map((status) => (
                <button
                  key={status}
                  className={`btn ${
                    activeTab === status ? "btn-primary" : "btn-outline-primary"
                  } rounded-pill px-3 py-1`}
                  onClick={() => setActiveTab(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
  
        {/* Table or Loading/Error */}
        {loading ? (
          <p className="text-muted">⏳ Loading orders...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : (
          <div className="d-flex flex-column flex-grow-1">
            <Table config={config} bookings={currentOrders} keyFn={(booking)=>booking.bookingId} />
  
            {/* Pagination */}
            <div className="d-flex justify-content-center mt-auto">
              <Pagination data={filteredOrders} currentPage={currentPage} setCurrentPage={setCurrentPage} productsPerPage={ordersPerPage} />
            </div>
          </div>
        )}
      </div>
  
      {/* Modal */}
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content shadow-lg">
                <div className="modal-header bg-danger text-white">
                  <h5 className="modal-title">Cancel Order</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to cancel this order?</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary rounded-pill"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-danger rounded-pill"
                    onClick={cancelOrder}
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
  
};

export default OrderPage;
