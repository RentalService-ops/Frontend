import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Navbar = ({ toggleSidebar }) => {
  const [cookies, , removeCookie] = useCookies(["jwtToken", "role"]);
  const navigate = useNavigate();

  function handleLogOut() {
    removeCookie("jwtToken", { path: "/" });
    removeCookie("role", { path: "/" });
    navigate("/");
    window.location.reload();
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button 
          className="btn btn-outline-secondary me-2" 
          type="button" 
          onClick={toggleSidebar} 
          aria-label="Toggle sidebar"
        >
          <i className="bi bi-list"><img src="hamburger.png" style={{height:"auto",width:"25px"}}/></i>
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
          
          <div className="d-flex gap-2">
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
