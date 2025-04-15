import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import AdminPagination from "./AdminPagination";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [cookie] = useCookies();

  const productsPerPage = 2;

  useEffect(() => {
    fetchBookings();
  }, [page, search]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/bookings?page=${page}&size=${productsPerPage}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${cookie.jwtToken}` },
        }
      );
      setBookings(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="m-4 p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Manage Bookings</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search bookings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">Booking ID</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Owner</th>
              <th className="p-3 border">Customer</th>
              <th className="p-3 border">Equipment Name</th>
              <th className="p-3 border">Bookings by Renter</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.bookingId} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{booking.bookingId}</td>
                  <td className="p-3 border">{booking.equipmentQuantity}</td>
                  <td className="p-3 border">{booking.renterName}</td>
                  <td className="p-3 border">{booking.userName}</td>
                  <td className="p-3 border">{booking.equipmentName}</td>
                  <td className="p-3 border">{booking.totalBookingsByRenter}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full ${booking.status === "PENDING"
                        ? "bg-yellow-200"
                        : booking.status === "APPROVED"
                          ? "bg-green-200"
                          : "bg-red-200"
                        }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-3 border space-x-2">
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}

      <div className="m-5">
        <AdminPagination
          totalPages={totalPages}
          currentPage={page}
          setCurrentPage={setPage}
          />
      </div>
    </div>
  );
};

export default AdminBookings;

         