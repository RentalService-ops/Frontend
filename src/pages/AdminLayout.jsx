import { Outlet } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useState } from "react";

export default function AdminLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="admin-layout bg-light">      
      <Container fluid className="p-0">
        <Row className="g-0">
          <Col lg={sidebarExpanded ? 2 : 1} className="p-0 position-relative">
            <AdminSidebar 
              isExpanded={sidebarExpanded} 
              setIsExpanded={setSidebarExpanded}
            />
          </Col>
          <Col 
            lg={sidebarExpanded ? 10 : 11} 
            xs={12} 
            className="p-0 transition-all"
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