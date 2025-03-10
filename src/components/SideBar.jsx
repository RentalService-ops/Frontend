import { FaHome } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

const Sidebar = ({ activeLink, setActiveLink }) => {
  return (
    <div
      className="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "280px", height: "100vh", left: "0px" }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <a
            href="#"
            className={`nav-link d-flex ${activeLink === "Home" ? "active" : "text-white"}`}
            aria-current="page"
            onClick={() => setActiveLink("Home")}
          >
            <div className="me-2">
              <FaHome />
            </div>
            Home
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`nav-link d-flex ${activeLink === "Add Category" ? "active" : "text-white"}`}
            onClick={() => setActiveLink("Add Category")}
          >
            <div className="me-2">
              <IoAddCircleOutline />
            </div>
            Add Category
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`nav-link d-flex ${activeLink === "Add Equipment" ? "active" : "text-white"}`}
            onClick={() => setActiveLink("Add Equipment")}
          >
            <div className="me-2">
              <IoAddCircleOutline />
            </div>
            Add Equipment
          </a>
        </li>
      </ul>
      <hr />
    </div>
  );
};

export default Sidebar;
