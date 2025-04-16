import { useState } from "react";
import UserDashboard from "../components/UserDashboard";
import OrderPage from "./OrderPage";
import { FaHome } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import Sidebar from "../layout/SideBar";
import NotificationPage from "../components/NotificationPage";

export default function UserHome({isSidebarOpen}) {
  const [activeLink, setActiveLink] = useState(localStorage.getItem("state") || "Home");

  const renderComponent = () => {
    switch (activeLink) {
      case "Home":
        return <UserDashboard />;
      case "My Orders":
        return <OrderPage />;
        case "Notification":
        return <NotificationPage />;
      default:
        return <UserDashboard />;
    }
  };

  const linkData = [
    { label: "Home", displayButton: <FaHome /> },
    { label: "My Orders", displayButton: <IoAddCircleOutline /> },
    { label: "Notification", displayButton: <IoAddCircleOutline /> },

  ];

  return (
    <div className="d-flex flex-column min-vh-100">
  <div className="d-flex flex-grow-1 h-100">
    <Sidebar isOpen={isSidebarOpen} linkData={linkData} activeLink={activeLink} setActiveLink={setActiveLink} />
    <div className="flex-grow-1 p-3">{renderComponent()}</div>
  </div>
</div>


  );
}

