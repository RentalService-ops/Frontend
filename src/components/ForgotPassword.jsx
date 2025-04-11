import { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios"
export default function ForgotPassword() {
    const [showSetPassword, setShowSetPassword] = useState(false);
    const [enteredOTPValue,setEnteredOTPValue]=useState("");
    const navigate=useNavigate();

    const [resetPassword,setResetPassword]=useState("");
    const [confirmResetPassword,setConfirmResetPassword]=useState("");

    async function handleClick(){
        console.log(enteredOTPValue)
        try{
            const response=await axios.post(`http://localhost:8080/verify-otp`,{
                email:`${localStorage.getItem("email")}`,
                sentOTP:enteredOTPValue
            })

            if(response.data==="OTP verified"){
                setShowSetPassword(true);
            }
        }
        catch(err){
            if(err.response?.status===401){
                alert("Wrong OTP Entered!!");
                localStorage.removeItem("email");
                navigate("/verify-email");
            }
            console.log(err)
        }
        finally{
            setEnteredOTPValue("")
        }
    }

    async function handleResetPassword(){
        const passwordPattern= /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if(resetPassword.length < 8){
            alert("Password must contain at least 8 characters.");
            setConfirmResetPassword("");
            setResetPassword("");
        }
        else if(!passwordPattern.test(resetPassword)){
            alert("Password should contain at lease one uppercase character, at least one number and at least one special character.");
            setConfirmResetPassword("");
            setResetPassword("");
        }
        else if(resetPassword !== confirmResetPassword){
            alert("Passwords should match.");
            setResetPassword("");
            setConfirmResetPassword("");
        }
        else{
                try{
                    await axios.post(`http://localhost:8080/reset-password`,{
                        email:`${localStorage.getItem("email")}`,
                        resetPassword:resetPassword
                    })
                    setResetPassword("");
                    setConfirmResetPassword("");
                    localStorage.removeItem("email");
                    alert("Your password has been reset.");
                    navigate("/login");
                }
                catch(err){
                    console.log(err.message);
                }   
        }
    }

    return (
        <div style={{ height: "80vh" }}>
            {showSetPassword ?
                <div className="login-container">
                    <h1>Reset Password</h1>
                    <div className="form-group mb-3">
                        <div className="input-wrapper">
                            <label>Enter new password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={resetPassword}
                                required
                                onChange={(e)=>setResetPassword(e.target.value)}
                            />
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                className="input-field"
                                value={confirmResetPassword}
                                required
                                onChange={(e)=>setConfirmResetPassword(e.target.value)}
                            />
                            <br />
                            <button className="btn btn-primary" onClick={handleResetPassword}>Reset Password</button>
                        </div>
                    </div>
                </div> :
                <div className="login-container">
                    <h1>OTP Verification</h1>
                    <div className="form-group mb-3">
                        <div className="input-wrapper">
                            <input
                                type="number"
                                placeholder="Enter your OTP"
                                className="input-field"
                                value={enteredOTPValue}
                                required
                                onChange={(e)=>setEnteredOTPValue(e.target.value)}
                            />
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={handleClick}>Verify</button>
                </div>
            }
        </div>
    )
}