import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";

export default function AddEquipment() {
    const fileRef = useRef();
    const [imageSrc, setImageSrc] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        quantity: 1,
        pricePerDay: "",
        categoryId: "",
        image: null
    });
    const [cookie] = useCookies(["jwtToken"]);

    // Decode JWT Token
    let userId = null;
    let userRole = null;

    if (cookie.jwtToken) {
        try {
            const decodedToken = jwtDecode(cookie.jwtToken);
            userId = decodedToken.user_id;
            userRole = decodedToken.role;
        } catch (error) {
            console.error("Error decoding JWT:", error);
        }
    }

    useEffect(() => {
        async function getCategories() {
            if (!userId) return;
            try {
                const response = await axios.get(`http://localhost:8080/api/rental/category/${userId}`, {
                    headers: { Authorization: `Bearer ${cookie.jwtToken}` },
                    withCredentials: true
                });
                setCategories(response.data);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        }
        getCategories();
    }, [userId, cookie]);

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    function handleFileChange() {
        const file = fileRef.current.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);
            setFormData({ ...formData, image: file });

            return () => URL.revokeObjectURL(objectUrl); // ✅ Cleanup memory
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!userId || userRole !== "rental") {
            alert("You do not have permission to add equipment.");
            return;
        }

        setLoading(true); // Disable button during submission

        const equipmentJson = JSON.stringify({
            name: formData.name,
            description: formData.description,
            quantity: formData.quantity,
            pricePerDay: formData.pricePerDay,
            user: { id: userId },
            category: { categoryId: formData.categoryId }
        });

        const formDataToSend = new FormData();
        formDataToSend.append("equipment", new Blob([equipmentJson], { type: "application/json" })); // JSON as Blob
        formDataToSend.append("imageFile", formData.image || new Blob()); // Send actual image file

        try {
            const response = await axios.post("http://localhost:8080/api/equipment/addEquipment", formDataToSend, {
                headers: {
                    Authorization: `Bearer ${cookie.jwtToken}`,
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            });

            alert("✅ Equipment added successfully!");
            setFormData({ name: "", description: "", quantity: 1, pricePerDay: "", categoryId: "", image: null });
            setImageSrc("");
        } catch (err) {
            console.error("❌ Error adding equipment:", err);
            alert(err.response?.data?.message || "Failed to add equipment. Please try again.");
        } finally {
            setLoading(false); // Enable button after request
        }
    }

    return (
        <div className="add-equipment-container">
            <h3 style={{ textAlign: "center" }}>Add a new Equipment</h3>
            {userRole !== "rental" && (
                <p style={{ color: "red", textAlign: "center" }}>You do not have permission to add equipment.</p>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Equipment name"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        min="1"
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="number"
                        className="form-control"
                        name="pricePerDay"
                        value={formData.pricePerDay}
                        onChange={handleChange}
                        placeholder="Enter price per day"
                        step="0.01"
                        required
                    />
                </div>
                <div className="mb-3">
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter equipment description"
                        rows="3"
                        required
                    />
                </div>
                <select
                    className="form-select mb-3"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled hidden>Select a category</option>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>No categories available</option>
                    )}
                </select>
                <div className="mb-3">
                    <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={handleFileChange}
                        required
                    />
                    {imageSrc && (
                        <>
                            <h3>Uploaded file:</h3>
                            <img src={imageSrc} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} />
                        </>
                    )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={userRole !== "rental" || loading}>
                    {loading ? "Adding..." : "Add Equipment"}
                </button>
            </form>
        </div>
    );
}
