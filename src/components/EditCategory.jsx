import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function EditCategory({ category, setShowEditModal, fetchCategories }) {
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);
    const [cookies] = useCookies(["jwtToken"]);
    const [error, setError] = useState("");

    const handleUpdate = async () => {
        try {
            const token = cookies.jwtToken;
            await axios.put(
                `http://localhost:8080/api/category/category/${category.categoryId}`,
                { name, description },
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setShowEditModal(false);
            fetchCategories();
        } catch (err) {
            setError("Failed to update category. Please try again.");
        }
    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Category</h5>
                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                    </div>
                    <div className="modal-body">
                        {error && <p className="text-danger">{error}</p>}
                        <div className="mb-3">
                            <label className="form-label">Category Name</label>
                            <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
