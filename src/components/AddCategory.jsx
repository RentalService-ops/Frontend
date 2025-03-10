import axios from "axios";
import { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

export default function AddCategory() {
    const [cookies] = useCookies(["jwtToken"]);
    const userId = jwtDecode(cookies.jwtToken).user_id;

    const categoryName = useRef("");
    const categoryDescription = useRef("");
    const [showErrorMsg, setShowErrorMsg] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!categoryName.current.value.trim()) {
            setShowErrorMsg(true);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/rental/addCategory",
                {
                    user: { id: userId },
                    name: categoryName.current.value,
                    description: categoryDescription.current.value,
                },
                {
                    headers: {
                        Authorization: `Bearer ${cookies.jwtToken}`,
                    },
                    withCredentials: true,
                }
            );

            console.log("Response:", response.data);
            categoryDescription.current.value = "";
            categoryName.current.value = "";
            alert("Category added successfully!");
        } catch (err) {
            console.error("Error adding category:", err);
            alert("Failed to add category. Check the console for details.");
        }
    }

    return (
        <div className="add-category-container">
            <h3 style={{ textAlign: "center" }}>Add a New Category</h3>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter category name"
                    ref={categoryName}
                />
            </div>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter category description"
                    ref={categoryDescription}
                ></textarea>
            </div>
            {showErrorMsg && <p style={{ color: "red" }}>Please enter a category name!</p>}
            <button className="btn btn-primary" onClick={handleSubmit}>
                Add Category
            </button>
        </div>
    );
}
