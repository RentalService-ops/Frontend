import {useState } from "react";
import SideBar from "../components/SideBar"
import UserDashboard from "../components/UserDashboard";
import OrderPage from "../components/OrderPage"
import { FaHome } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

export default function HomePage() {

  const [activeLink,setActiveLink]=useState("Home");
  function returnComponent(){
    if(activeLink==="Home"){
      return <UserDashboard />
    }
    else if(activeLink==="My Orders"){
      return <OrderPage />
    }
  }

    const linkData=[
      {
        label:"Home",
        displayButton:<FaHome />
      },
      {
        label:"My Orders",
        displayButton:<IoAddCircleOutline />
      }
    ];

 
  return (
    <div className="d-flex">
      <SideBar setActiveLink={setActiveLink} activeLink={activeLink} linkData={linkData}/>
      <div>
      {returnComponent()}
      </div>
    </div>
  );
}
