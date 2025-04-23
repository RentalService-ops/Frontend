import { NavLink } from "react-router-dom";
import { Nav, Button } from "react-bootstrap";
import { 
  Home, 
  Users, 
  Package, 
  ClipboardList, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight, 
  Folder,
} from "lucide-react";

const AdminSidebar = ({ isExpanded, setIsExpanded }) => {
  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { to: "/admin/equipments", label: "Equipments", icon: <Package size={20} /> },
    { to: "/admin/bookings", label: "Bookings", icon: <ClipboardList size={20} /> },
    { to: "/admin/queries", label: "Queries", icon: <MessageCircle size={20} /> },
    { to: "/admin/categories", label: "Categories", icon: <Folder size={20} /> },
  ];


  const DesktopSidebar = () => (
    <div 
      className="bg-dark text-light h-100 d-flex flex-column transition-all shadow"
      style={{ 
        width: isExpanded ? "100%" : "4rem",
        transition: "width 0.3s ease-in-out",
        overflowX: "hidden" 
      }}
    >

      <div className="p-3 d-flex justify-content-between align-items-center border-bottom border-secondary">
        {isExpanded && <h5 className="m-0 text-light">Admin Panel</h5>}
        <Button 
          variant="outline-light" 
          size="sm"
          className="border-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>


      <Nav className="flex-column mt-3 w-100 sidebar-nav">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) => 
              `nav-link py-2 px-3 mb-2 mx-2 d-flex align-items-center rounded transition-all ${
                isActive ? "bg-primary text-white" : "text-light"
              } ${isExpanded ? "justify-content-start" : "justify-content-center"} sidebar-link`
            }
          >
            <span>{item.icon}</span>
            {isExpanded && <span className="ms-3">{item.label}</span>}
          </NavLink>
        ))}
      </Nav>
    </div>
    
  );
  return <DesktopSidebar />;
};

export default AdminSidebar;