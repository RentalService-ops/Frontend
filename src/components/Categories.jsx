import { useEffect, useState } from "react";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Pagination from "../layout/Pagination";
import "bootstrap-icons/font/bootstrap-icons.css";
import Table from "./Table";
import _ from 'lodash';

export default function Categories({ isSidebarOpen }) {
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [cookies] = useCookies(["jwtToken"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 4;
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
    const config = [
        {
            label: "Category Name",
            render: (category) => category.name
        },
        {
            label: "Description",
            render: (category) => category.description
        },
        {
            label: "Actions",
            render: (category) => (
                <>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                            setSelectedCategory(category);
                            setShowEditModal(true);
                        }}
                    >
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(category.categoryId)}>
                        Delete
                    </button>
                </>
            )
        }
    ];

    useEffect(() => {
        fetchCategories();
    }, [categoryData, cookies]);

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
      if(!_.isEqual(response.data.body,categoryData)){
        setCategoryData(response.data.body);
      }
      setError("");
    } catch (err) {
      setError("Failed to fetch categories. Please try again."+err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    const confirmDelete=window.confirm("Deleting category will result deleting all the Equipments associated with this category. Are you sure want to delete this category?");
    
    if(confirmDelete){
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
          "Failed to delete category."
        );
        setShowDeleteErrorModal(true);
        console.error("Error deleting category:", err);
      }
    }

  };

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categoryData.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  return (
    <div
      className="container-fluid d-flex flex-column bg-white py-4 px-3"
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
              <>
              <div className="d-flex flex-column flex-grow-1">
                  { categoryData.length > 0 &&
                  <Table config={config} keyFn={(category)=>category.categoryId} bookings={currentCategories}/>
                  } 

                  <Pagination data={categoryData} currentPage={currentPage} setCurrentPage={setCurrentPage} productsPerPage={categoriesPerPage} />
              </div>
              </>
          )}
        </>
      ) : (
        <AddCategory setShowAddCategory={setShowAddCategory} />
      )}

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
