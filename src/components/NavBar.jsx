import React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [cookie, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  function handleLogOut() {
    console.log("Logged out");
    removeCookie("jwtToken");
    removeCookie("role");
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ms-2">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Rental Service</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Contact Us</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">Profile</a>
            </li>
          </ul>
          <button type="button" className="btn btn-outline-danger" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
