import { useState } from "react"
import axios from "axios"
export default function ContactUs() {
    const [queryData,setQueryData]=useState({
        username:"",
        useremail:"",
        query:""
    });

    async function handleSubmit(){
        try{
            await axios.post("http://localhost:8080/contact",queryData,{withCredentials:true})
            alert("your query is posted. We will resolve it soon.")
            setQueryData({
                username:"",
                useremail:"",
                query:""
            })
        }
        catch(err){
            console.log(err.message)
        }
    }

    function handleChange(event){
        const name=event.target.name;
        const value=event.target.value;

        setQueryData({...queryData,[name]:value})
    }

    return (
        <div style={{ height: "80vh" }}>
            <div className="login-container">
                <h2 style={{textAlign:"center"}}>Contact Us</h2>
                <div className="mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Enter your email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com" name="useremail" value={queryData.useremail} onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlInput2" className="form-label">Enter your Name</label>
                    <input type="text" className="form-control" id="exampleFormControlInput2" placeholder="eg- John Doe" value={queryData.username} name="username" onChange={handleChange}/>
                </div>
                <div className="mb-3">
                    <label for="exampleFormControlTextarea1" className="form-label">Enter your message</label>
                    <textarea className="form-control" name="query" id="exampleFormControlTextarea1" placeholder="Short Description of your query" rows="3" value={queryData.query} onChange={handleChange}></textarea>
                </div>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    )
}