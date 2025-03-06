import axios from "axios"
import {useRef, useState} from "react"
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
export default function AddCategory(){
    const [cookies]=useCookies(['jwtToken']);
    const userId=jwtDecode(cookies.jwtToken).user_id;
    console.log(userId);
    const categoryName=useRef('');
    const categoryDescription=useRef('');
    const [showErrorMsg,setShowErrorMsg]=useState(false);
    async function handleSubmit(event){
        event.preventDefault();
        if(!categoryName.current.value){
            setShowErrorMsg(true);
            return;
        }
        console.log(categoryName.current.value+" "+categoryDescription.current.value)
        try{
            const response=await axios.post("http://localhost:8080/renter/addCategory",{
                user:userId,
                categoryName:categoryName.current.value,
                categoryDescription:categoryDescription.current.value
            },{withCredentials:true})

            console.log(response.data)

            categoryDescription.current.value="";
            categoryName.current.value="";

            alert("category added!")
        }
        catch(err){
            console.log(err)
        }
    }

    return( 
        <>
    <div className="add-category-container">
        <h3 style={{textAlign:"center"}}>Add a new Category</h3>
        <div className="mb-3">
        <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Enter category name" ref={categoryName}/>
        </div>
        <div className="mb-3">
        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" ref={categoryDescription}></textarea>
        </div>
        {showErrorMsg && <p style={{color:"red"}}>Please enter Category Name!!</p>}
        <button className="btn btn-primary" onClick={handleSubmit}>Add Category</button>
    </div>
    </>
    )
}