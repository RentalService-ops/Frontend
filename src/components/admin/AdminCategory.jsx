import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../layout/Pagination"
import Table from "../Table"

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const productsPerPage = 4;
  const getToken = () => {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith("jwtToken="))
      ?.split("=")[1];
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("JWT Token not found");
      }

      const response = await axios.get(
        `http://localhost:8080/api/admin/categories?page=${page}&size=${productsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setCategories(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching categories");
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchCategories();
  }, [page]);

  return (
    <div className="m-4 p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Description</th>
              {/* <th className="border p-2">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.categoryId}>
                <td className="border p-2">{category.categoryId}</td>
                <td className="border p-2">{category.name}</td>
                <td className="border p-2">{category.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Pagination data={categories} currentPage={page} setCurrentPage={setPage} productsPerPage={productsPerPage}  totalPages={totalPages}/>
    </div>
  );
};

export default AdminCategory;
