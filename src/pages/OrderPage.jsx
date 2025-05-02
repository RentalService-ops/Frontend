import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Pagination from "../layout/Pagination";
import Table from "../components/Table";
import _ from 'lodash';
import UpdateBookingModal from "../components/UpdateBookingModal";
import CancelOrderModal from "../components/CancelOrderModal";

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

  const token = cookies.jwtToken;
  const decodedToken = token ? jwtDecode(token) : {};
  const userId = decodedToken.user_id;

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [updateForm, setUpdateForm] = useState({
    bookingId: null,
    equipmentQuantity: 1,
    startDate: "",
    endDate: "",
    status: "PENDING",
    totalAmount: 0,
    addressDTO: { id: 0 }
  });


  useEffect(() => {
    localStorage.setItem("failedPaymentAttempts", 0);
  }, []);



  const loadRazorpayScript = () => {//displays the Razorpay UI for payment.
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async (order) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/payments/create-order",
        {
          amount: order.totalAmount,
          userId,
          bookingId: order.bookingId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const razorpayOrder = response.data;

      const options = {
        key: "rzp_test_e2YVwuhiiNlpj2",
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Equipment Rental",
        description: "Rental Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await axios.post(
              "http://localhost:8080/api/payments/verify-payment",
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
                userId,
                bookingId: order.bookingId,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
              }
            );

            alert("Payment successful and verified!");
            localStorage.setItem("failedPaymentAttempts", 0);
            fetchOrders();
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment succeeded but verification failed.");
          }
        },
        modal: {
          ondismiss: async function () {
            const failedPaymentAttempts = parseInt(localStorage.getItem("failedPaymentAttempts")) || 0;
            if (failedPaymentAttempts < 2) {
              try {
                const response1 = await axios.post(`http://localhost:8080/api/payments/failed-payment/${response.data.id}`, {}, {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                })
                localStorage.setItem("failedPaymentAttempts", failedPaymentAttempts + 1);
                alert(response1.data);
              }
              catch (err) {
                console.log("Error in failed payment:", err);
              }
            } else {
              try {

                const response1 = await axios.post(`http://localhost:8080/api/payments/reject-payment/${response.data.id}`, {}, {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                })

                alert(response1.data);
                localStorage.removeItem("failedPaymentAttempts");
              } catch (error) {
                console.error("Error in rejecting payment:", error);
              }

            }
          }
        },
        prefill: {
          name: decodedToken.name || "User",
          email: decodedToken.email || "test@example.com",
        },
        theme: {
          color: "#0d6efd",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Something went wrong with payment.");
    }
  };


  function returnActionButton(order) {
    if (order.status === "PENDING") {
      return (
        <>
          <div className="d-flex justify-content-start gap-2">
            <button
              className="btn btn-info btn-sm rounded-pill"
              onClick={() => {

                setSelectedProduct(order);
                setShowUpdateModal(true);
              }}
            >
              Update
            </button>
            <button
              className="btn btn-danger btn-sm rounded-pill"
              onClick={() => handleCancelClick(order.bookingId)}
            >
              Cancel
            </button>
          </div>
        </>
      );

    } else if (order.status === "APPROVED") {
      return (
        <button
          className="btn btn-success btn-sm rounded-pill"
          onClick={() => handlePayNow(order)}
        >
          Pay Now
        </button>
      );
    } else if (
      order.status === "COMPLETED" &&
      !order.returned &&
      order.endDate < new Date().toISOString().split("T")[0]
    ) {
      return (
        <button
          className="btn btn-warning btn-sm rounded-pill"
          onClick={() => handleReturnEquipment(order.bookingId)}
        >
          Return Equipment
        </button>
      );
    } else {
      return (
        <button className="btn btn-secondary btn-sm rounded-pill" disabled>
          N/A
        </button>
      );
    }
  }
  const updateOrder = async () => {
    try {

      await axios.put(
        `http://localhost:8080/api/bookings/updateBooking`,
        updateForm,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      alert("Booking updated successfully!");
      setShowUpdateModal(false);
      fetchOrders(); // refresh orders
    } catch (err) {
      alert("Failed to update booking.");
    }
  };

  const config = [
    {
      label: "Sr No.",
      render: (order, index) => (currentPage - 1) * ordersPerPage + index + 1,
    }
    ,
    {
      label: "Equipment Name",
      render: (order) => order.equipmentName,
    },
    {
      label: "Delevery Address",
      render: (order) => order.addressDTO?.street + " " + order.addressDTO?.city,
    },
    {
      label: "Rental Period",
      render: (order) => (
        <>
          {order.startDate} to {order.endDate}
        </>
      ),
    },
    {
      label: "Total Days",
      render: (order) => calculateTotalDays(order.startDate, order.endDate),
    },
    {
      label: "Quantity",
      render: (order) => order.equipmentQuantity,
    },
    {
      label: "Total Cost",
      render: (order) => order?.totalAmount ? order.totalAmount.toFixed(2) : '0.00',
    },
    {
      label: "Status",
      render: (order) => (
        <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
      ),
    },
    {
      label: "Action",
      render: (order) => (
        <>
          {returnActionButton(order)}
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, [cookies, orders]);

  async function handleReturnEquipment(orderId) {
    try {
      const response = await axios.put(`http://localhost:8080/api/bookings/${orderId}/return`, {}, {
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`
        }
      })
      const newOrders = orders.map(order => {
        if (order.bookingId === orderId) {
          return {
            ...order,
            returned: true
          }
        }
        return order;
      })
      setOrders(newOrders);
      setError(null);
      alert(response.data);
    }
    catch (err) {
      console.log(err)
      alert(err);
    }
  }
  const fetchOrders = async () => {
    try {
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/bookings/bookingDetails/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (!_.isEqual(response.data, orders)) {
        setOrders(response.data);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response && error.response.status === 404) {
        setOrders([]);
        setError("NO_ORDERS");
      } else {
        setError("GENERAL_ERROR");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!selectedOrderId) return;
    try {
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



  useEffect(() => {
    if (showUpdateModal && selectedProduct) {


      setUpdateForm({
        bookingId: selectedProduct.bookingId || null,
        equipmentQuantity: selectedProduct.equipmentQuantity || 1,
        startDate: selectedProduct.startDate || "",
        endDate: selectedProduct.endDate || "",
        status: selectedProduct.status || "PENDING",
        totalAmount: selectedProduct.totalAmount || 0,
        addressDTO: { id: parseInt(selectedProduct.addressDTO?.id) || 0 },
      });
    }
  }, [showUpdateModal, selectedProduct]);

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
        <h2 className="mb-4 fw-bold text-primary">My Orders</h2>
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <h5 className="card-title text-secondary">Filter Orders</h5>
            <div className="d-flex flex-wrap gap-2">
              {["ALL", ...bookingStatuses].map((status) => (
                <button
                  key={status}
                  className={`btn ${activeTab === status ? "btn-primary" : "btn-outline-primary"
                    } rounded-pill px-3 py-1`}
                  onClick={() => setActiveTab(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-muted">⏳ Loading orders...</p>
        ) : error === "NO_ORDERS" ? (
          <div className="alert alert-info text-center">No bookings at the moment.</div>
        ) : error === "GENERAL_ERROR" ? (
          <p className="text-danger">Failed to fetch orders. Please try again.</p>
        ) : (
          <div className="d-flex flex-column flex-grow-1">
            <Table
              config={config}
              bookings={currentOrders}
              keyFn={(booking) => booking.bookingId}
            />
            <div className="d-flex justify-content-center mt-auto">
              <Pagination
                data={filteredOrders}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                productsPerPage={ordersPerPage}
              />
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <CancelOrderModal setShowModal={setShowModal} cancelOrder={cancelOrder}/>
      )}

      <UpdateBookingModal
        show={showUpdateModal}
        selectedProduct={selectedProduct}
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={updateOrder}
      />
    </>
  );

};

export default OrderPage;
