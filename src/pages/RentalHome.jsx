import {React,useState} from 'react';
import Sidebar from "../layout/SideBar"
import RentalDashboard from '../components/RentalDashboard';
import { FaHome } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineAppstore } from "react-icons/ai";
import Equipments from '../components/Equipments';
import Categories from '../components/Categories';
const RentalHome = ({isSidebarOpen}) => {
  const [activeLink,setActiveLink]=useState("Home");
  function returnComponent(){
    if(activeLink==="Home"){
      return <RentalDashboard />
    }
    else if(activeLink==="My Categories"){
      return <Categories />
    }
    else if(activeLink==="My Equipments"){
      return <Equipments />
    }
  }
  const linkData=[
    {
      label:"Home",
      displayButton:<FaHome />
    },
    {
      label:"My Categories",
      displayButton:<IoAddCircleOutline />
    },
    {
      label:"My Equipments",
      displayButton:<AiOutlineAppstore />
    }
  ];
  return (
    <div className="d-flex flex-column min-vh-100">
    <div className="d-flex flex-grow-1 h-100">
    <Sidebar isOpen={isSidebarOpen} linkData={linkData} activeLink={activeLink} setActiveLink={setActiveLink} />
      <div className="flex-grow-1 p-3">{returnComponent()}</div>
    </div>
  </div>
  );
};

export default RentalHome;
