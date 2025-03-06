const Sidebar = ({activeLink,setActiveLink}) => {

  return (
    <div className="sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{width: "280px",height:"100vh",left:"0px"}}>
    <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
        <a href="#" className={`nav-link ${activeLink==="Home" ? 'active': 'text-white'}`} aria-current="page" onClick={()=>setActiveLink("Home")}>
          Home
        </a>
      </li>
      <li>
        <a href="#" className={`nav-link ${activeLink==="Add Category" ? 'active': 'text-white'}`}  onClick={()=>setActiveLink("Add Category")}>
          Add Category
        </a>
      </li>
      <li>
        <a href="#" className={`nav-link ${activeLink==="Add Equipment" ? 'active': 'text-white'}`}  onClick={()=>setActiveLink("Add Equipment")}>
          Add Equipment
        </a>
      </li>
    </ul>
    <hr/>
  </div>
  );
};

export default Sidebar;
