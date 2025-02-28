import { useState } from "react";
import CategoryForm from "./CategoryForm";

const AdminHome = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
        <ul className="space-y-4">
          <li
            className={`p-3 text-lg font-semibold rounded cursor-pointer text-center transition ${
              activeSection === "dashboard" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
            onClick={() => setActiveSection("dashboard")}
          >
            🏠 Dashboard
          </li>
          <li
            className={`p-3 text-lg font-semibold rounded cursor-pointer text-center transition ${
              activeSection === "add-category" ? "bg-blue-700" : "hover:bg-blue-600"
            }`}
            onClick={() => setActiveSection("add-category")}
          >
            ➕ Add Category
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {activeSection === "dashboard" && (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Admin Dashboard</h1>
            <p className="text-gray-700 text-lg">Manage your categories and users here.</p>
          </div>
        )}
        {activeSection === "add-category" && <CategoryForm />}
      </div>
    </div>
  );
};

export default AdminHome;
