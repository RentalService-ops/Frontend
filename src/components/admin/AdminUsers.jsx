import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useCookies } from "react-cookie";
import AdminPagination from "./AdminPagination";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cookie] = useCookies();
  const [error, setError] = useState(null);
  const [allUsersCount, setAllUsersCount] = useState(0);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [totalRentersCount, setTotalRentersCount] = useState(0);
  const [totalAdminsCount, setTotalAdminsCount] = useState(0);

  const productsPerPage = 4;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 100);

    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/admin/users?page=${page}&size=${productsPerPage}&sortBy=id&direction=asc&search=${search}`,
        {
          headers: { Authorization: `Bearer ${cookie.jwtToken}` },
        }
      );
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
  
      const allUsers = response.data.content;
      setAllUsersCount(response.data.totalItems); // use actual total count from backend
      setTotalUsersCount(allUsers.filter((u) => u.role === "user").length);
      setTotalRentersCount(allUsers.filter((u) => u.role === "rental").length);
      setTotalAdminsCount(allUsers.filter((u) => u.role === "admin").length);
    } catch (error) {
      setError("Error fetching users");
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
        alert("User deleted successfully!");
        fetchUsers();
      } catch (error) {
        setError("Error deleting user");
        console.error("Error deleting user", error);
        alert("Failed to delete the user.");
      }
    }
  };

  return (
    <div className="m-4 p-6 w-full"> {/* Removed ml-64 and fixed width */}

      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <div className="flex gap-6 mb-4 text-sm text-gray-700">
        <p className="bg-gray-100 px-4 py-2 rounded shadow">
          <strong>All Users:</strong> {allUsersCount}
        </p>
        <p className="bg-gray-100 px-4 py-2 rounded shadow">
          <strong>Total Users:</strong> {totalUsersCount}
        </p>
        <p className="bg-gray-100 px-4 py-2 rounded shadow">
          <strong>Total Renters:</strong> {totalRentersCount}
        </p>
        <p className="bg-gray-100 px-4 py-2 rounded shadow">
          <strong>Total Admins:</strong> {totalAdminsCount}
        </p>
      </div>
      <input
        type="text"
        placeholder="Search Users..."
        className="border p-2 rounded w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone Number</th>
              {/* <th className="p-3 border">Address</th> */}
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{user.id}</td>
                  <td className="p-3 border">{user.username}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.phoneNumber}</td>
                  {/* <td className="p-3 border">{user.address}</td> */}
                  <td className="p-3 border">{user.role}</td>
                  <td className="p-3 border flex space-x-4">
                    <button
                      className="flex items-center text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 size={18} className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      
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

export default AdminUsers;
