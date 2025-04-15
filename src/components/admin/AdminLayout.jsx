import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="d-flex" style={{minHeight:"80vh"}}>
      {/* Sidebar should be fixed */}
      <AdminSidebar />
      
      {/* Main Content Section */}
      <div className=""> {/*sidebar width */}
        <Outlet /> {/* This will render the admin routes from App.jsx */}
      </div>
    </div>
  );
}
