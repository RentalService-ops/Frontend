import { useState,useEffect } from "react";
import {useRef} from "react"
import axios from "axios"
import {useCookies} from "react-cookie"
export default function AddEquipment(){
    const fileRef=useRef()
    const [imageSrc,setImageSrc]=useState("")
    const [categories,setCategories]=useState([]);
    const selectValue=useRef()
    const [cookie]=useCookies(['jwtToken'])
    console.log(cookie)

    useEffect(()=>{
        async function getCategories(){
        try{
            const response =await axios.get('http://localhost:8080/api/rental/getAllCategory', {
                headers: {
                  Authorization: `Bearer ${cookie.jwtToken}`
                },
                withCredentials: true,  // Ensure credentials (cookies) are sent with the request
              })
            //   console.log(response.data)
            setCategories(response.data)
        }
        catch(err){
            console.log(err);
        }
        }
        getCategories();
    },[])
 
    function handleSubmit(){

    }

    function handleChange(){
        let file=fileRef.current.files[0];
        setImageSrc(URL.createObjectURL(file));
    }

    return (
        <div className="add-category-container">
        <h3 style={{textAlign:"center"}}>Add a new Equipment</h3>
        <div className="mb-3">
        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Equipment name"/>
        </div>
        <div className="mb-3">
        <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Enter price_per_day"/>
        </div>
        <div className="mb-3">
        <textarea className="form-control" placeholder="Enter equipment description" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
        <select ref={selectValue} className="form-select mb-3" aria-label="Default select example" defaultValue="selectCategory">
            <option value="selectCategory" disabled hidden>Please select category: </option>
            {
            categories?.map((category)=>{
                console.log(category)
                return(
                    <option value={`${category.categoryId}`}>{category.name}</option>
                )
            })}
        </select>
        <div className="mb-3">
        <input className="form-control" type="file" accept="image/*" ref={fileRef} onChange={handleChange} required />
        {imageSrc && <><h3>Uploaded file: </h3><br /><img src={imageSrc} alt="Uploaded" style={{maxWidth:"100%",height:"auto"}} /></>}
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>Add Equipment</button>
    </div>
    )
}