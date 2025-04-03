import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import Table from "./Table";
import { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";

export default function RentalDashboard() {
  const [bookings, setBookings] = useState([]);
  const [cookies] = useCookies();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchBookings() {
      try {
        const response = await axios.get("http://localhost:8080/api/bookings/getBookings", {
          headers: {
            Authorization: `Bearer ${cookies.jwtToken}`,
          },
          params: {
            id: jwtDecode(cookies.jwtToken).user_id,
          },
          signal: controller.signal,
        });
        setBookings(response.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchBookings();
    return () => controller.abort();
  }, [cookies.jwtToken]);

  const config = [
    { label: "#", render: (booking) => booking.bookingId },
    { label: "User", render: (booking) => booking.userName },
    { label: "Equipment", render: (booking) => booking.equipmentName },
    { label: "Quantity", render: (booking) => booking.equipmentQuantity },
    { label: "From", render: (booking) => booking.startDate },
    { label: "To", render: (booking) => booking.endDate },
    { label: "Amount", render: (booking) => `$${booking.totalAmount}` },
    { label: "Status", render: (booking) => <span className={`badge ${booking.status === "APPROVED" ? "bg-success" : booking.status === "REJECTED" ? "bg-danger" : "bg-warning"}`}>{booking.status}</span> },
    {
      label: "Actions",
      render: (booking) =>
        booking.status === "PENDING" ? (
          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={() => handleModalOpen(booking.bookingId, "approve")}>Approve</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleModalOpen(booking.bookingId, "reject")}>Reject</button>
          </div>
        ) : (
          "-"
        ),
    },
  ];

  async function handleApprove(id) {
    try {
      const response = await axios.patch(`http://localhost:8080/api/bookings/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${cookies.jwtToken}` },
      });
      updateBookingStatus(id, response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReject(id) {
    try {
      const response = await axios.patch(`http://localhost:8080/api/bookings/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${cookies.jwtToken}` },
      });
      updateBookingStatus(id, response.data);
    } catch (err) {
      console.error(err);
    }
  }

  function updateBookingStatus(id, updatedBooking) {
    setBookings(bookings.map((booking) => (booking.bookingId === id ? updatedBooking : booking)));
  }

  function handleModalOpen(bookingId, type) {
    setSelectedBookingId(bookingId);
    setActionType(type);
    setModalVisible(true);
  }

  function handleModalClose() {
    setModalVisible(false);
    setSelectedBookingId(null);
    setActionType(null);
  }

  function handleModalConfirm() {
    if (actionType === "approve" && selectedBookingId) {
      handleApprove(selectedBookingId);
    } else if (actionType === "reject" && selectedBookingId) {
      handleReject(selectedBookingId);
    }
    setModalVisible(false);
  }

  return (
    <div className="container">
      <h3 className="mb-3">Pending Bookings</h3>
      <Table
        bookings={bookings.filter((booking) => booking.status === "PENDING")}
        config={config}
        keyFn={(booking) => booking.bookingId}
      />

      <hr className="my-5" />

      <h3 className="mb-3">Booking History</h3>
      <Table
        bookings={bookings.filter((booking) => booking.status !== "PENDING")}
        config={config}
        keyFn={(booking) => booking.bookingId}
      />

      <ConfirmationModal
        visible={modalVisible}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        actionType={actionType}
      />
    </div>
  );
}
