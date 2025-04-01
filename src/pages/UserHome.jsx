import { useState } from "react";
import UserDashboard from "../components/UserDashboard";
import OrderPage from "../components/OrderPage";
import { FaHome } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import Sidebar from "../components/SideBar";

export default function UserHome({isSidebarOpen}) {
  const [activeLink, setActiveLink] = useState("Home");

  const renderComponent = () => {
    switch (activeLink) {
      case "Home":
        return <UserDashboard />;
      case "My Orders":
        return <OrderPage />;
      default:
        return <UserDashboard />;
    }
  };

  const linkData = [
    { label: "Home", displayButton: <FaHome /> },
    { label: "My Orders", displayButton: <IoAddCircleOutline /> },
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

