import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";

const MyNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["jwtToken"]);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthenticated = !!cookies.jwtToken; // Check if user is logged in

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    removeCookie("jwtToken", { path: "/" }); // Remove JWT cookie
    removeCookie("role", { path: "/" }); // Remove role cookie

    localStorage.removeItem("jwtToken"); // Remove from localStorage (if stored there)
    localStorage.removeItem("role"); // Remove from localStorage (if stored there)

    navigate("/"); // Redirect to index page
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`navbar-dark bg-dark transition ${isScrolled ? "bg-dark shadow" : "bg-transparent"}`}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to={isAuthenticated ? "/home" : "/"}
          className={location.pathname === "/profile" ? "text-primary fw-semibold" : "text-light"}
          >
          RentPro
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <Nav.Link
                as={Link}
                to="/profile"
                className={location.pathname === "/profile" ? "text-primary fw-semibold" : "text-light"}
              >
                Profile
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <Button variant="danger" onClick={handleLogout}>
                Log Out
              </Button>
            ) : (
              <>
                <Button variant="outline-light" as={Link} to="/login" className="me-2">
                  Sign In
                </Button>
                <Button variant="primary" as={Link} to="/signup">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
