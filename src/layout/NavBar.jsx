import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [cookies, , removeCookie] = useCookies(["jwtToken", "role"]);
  const navigate = useNavigate();

  function handleLogOut() {
    console.log("Logged out");
    removeCookie("jwtToken", { path: "/" });
    removeCookie("role", { path: "/" });

    navigate("/"); // Redirect to home page after logout
    window.location.reload(); // Force navbar to update
  }

  function handleLogIn() {
    navigate("/login");
  }

  function handleRegister() {
    navigate("/register");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ms-2">
      <a className="navbar-brand" href="/">Rental Service</a>
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <a className="nav-link active" href="/contact-us">Contact Us</a>
        </li>
        {cookies.jwtToken && (
          <li className="nav-item">
            <a className="nav-link active" href="/profile">Profile</a>
          </li>
        )}
      </ul>

      {cookies.jwtToken ? (
        <div className="d-flex">
          <button type="button" className="btn btn-outline-danger" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      ) : (
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-primary" onClick={handleLogIn}>
            Log In
          </button>
          <button type="button" className="btn btn-outline-success" onClick={handleRegister}>
            Register
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
