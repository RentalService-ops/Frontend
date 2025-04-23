import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Container, Badge, Button } from "react-bootstrap";
import { Trash2, Users as UsersIcon } from "lucide-react";
import { useCookies } from "react-cookie";
import AdminDataTable from "./AdminDataTable";
import Pagination from "../../layout/Pagination";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cookie] = useCookies();
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    allUsers: 0,
    totalUsers: 0,
    totalRenters: 0,
    totalAdmins: 0
  });

  const productsPerPage = 6;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/users?page=${page - 1}&size=${productsPerPage}&sortBy=id&direction=asc&search=${search}`,
        {
          headers: { Authorization: `Bearer ${cookie.jwtToken}` },
        }
      );
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);

      setStats({
        allUsers: response.data.totalItems,
        totalUsers: response.data.content.filter(u => u.role === "user").length,
        totalRenters: response.data.content.filter(u => u.role === "rental").length,
        totalAdmins: response.data.content.filter(u => u.role === "admin").length
      });
    } catch (error) {
      setError("Error fetching users. Please try again.");
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${cookie.jwtToken}` },
        });
        fetchUsers();
      } catch (error) {
        setError("Error deleting user");
        console.error("Error deleting user", error);
      }
    }
  };

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "username" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phoneNumber" },
    { 
      header: "Role", 
      accessor: "role",
      render: (user) => {
        let badgeColor = "secondary";
        if (user.role === "admin") badgeColor = "danger";
        else if (user.role === "rental") badgeColor = "success";
        else if (user.role === "user") badgeColor = "primary";

        return <Badge bg={badgeColor}>{user.role}</Badge>;
      }
    },
  ];

  const renderActions = (user) => (
    <Button
      variant="outline-danger"
      size="sm"
      onClick={() => handleDelete(user.id)}
      className="d-flex align-items-center mx-auto"
    >
      <Trash2 size={16} className="me-1" /> Delete
    </Button>
  );

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">User Management</h2>
      </div>

      <Row className="g-3 mb-4">
        {[
          { title: "All Users", value: stats.allUsers, icon: <UsersIcon size={24} />, color: "primary" },
          { title: "Customers", value: stats.totalUsers, icon: <UsersIcon size={24} />, color: "success" },
          { title: "Renters", value: stats.totalRenters, icon: <UsersIcon size={24} />, color: "warning" },
          { title: "Admins", value: stats.totalAdmins, icon: <UsersIcon size={24} />, color: "danger" }
        ].map((stat, index) => (
          <Col key={index} md={3} sm={6}>
            <Card className={`border-${stat.color} h-100 shadow-sm`}>
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">{stat.title}</h6>
                  <h3 className="mb-0">{stat.value}</h3>
                </div>
                <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded`}>
                  {stat.icon}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <AdminDataTable
        columns={columns}
        data={users}
        loading={loading}
        error={error}
        emptyMessage="No users found."
        loadingMessage="Loading users..."
        searchPlaceholder="Search users by name..."
        search={search}
        setSearch={setSearch}
        renderActions={renderActions}
      />

      <Pagination 
        data={users}
        currentPage={page}
        setCurrentPage={setPage}
        productsPerPage={productsPerPage}
        totalPages={totalPages}
      />
    </Container>
  );
};

export default AdminUsers;

