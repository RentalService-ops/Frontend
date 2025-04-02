import { useEffect, useState } from "react";
import AddCategory from "./AddCategory";
import Pagination from "./Pagination";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Categories() {
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [cookies] = useCookies();
    const id = jwtDecode(cookies.jwtToken).user_id;

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 2;

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        async function fetchData() {
            try {
                const response = await axios.get(`http://localhost:8080/api/category/category/${id}`, {
                    headers: { Authorization: `Bearer ${cookies.jwtToken}` },
                    withCredentials: true,
                    signal
                });
                setCategoryData(response.data.body);
            } catch (err) {
                console.log("Error fetching categories:", err.message);
            }
        }

        fetchData();
        return () => {
            controller.abort();
        };
    }, [id, cookies.jwtToken]);

    async function handleDelete(categoryId) {
        try {
            await axios.delete(`http://localhost:8080/api/category/category/${categoryId}`, {
                headers: { Authorization: `Bearer ${cookies.jwtToken}` },
                withCredentials: true
            });

            setCategoryData(categoryData.filter(category => category.categoryId !== categoryId));
        } catch (err) {
            console.log("Error deleting category:", err.message);
        }
    }

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = categoryData.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <>
            {!showAddCategory ? (
                <>
                    {/* Top Navbar with Pagination and Add Button */}
                    <div className="d-flex justify-content-between align-items-center bg-light p-3 mb-3 border rounded">
    <button className="btn btn-primary ms-auto" onClick={() => setShowAddCategory(true)}>
        Add Category
    </button>
</div>


                    {/* Category Table */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark ">
                                <tr>
                                    <th>#</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((category, index) => (
                                    <tr key={category.categoryId}>
                                        <td>{index + 1}</td>
                                        <td>{category.name}</td>
                                        <td style={{ wordWrap: "break-word", maxWidth: "300px", whiteSpace: "pre-line" }}>
                                            {category.description}
                                        </td>
                                        <td>
                                            <button className="btn btn-primary me-2">Edit</button>
                                            <button className="btn btn-danger" onClick={() => handleDelete(category.categoryId)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Navbar with Pagination */}
                    <div className="d-flex justify-content-center bg-light p-3 mt-3 border rounded">
                        <Pagination data={categoryData} currentPage={currentPage} setCurrentPage={setCurrentPage}
                            productsPerPage={productsPerPage} />
                    </div>
                </>
            ) : (
                <AddCategory setShowAddCategory={setShowAddCategory} />
            )}
        </>
    );
}
