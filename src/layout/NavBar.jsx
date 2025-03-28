//   import React from "react";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";

// const NavBar = () => {
//   const [cookies, , removeCookie] = useCookies(["jwtToken", "role"]);
//   const navigate = useNavigate();

//   function handleLogOut() {
//     removeCookie("jwtToken", { path: "/" });
//     removeCookie("role", { path: "/" });
//     navigate("/");
//     window.location.reload();
//   }

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light">
//       <div className="container"> {/* Ensures proper alignment */}
//         <a className="navbar-brand" href="/">Rental Service</a>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//           <span className="navbar-toggler-icon"></span>
//         </button>
        
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <a className="nav-link" href="/contact-us">Contact Us</a>
//             </li>
//             {cookies.jwtToken && (
//               <li className="nav-item">
//                 <a className="nav-link" href="/profile">Profile</a>
//               </li>
//             )}
//           </ul>

//           <div className="d-flex gap-2">
//             {cookies.jwtToken ? (
//               <button className="btn btn-outline-danger" onClick={handleLogOut}>Log Out</button>
//             ) : (
//               <>
//                 <button className="btn btn-outline-primary" onClick={() => navigate("/login")}>Log In</button>
//                 <button className="btn btn-outline-success" onClick={() => navigate("/register")}>Register</button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;



// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";

// const Navbar = ({ toggleSidebar }) => {
//   const [cookies, , removeCookie] = useCookies(["jwtToken", "role"]);
//   const navigate = useNavigate();

//   function handleLogOut() {
//     removeCookie("jwtToken", { path: "/" });
//     removeCookie("role", { path: "/" });
//     navigate("/");
//     window.location.reload();
//   }

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
//       <div className="container-fluid">
//         <button 
//           className="btn btn-outline-secondary me-2" 
//           type="button" 
//           onClick={toggleSidebar}
//           aria-label="Toggle sidebar"
//         >
//           <i className="bi bi-list"></i>
//         </button>
//         <Link className="navbar-brand" to="/">Rental Service</Link>
//         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//           <span className="navbar-toggler-icon"></span>
//         </button>
        
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav me-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/contact-us">Contact Us</Link>
//             </li>
//             {cookies.jwtToken && (
//               <li className="nav-item">
//                 <Link className="nav-link" to="/profile">Profile</Link>
//               </li>
//             )}
//           </ul>
          
//           <div className="d-flex gap-2">
//             {cookies.jwtToken ? (
//               <button className="btn btn-outline-danger" onClick={handleLogOut}>Log Out</button>
//             ) : (
//               <>
//                 <button className="btn btn-outline-primary" onClick={() => navigate("/login")}>Log In</button>
//                 <button className="btn btn-outline-success" onClick={() => navigate("/register")}>Register</button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


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
          onClick={toggleSidebar} // Ensure this works
          aria-label="Toggle sidebar"
        >
          <i className="bi bi-list"></i>
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
