import {React,useState} from 'react';
import Sidebar from "../components/SideBar"
import RentalDashboard from '../components/RentalDashboard';
import AddCategory from '../components/AddCategory';
import AddEquipment from '../components/AddEquipment'
import { FaHome } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineAppstore } from "react-icons/ai";
import Equipments from '../components/Equipments';
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
    else if(activeLink==="Equipments"){
      return <Equipments />
    }
  }
  const linkData=[
    {
      label:"Home",
      displayButton:<FaHome />
    },
    {
      label:"Add Category",
      displayButton:<IoAddCircleOutline />
    },
    {
      label:"Add Equipment",
      displayButton:<IoAddCircleOutline />
    },
    {
      label:"Equipments",
      displayButton:<AiOutlineAppstore />
    }
  ];
  return (
    <div className="d-flex " >
    <Sidebar setActiveLink={setActiveLink} activeLink={activeLink} linkData={linkData}/>
    {returnComponent()}
    </div>
  );
};

export default RentalHome;
