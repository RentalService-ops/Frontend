import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function EmailVerification(){
    const [emailValue,setEmailValue]=useState("");
    const navigate=useNavigate();

    async function handleClick(){
        try{
        await axios.get(`http://localhost:8080/otp`,{
            params:{
                useremail:emailValue
            }
        });
        alert("We have send OTP to your email address for verification.");
        localStorage.setItem("email",emailValue);
        setEmailValue("")
        navigate("/forgot-password")
    }
    catch(err){
        console.log(err.message);
    }
    }

    return(
        <div style={{height:"80vh"}}>
        <div className="login-container">
                    <div className="form-group mb-3">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                placeholder="Enter your mail"
                                className="input-field"
                                value={emailValue}
                                required
                                onChange={(e)=>setEmailValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleClick}>Send</button>
        </div>
        </div>
    )
}