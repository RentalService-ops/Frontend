const Sidebar = ({ activeLink, setActiveLink, linkData, isOpen }) => {
  const renderedLinks = linkData?.map((value) => (
    <li key={value.label}>
      <a
        href="#"
        className={`nav-link d-flex ${activeLink === value.label ? "active" : "text-white"}`}
        onClick={() => {
          setActiveLink(value.label);
          localStorage.setItem("state",value.label);
        }}
      >
        <div className="me-2">{value.displayButton}</div>
        {value.label}
      </a>
    </li>
  ));

  return (
    <div
      className={`bg-dark text-white p-3 ${isOpen ? 'sticky-top' : 'position-fixed'}`}
      style={{
        width: "280px",
        height: "100vh",
        left: isOpen ? "0px" : "-280px", // Hide sidebar by shifting it left
        transition: "left 0.3s ease-in-out", // Smooth transition
        zIndex: 1060, // Ensure it's above other elements
      }}
    >
      <ul className="nav nav-pills flex-column mb-auto">{renderedLinks}</ul>
      <hr />
    </div>
  );
};

export default Sidebar;
