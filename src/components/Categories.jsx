import { useEffect, useState } from "react";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Pagination from "../layout/Pagination";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Categories({ isSidebarOpen }) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [cookies] = useCookies(["jwtToken"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 8;
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
const [deleteErrorMessage, setDeleteErrorMessage] = useState("");


  useEffect(() => {
    fetchCategories();
  }, [cookies]);

  const fetchCategories = async () => {
    try {
      const token = cookies.jwtToken;
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.user_id;

      const response = await axios.get(
        `http://localhost:8080/api/category/category/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setCategoryData(response.data.body);
      setError("");
    } catch (err) {
      setError("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      const token = cookies.jwtToken;
      await axios.delete(
        `http://localhost:8080/api/category/category/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setCategoryData(
        categoryData.filter((category) => category.categoryId !== categoryId)
      );
    } catch (err) {
        setDeleteErrorMessage(
          "The category you are trying to delete is in use. Please remove the equipment associated with this category first."
        );
        setShowDeleteErrorModal(true);
        console.error("Error deleting category:", err);
      }
      
  };

  const totalPages = Math.ceil(categoryData.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categoryData.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  return (
    <div
      className="container-fluid d-flex flex-column bg-light py-4 px-3"
      style={{
        marginLeft: isSidebarOpen ? "250px" : "0px",
        transition: "margin-left 0.3s ease-in-out",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {!showAddCategory ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary mb-0">
              <i className="bi bi-tags-fill me-2"></i>Manage Categories
            </h2>
            <button
              className="btn btn-success shadow-sm"
              onClick={() => setShowAddCategory(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>Add Category
            </button>
          </div>

          {loading ? (
            <p>Loading categories...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="d-flex flex-column flex-grow-1">
              <div className="table-responsive flex-grow-1">
                <table className="table table-hover table-bordered table-striped shadow-sm">
                  <thead className="table-dark text-center">
                    <tr>
                      <th>#</th>
                      <th>Category Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {currentCategories.length > 0 ? (
                      currentCategories.map((category, index) => (
                        <tr key={category.categoryId}>
                          <td>
                            {index + 1 + (currentPage - 1) * categoriesPerPage}
                          </td>
                          <td>{category.name}</td>
                          <td style={{ whiteSpace: "pre-line" }}>
                            {category.description}
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => {
                                setSelectedCategory(category);
                                setShowEditModal(true);
                              }}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(category.categoryId)}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">
                          No categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-auto">
                <Pagination
                  data={categoryData}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  productsPerPage={categoriesPerPage}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <AddCategory setShowAddCategory={setShowAddCategory} />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditCategory
          category={selectedCategory}
          setShowEditModal={setShowEditModal}
          fetchCategories={fetchCategories}
        />
      )}

{showDeleteErrorModal && (
  <>
    <div
      className="modal show fade d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content border border-danger shadow">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle-fill me-2"></i> Deletion Error
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={() => setShowDeleteErrorModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p>{deleteErrorMessage}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowDeleteErrorModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
)}

    </div>
  );
}
