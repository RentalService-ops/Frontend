import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import OrderCard from "./OrderCard";

const OrderPage = () => {
  const [cookies] = useCookies(["jwtToken"]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [equipmentData, setEquipmentData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3; // Display 3 orders per page

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

      const bookings = response.data;
      setOrders(bookings);
      fetchEquipmentDetails(bookings);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const fetchEquipmentDetails = async (bookings) => {
    try {
      const token = cookies.jwtToken;
  
      // Fetch all equipment in one request
      const response = await axios.get(`http://localhost:8080/api/equipment/getAllEquipments`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      if (!response.data || !Array.isArray(response.data)) {
        console.error("Invalid equipment data:", response.data);
        return;
      }
  
      // Extract unique equipment IDs from bookings
      const equipmentIds = new Set(bookings.map((b) => b.equipmentId));
  
      // Filter only the needed equipment
      const equipmentMap = {};
      response.data.forEach((equipment) => {
        if (equipmentIds.has(equipment.equipmentId)) {
          equipmentMap[equipment.equipmentId] = equipment;
        }
      });
  
      setEquipmentData(equipmentMap);
      console.log(equipmentMap);
  
    } catch (error) {
      console.error("Error fetching equipment details:", error);
    }
  };
  
  const confirmCancelOrder = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const handleCancelOrder = async () => {
    if (!selectedBookingId) return;

    try {
      const token = cookies.jwtToken;
      await axios.put(
        `http://localhost:8080/api/bookings/cancelBooking/${selectedBookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Update state to reflect cancellation
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.bookingId === selectedBookingId ? { ...order, status: "CANCELLED" } : order
        )
      );

      // Close the modal
      setShowModal(false);
      setSelectedBookingId(null);
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const bookingStatuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"];

  // Filter orders based on the selected tab
  const filteredOrders = activeTab === "ALL" ? orders : orders.filter((order) => order.status === activeTab);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="min-vh-100 d-flex flex-column">
  <div className="container py-5">
    <h2 className="text-center mb-4">My Orders</h2>

    {error && <div className="alert alert-danger">{error}</div>}

    {loading ? (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : (
      <>
        <div className="nav nav-tabs mb-3">
          <button
            className={`nav-link ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('ALL');
              setCurrentPage(1); // Reset to first page when switching tabs
            }}
          >
            All Orders
          </button>

          {bookingStatuses.map((status) => (
            <button
              key={status}
              className={`nav-link ${activeTab === status ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(status);
                setCurrentPage(1); // Reset to first page when switching tabs
              }}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="tab-content">
          <div
            className={`tab-pane fade ${activeTab === 'ALL' ? 'show active' : ''}`}
          >
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <OrderCard
                  key={order.bookingId}
                  order={order}
                  equipmentData={equipmentData}
                  onConfirmCancel={confirmCancelOrder}
                />
              ))
            ) : (
              <p className="text-center">No orders found.</p>
            )}
          </div>

          {bookingStatuses.map((status) => (
            <div
              key={status}
              className={`tab-pane fade ${
                activeTab === status ? 'show active' : ''
              }`}
            >
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <OrderCard
                    key={order.bookingId}
                    order={order}
                    equipmentData={equipmentData}
                    onConfirmCancel={confirmCancelOrder}
                  />
                ))
              ) : (
                <p className="text-center">No {status.toLowerCase()} orders found.</p>
              )}
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > ordersPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <button
              className="btn btn-primary me-2"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="align-self-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-primary ms-2"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </>
    )}
  </div>

  {/* Confirmation Modal */}
  <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" style={{ display: showModal ? 'block' : 'none' }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
          <h5 className="modal-title">Cancel Order</h5>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to cancel this order?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
            No
          </button>
          <button type="button" className="btn btn-danger" onClick={handleCancelOrder}>
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};


export default OrderPage;
