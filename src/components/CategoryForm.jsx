import { useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CategoryForm = () => {
  const [cookies] = useCookies(["jwtToken"]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cookies.jwtToken) {
      setMessage("Authentication required. Please log in.");
      return;
    }

    try {
      // Decode token to get user ID (ensure backend sends correct payload)
      const decoded = jwtDecode(cookies.jwtToken);
      console.log("Decoded Token:", decoded); // Debugging

      if (!decoded || !decoded.user_id) {
        setMessage("Invalid token. Please log in again.");
        return;
      }

      const user = decoded.user_id; // Extract user_id from token

      // Send API request
      const response = await axios.post(
        "http://localhost:8080/admin/addCategory",
        { name, description, user }, // Send userId to backend
        {
          headers: {
            Authorization: `Bearer ${cookies.jwtToken}`,
            "Content-Type": "application/json",
          },
          withCredentials: true, // Important for CORS and cookies
        }
      );

      console.log("Server Response:", response.data); // Debugging

      setMessage("Category added successfully!");
      setName("");
      setDescription("");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setMessage(
        "Failed to add category. " +
          (error.response?.data?.message || "Check console for details.")
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Category</h2>
      {message && <p className="text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;
