import { useState,useEffect } from "react";
import {useRef} from "react"
import axios from "axios"
import {useCookies} from "react-cookie"
import { jwtDecode } from "jwt-decode";
export default function AddEquipment(){
    const [cookie]=useCookies(['jwtToken'])

    const userId=jwtDecode(cookie.jwtToken).user_id;

    const [imageSrc,setImageSrc]=useState("")
    const [categories,setCategories]=useState([]);

    const fileRef=useRef()
    const selectValue=useRef()
    const name=useRef()
    const quantity=useRef()
    const price_per_day=useRef()
    const description=useRef()

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
 
    async function handleSubmit(){
        try{
            await axios.post("http://localhost:8080/api/equipment/addEquipment",{
                user:userId,
                name:name.current.value,
                description:description.current.value,
                quantity:quantity.current.value,
                pricePerDay:price_per_day.current.value,
                category: selectValue.current.value,
                image:imageSrc
            },
            {
              withCredentials:true,
              headers:{
                Authorization: `Bearer ${cookie.jwtToken}`,
                "Content-Type": "multipart/form-data"
              }
            })
            alert("Equipment added successfully.")
        }
        catch(err){
            console.log(err.message)
        }
    }

    function handleChange(){
        let file=fileRef.current.files[0];
        setImageSrc(URL.createObjectURL(file));
    }

    return (
        <div className="add-category-container">
            <h3 style={{ textAlign: "center" }}>Add a new Equipment</h3>
            <div className="mb-3">
                <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter Equipment name" ref={name} required />
            </div>
            <div className="mb-3">
                <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Enter Quantity of Product/Equipment" ref={quantity} required />
            </div>
            <div className="mb-3">
                <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="Enter price_per_day" ref={price_per_day} required />
            </div>
            <div className="mb-3">
                <textarea className="form-control" placeholder="Enter equipment description" id="exampleFormControlTextarea1" ref={description} rows="3" required></textarea>
            </div>
            <select ref={selectValue} className="form-select mb-3" aria-label="Default select example" defaultValue="selectCategory" required>
                <option value="selectCategory" disabled hidden>Please select category: </option>
                {
                    categories?.map((category) => {
                        console.log(category)
                        return (
                            <option value={`${category.categoryId}`}>{category.name}</option>
                        )
                    })}
            </select>
            <div className="mb-3">
                <input className="form-control" type="file" accept="image/*" ref={fileRef} onChange={handleChange} required />
                {imageSrc && <><h3>Uploaded file: </h3><br /><img src={imageSrc} alt="Uploaded" style={{ maxWidth: "100%", height: "auto" }} /></>}
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>Add Equipment</button>
        </div>
    )
}