import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { jwtDecode } from "jwt-decode";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Navbar = ({ toggleSidebar }) => {
  const [cookies, , removeCookie] = useCookies(["jwtToken", "role"]);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const stompClientRef = useRef(null);

  let userId = null;
  let userRole = null;

  if (cookies.jwtToken) {
    try {
      const decoded = jwtDecode(cookies.jwtToken);
      userId = decoded.user_id;
      userRole = decoded.role; // ✅ Extract role
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  const handleLogOut = () => {
    removeCookie("jwtToken", { path: "/" });
    removeCookie("role", { path: "/" });
    localStorage.removeItem("state");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    if (cookies.jwtToken && userId && userRole === "user") {
      const socket = new SockJS("http://localhost:8080/ws");
      const client = over(socket);

      client.connect({}, () => {
        console.log("Connected to WebSocket");

        client.subscribe(`/topic/booking/${userId}`, (message) => {
          const parsedMessage = JSON.parse(message.body);
          const newMessage = parsedMessage.message;

          setNotifications((prev) =>
            !prev.includes(newMessage) ? [...prev, newMessage] : prev
          );
        });
      }, (error) => {
        console.error("WebSocket connection error:", error);
      });

      stompClientRef.current = client;

      return () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
          stompClientRef.current.disconnect();
        }
      };
    }
  }, [cookies.jwtToken, userId, userRole]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button
          className="btn btn-outline-secondary me-2"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i><img src="hamburger.png" style={{height:"auto",width:"25px"}}/></i>
        </button>

        <Link className="navbar-brand" to="/">Rental Service</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/contact-us">Contact Us</Link>
            </li>
            {cookies.jwtToken && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
            )}
          </ul>

          <div className="d-flex gap-2 align-items-center">
            {/* ✅ Show bell only for role=user */}
            {cookies.jwtToken && userRole === "user" && (
              <div className="dropdown me-3 position-relative">
                <button
                  className="btn btn-outline-secondary position-relative"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <i className="bi bi-bell"></i>
                  {notifications.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {dropdownOpen && (
                  <div
                    className="position-absolute end-0 mt-2 p-2 bg-white shadow rounded"
                    style={{
                      zIndex: 1050,
                      minWidth: "280px",
                      maxHeight: "300px",
                      overflowY: "auto",
                      right: 0
                    }}
                  >
                    {notifications.length === 0 ? (
                      <span className="dropdown-item text-muted">No notifications</span>
                    ) : (
                      <>
                        {notifications.map((note, index) => (
                          <div
                            key={index}
                            className="dropdown-item text-wrap d-flex align-items-start gap-2 py-2"
                          >
                            <i className="bi bi-info-circle text-primary"></i>
                            <span>{note}</span>
                          </div>
                        ))}
                        <div className="dropdown-divider my-2"></div>
                        <button
                          className="btn btn-sm btn-outline-danger w-100"
                          onClick={() => setNotifications([])}
                        >
                          Clear All
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {cookies.jwtToken ? (
              <button className="btn btn-outline-danger" onClick={handleLogOut}>Log Out</button>
            ) : (
              <>
                <button className="btn btn-outline-primary" onClick={() => navigate("/login")}>Log In</button>
                <button className="btn btn-outline-success" onClick={() => navigate("/register")}>Register</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
