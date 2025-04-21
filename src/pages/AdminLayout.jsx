import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      if (mobile) setSidebarExpanded(false);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout bg-light">      
      <Container fluid className="p-0">
        <Row className="g-0" style={{ minHeight: "calc(100vh - 56px)" }}>
          {/* Sidebar */}
          <Col lg={sidebarExpanded ? 2 : 1} className="p-0 position-relative">
            <AdminSidebar 
              isExpanded={sidebarExpanded} 
              setIsExpanded={setSidebarExpanded}
              isMobile={isMobile}
              showMobile={showMobileNav}
              setShowMobile={setShowMobileNav}
            />
          </Col>
          
          {/* Main Content */}
          <Col 
            lg={sidebarExpanded ? 10 : 11} 
            xs={12} 
            className="p-0 transition-all"
            style={{
              marginLeft: isMobile ? 0 : "auto",
            }}
          >
            <div className="admin-content bg-light min-vh-100 p-3">
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}