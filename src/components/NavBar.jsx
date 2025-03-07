import React from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
const NavBar = () => {
  const [cookie,setCookie,removeCookie]=useCookies();
  
  const navigate=useNavigate();

  function handleLogOut(){
    console.log("logged out")
    removeCookie("jwtToken");
    removeCookie("role")
    navigate("/login")
  }

  return (
<nav className="navbar navbar-expand-lg navbar-light bg-light ms-2">
    <a className="navbar-brand" href="#">Rental Service</a>
      <ul className="navbar-nav me-auto"> {/* me-auto aligns navbar items to the left */}
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Contact Us</a>
        </li>
        <li className="nav-item">
          <a className="nav-link active" aria-current="page" href="#">Profile</a>
        </li>
      </ul>

    {/* Log Out button on the right */}
    <div className="d-flex">
      <button type="button" className="btn btn-outline-danger" onClick={handleLogOut}>Log Out</button>
    </div>
</nav>

  

  );
};

export default NavBar;
