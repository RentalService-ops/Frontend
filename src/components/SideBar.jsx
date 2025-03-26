const Sidebar = ({activeLink,setActiveLink,linkData,className}) => {
  const renderedLinks=linkData?.map((value)=>{
    return (
      <li key={value.label}>
        <a href="#" className={`nav-link d-flex ${activeLink===`${value.label}` ? 'active': 'text-white'}`} 
        onClick={()=>setActiveLink(`${value.label}`)}>
          <div className="me-2">
          {value.displayButton}
        </div>
          {value.label}
        </a>
      </li>
    );
  })
  return (
    <div className={`sticky-top d-flex flex-column flex-shrink-0 p-3 text-white bg-dark`} style={{width: "280px",height:"100vh",left:"0px"}}>
    <ul className="nav nav-pills flex-column mb-auto">
      {renderedLinks}
    </ul>
    <hr/>
  </div>
  );
};

export default Sidebar;
