import { useEffect, useState } from "react";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Pagination from "../layout/Pagination";

export default function Categories({ isSidebarOpen }) {
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [cookies] = useCookies(["jwtToken"]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 6;
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

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

            const response = await axios.get(`http://localhost:8080/api/category/category/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            setCategoryData(response.data.body);
            setError("");
        } catch (err) {
            setError("Failed to fetch categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    async function handleDelete(categoryId) {
        try {
            const token = cookies.jwtToken;
            await axios.delete(`http://localhost:8080/api/category/category/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            setCategoryData(categoryData.filter(category => category.categoryId !== categoryId));
        } catch (err) {
            alert("The category you are trying to delete is in use. Please remove the equipment associated with this category first.");
            console.error("Error deleting category:", err);
        }
    }

    // Pagination Logic
    const totalPages = Math.ceil(categoryData.length / categoriesPerPage);
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categoryData.slice(indexOfFirstCategory, indexOfLastCategory);

    return (
        <div
            className="container-fluid d-flex flex-column"
            style={{
                marginLeft: isSidebarOpen ? "250px" : "0px",
                transition: "margin-left 0.3s ease-in-out",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {!showAddCategory ? (
                <>
                    <h1 className="mb-4">Categories</h1>

                    {/* Add Category Button */}
                    <button
                        className="btn btn-primary justify-content-center align-items-end ms-auto mb-2"
                        style={{ right: "18px" }}
                        onClick={() => setShowAddCategory(true)}
                    >
                        Add Category
                    </button>

                    {/* Categories Table */}
                    {loading ? (
                        <p>Loading categories...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : (
                        <div className="d-flex flex-column flex-grow-1">
                            <div className="table-responsive flex-grow-1">
                                <table className="table table-hover table-bordered table-striped">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Category Name</th>
                                            <th>Description</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentCategories.length > 0 ? (
                                            currentCategories.map((category, index) => (
                                                <tr key={category.categoryId}>
                                                    <td>{index + 1 + (currentPage - 1) * categoriesPerPage}</td>
                                                    <td>{category.name}</td>
                                                    <td style={{ wordWrap: "break-word", maxWidth: "300px", whiteSpace: "pre-line" }}>
                                                        {category.description}
                                                    </td>
                                                    <td>
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

                            {/* Fixed Pagination at Bottom */}
                            <Pagination data={categoryData} currentPage={currentPage} setCurrentPage={setCurrentPage} productsPerPage={categoriesPerPage} />
                        </div>
                    )}
                </>
            ) : (
                <AddCategory setShowAddCategory={setShowAddCategory} />
            )}

            {/* Edit Category Modal */}
            {showEditModal && <EditCategory category={selectedCategory} setShowEditModal={setShowEditModal} fetchCategories={fetchCategories} />}
        </div>
    );
}
