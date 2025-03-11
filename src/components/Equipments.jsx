import { useState,useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import EditForm from "./EditEquipmentForm";
import { jwtDecode } from "jwt-decode";
export default function Equipments(){
   const [cookie]=useCookies()
   const [editableValue,setEditableValue]=useState({})
   const data=[
    {
        name:"One",
        description:"This is equipment",
        imageSrc:"Src1",
        quantity:"40",
        pricePerDay:"40"
    },
    {
        name:"Two",
        description:"This is equipment2",
        imageSrc:"Src2",
        quantity:"50",
        pricePerDay:"60"
    },
    {
        name:"One",
        description:"This is equipment",
        imageSrc:"Src1",
        quantity:"40",
        pricePerDay:"40"
    },
    {
        name:"One",
        description:"This is equipment",
        imageSrc:"Src1",
        quantity:"40",
        pricePerDay:"40"
    },
    {
        name:"One",
        description:"This is equipment",
        imageSrc:"Src1",
        quantity:"40",
        pricePerDay:"40"
    },
    {
        name:"One",
        description:"This is equipment",
        imageSrc:"Src1",
        quantity:"40",
        pricePerDay:"40"
    }
   ]
   const [equipmentData,setEquipmentData]=useState(data);
   const [showModal,setShowModal]=useState(false);

   useEffect(()=>{
    async function fetchEquipmentData(){
        try{
        const response=await axios.get("http://localhost:8080/api/equipment/getEquipmentByUserId",{
            headers:{
                Authorization:`Bearer ${cookie.jwtToken}`
            },
            params:{
                id:`${jwtDecode(cookie.jwtToken).user_id}`
            },
            withCredentials:true
        })
        setEquipmentData(response.data);
        }
        catch(err){
            console.log(err.message);
        }
    }
    fetchEquipmentData();
   }
   ,[])

   function handleEdit(value){
    setEditableValue(value)
    setShowModal(!showModal)
    console.log(showModal)
   }
   async function handleDelete(id){
    // alert("delete clicked");
    try{
        await axios.delete(`http://localhost:8080/api/equipment/deleteEquipment/${id}`,{
            withCredentials:true,
            headers:{
                Authorization:`Bearer ${cookie.jwtToken}`
            }
        })
        alert("Equipment deleted successfully");
        const response=await axios.get("http://localhost:8080/api/equipment/getEquipmentByUserId",{
            headers:{
                Authorization:`Bearer ${cookie.jwtToken}`
            },
            params:{
                id:`${jwtDecode(cookie.jwtToken).user_id}`
            },
            withCredentials:true
        })
        setEquipmentData(response.data);
    }
    catch(err){
        console.log(err.message)
    }
   }
    return(
        <div className="d-flex flex-wrap gap-3 equipment-container">
        {equipmentData.map((value,index)=>{
            return(
                <div className="card ms-1 mb-5" style={{width: "20rem",height:"fit-content"}} key={index}>
                    <img src="GetImage.png" className="card-img-top" alt="..." style={{width:"100%",height:"auto"}}/>
                        <div className="card-body p-1.5" >
                            <h5 className="card-text">Name: {value.name}</h5>
                            <p className="card-text">Price Per Day: {value.pricePerDay}</p>
                            <p className="card-text">Quantity: {value.quantity}</p>
                            <p className="card-text">Description: {value.description}</p>
                            <div className="d-flex justify-content-between">
                            <button className="btn btn-primary mb-0" onClick={()=>handleEdit(value)}>Edit</button>
                            <button className="btn btn-danger mb-0" onClick={()=>handleDelete(value.equipmentId)}>Delete</button>
                            </div>
                        </div>
                </div>
            )
        })}
        {showModal && <EditForm notShow={()=>setShowModal(!showModal)} values={editableValue}/>}
        </div>
    );
}