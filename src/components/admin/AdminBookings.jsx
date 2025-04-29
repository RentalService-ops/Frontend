import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { 
  Container, 
  Card, 
  Spinner, 
} from "react-bootstrap";
import Pagination from "../../layout/Pagination"; 
import Table from "../Table";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("Renter");
  const [cookie] = useCookies();

  const productsPerPage = 5;
  
  const config=[
    {
      label: "Sr No.",
      render: (_booking, index) => index + 1,
    },
    {label:"Name",render:(booking)=>booking.name},
    {label:"Total Bookings",render:(booking)=>booking.totalBookings},
    {label:"Approved Bookings",render:(booking)=>booking.approvedBookings},
    {label:"Pending Bookings",render:(booking)=>booking.pendingBookings},
    {label:"Rejected Bookings",render:(booking)=>booking.rejectedBookings},
    {label:"Cancelled Bookings",render:(booking)=>booking.cancelledBookings},
    {label:"Completed Bookings",render:(booking)=>booking.completedBookings}
  ]

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBookings();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/bookings?page=${page - 1}&size=${productsPerPage}&search=${search}`, 
        {
          headers: { Authorization: `Bearer ${cookie.jwtToken}` },
        }
      );
      setBookings(response.data.content.content);                                                    
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Booking Management</h2>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
        <div className="d-flex gap-3">
          <button className="btn btn-primary" onClick={() => setSearch("Renter")}>Renter Bookings</button>
          <button className="btn btn-primary" onClick={() => setSearch("Equipment")}>Equipment Bookings</button>
          <button className="btn btn-primary" onClick={() => setSearch("User")}>User Bookings</button>
        </div>

          {loading ?<Spinner /> :<Table config={config} bookings={bookings}/>}

          <Pagination 
            data={bookings}
            currentPage={page}
            setCurrentPage={setPage}
            productsPerPage={productsPerPage}
            totalPages={totalPages}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminBookings;