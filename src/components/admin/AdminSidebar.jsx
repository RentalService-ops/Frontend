import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Package, ClipboardList, MessageCircle, Menu, Folder } from "lucide-react";

const AdminSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`bg-light text-dark d-flex flex-column transition-all ${isCollapsed ? "collapsed" : "expanded"}`}>
            {/* Toggle Button */}
            <div className="d-flex justify-content-end p-2">
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    className="btn btn-outline-secondary"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="nav flex-column px-2">
                {[
                    { to: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
                    { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
                    { to: "/admin/equipments", label: "Equipments", icon: <Package size={20} /> },
                    { to: "/admin/bookings", label: "Bookings", icon: <ClipboardList size={20} /> },
                    { to: "/admin/queries", label: "Queries", icon: <MessageCircle size={20} /> },
                    { to: "/admin/categories", label: "Categories", icon: <Folder size={20} /> } 
                ].map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.to}
                        className={({ isActive }) =>
                            `nav-link d-flex align-items-center py-2 px-3 rounded ${isActive ? "bg-secondary text-white fw-bold" : "text-dark"}`
                        }
                    >
                        <span className="me-2">{item.icon}</span>
                        <span className={`link-text ${isCollapsed ? "d-none" : ""}`}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminSidebar;

