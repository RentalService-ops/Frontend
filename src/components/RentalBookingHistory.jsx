import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import Table from "./Table";
import Pagination from "../layout/Pagination";
import { useState, useEffect } from "react";

export default function RentalBookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [cookies] = useCookies();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("APPROVED"); // default tab
  const productsPerPage = 7;

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

  const statusOptions = ["APPROVED", "CANCELLED", "REJECTED"];

  const filteredBookings = bookings.filter((booking) => booking.status === activeTab);

  const indexOfLastItem = currentPage * productsPerPage;
  const indexOfFirstItem = indexOfLastItem - productsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  const config = [
    {
      label: "Sr No.",
      render: (_booking, index) => indexOfFirstItem + index + 1,
    },
    { label: "User", render: (booking) => booking.userName },
    { label: "Equipment", render: (booking) => booking.equipmentName },
    { label: "Quantity", render: (booking) => booking.equipmentQuantity },
    { label: "From", render: (booking) => booking.startDate },
    { label: "To", render: (booking) => booking.endDate },
    { label: "Amount", render: (booking) => `₹${booking.totalAmount}` },
    {
      label: "Status",
      render: (booking) => (
        <span
          className={`badge ${
            booking.status === "APPROVED"
              ? "bg-success"
              : booking.status === "REJECTED"
              ? "bg-danger"
              : "bg-secondary"
          }`}
        >
          {booking.status}
        </span>
      ),
    },
  ];

  return (
    <div className="container d-flex flex-column" style={{ height: "100vh" }}>
  <h3 className="mb-3">Booking History</h3>

  {/* Tabs */}
  <div className="mb-3">
    {statusOptions.map((status) => (
      <button
        key={status}
        className={`btn me-2 ${
          activeTab === status ? "btn-primary" : "btn-outline-primary"
        }`}
        onClick={() => {
          setActiveTab(status);
          setCurrentPage(1);
        }}
      >
        {status}
      </button>
    ))}
  </div>

  {/* Table and Pagination Area */}
  <div className="d-flex flex-column flex-grow-1">
    <Table
      bookings={currentBookings}
      config={config}
      keyFn={(booking) => booking.bookingId}
    />

    <div className="d-flex justify-content-center mt-auto">
      <Pagination
        data={filteredBookings}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
      />
    </div>
  </div>
</div>

  );
}
