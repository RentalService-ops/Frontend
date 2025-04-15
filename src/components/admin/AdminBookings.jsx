import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Table from "../Table"
import Pagination from "../../layout/Pagination"

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [cookie] = useCookies();

  const productsPerPage = 5;

  const config=[
    {label:"Renter",render:(booking)=>booking.renterName},
    {label:"Total bookings",render:(booking)=>booking.totalBookingsByRenter},
    {label:"Approved bookings",render:(booking)=> null},
    {label:"Rejected bookings",render:(booking)=>null},
    {label:"Pending bookings",render:(booking)=>null},
    {label:"Cancelled bookings",render:(booking)=>null}
  ]

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

      <div className="d-flex flex-column flex-grow-1">
        {loading ? <>Loading</> : <Table config={config} bookings={bookings}  keyFn={(booking)=>booking.bookingId}/>}
      </div>

      <Pagination data={bookings} currentPage={page} setCurrentPage={setPage} productsPerPage={productsPerPage}  />
    </div>
  );
};

export default AdminBookings;

         