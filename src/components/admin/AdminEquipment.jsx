import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useCookies } from "react-cookie";
import AdminPagination from "./AdminPagination";

const AdminEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cookie] = useCookies();
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 3;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchEquipment();
    }, 100);

    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/admin/equipment?page=${page}&size=${productsPerPage}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${cookie.jwtToken}`,
        },
      });
      setEquipment(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        await axios.delete(`http://localhost:8080/api/admin/equipment/${id}`, {
          headers: {
            Authorization: `Bearer ${cookie.jwtToken}`,
          },
        });
        fetchEquipment();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div className="m-4 p-6 ml-64 w-[calc(100%rem)] overflow-hidden">
      <h2 className="text-2xl font-semibold mb-4">Manage Equipment</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search Equipment..."
          className="border p-2 rounded w-full shadow-sm focus:outline-xl focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Equipment Name</th>
              <th className="p-3 border">Owner Name</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Price Per Day</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Loading Equipments...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : equipment.length > 0 ? (
              equipment.map((item) => (
                <tr key={item.equipmentId} className="border-b hover:bg-gray-50">
                  <td className="p-3 border">{item.equipmentId}</td>
                  <td className="p-3 border">{item.categoryName || "N/A"}</td>
                  <td className="p-3 border">{item.name}</td>
                  <td className="p-3 border">{item.userName || "N/A"}</td>
                  <td className="p-3 border">{item.description}</td>
                  <td className="p-3 border">{item.quantity}</td>
                  <td className="p-3 border">{item.pricePerDay}</td>
                  <td className="p-3 border flex space-x-4">
                    <button
                      className="flex items-center text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDelete(item.equipmentId)}
                    >
                      <Trash2 size={18} className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No equipment found.
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

export default AdminEquipment;

