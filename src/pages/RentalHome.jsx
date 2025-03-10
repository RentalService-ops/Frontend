import {React,useState} from 'react';
import Sidebar from "../components/SideBar"
import NavBar from "../components/NavBar"
import RentalDashboard from '../components/RentalDashboard';
import AddCategory from '../components/AddCategory';
import AddEquipment from '../components/AddEquipment'
import Footer from "../components/Footer"
const RentalHome = () => {
  const [activeLink,setActiveLink]=useState("Home");
  function returnComponent(){
    if(activeLink==="Home"){
      return <RentalDashboard />
    }
    else if(activeLink==="Add Category"){
      return <AddCategory />
    }
    else if(activeLink==="Add Equipment"){
      return <AddEquipment />
    }
  }
  return (
    <div className="d-flex flex-column">
    <NavBar />
    <div className="d-flex justify-content-evenly" >
    <Sidebar setActiveLink={setActiveLink} activeLink={activeLink}/>
    {returnComponent()}
    </div>
    <Footer />
    </div>
  );
};

export default RentalHome;
