import "../styles/Auth.css"
import {useRef,useState} from "react";
import axios from "axios";

export default function Register(){
    const username=useRef("");
    const password=useRef("");
    const confirmPassword=useRef("");
    const email=useRef("");
    const phoneNo=useRef("");
    const role=useRef("");

    const [toggleErrorMsg,setErrorMsg]=useState(false);

    async function handleSubmit(event){
        event.preventDefault();
        if(password.current.value!==confirmPassword.current.value){
            setErrorMsg(true);
        }
        else{
            setErrorMsg(false);
            try{
                const response=await axios.post("http://localhost:8080/register",{
                    username:username.current.value,
                    password:password.current.value,
                    email:email.current.value,
                    confirmPassword:confirmPassword.current.value,
                    phoneNo:phoneNo.current.value,
                    role:role.current.value
                })
            }
            catch(err){
                console.log(err);
            }
        }
        username.current.value="";
        email.current.value="";
        password.current.value="";
        confirmPassword.current.value="";
        phoneNo.current.value="";
        role.current.value="";
    }

    return (
<section className="h-100 gradient-custom body-container">
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div className="card bg-dark text-white" style={{borderRadius:"1rem"}}>
          <div className="card-body p-5 text-center">

            <form onSubmit={handleSubmit} className="mb-2 md-5 mt-2 md-4 pb-2">

              <h2 className="fw-bold mb-2 ">Sign Up</h2>
              <p className="text-white-50 mb-5">Register with our application</p>
                
                {toggleErrorMsg && <div className="mb-4" style={{backgroundColor:"pink",color:"red"}}>Passwords do not match!</div>}

              <div className="form-outline form-white mb-4">
                <input type="text" placeholder="Username: " className="form-control form-control-md" ref={username} required/>
              </div>

              <div className="form-outline form-white mb-4">
                <input type="email" placeholder="Email: " className="form-control form-control-md" ref={email} required/>
              </div>

              <div className="form-outline form-white mb-4">
                <input type="password"  placeholder="Password: " className="form-control form-control-md" ref={password} required/>
              </div>

              <div className="form-outline form-white mb-4">
                <input type="password"  placeholder="Confirm Password: " className="form-control form-control-md" ref={confirmPassword} required/>
              </div>

              <div className="form-outline form-white mb-4">
                <input type="tel"  placeholder="Phone No: " className="form-control form-control-md" pattern="[0-9]{9}" ref={phoneNo} required/>
              </div>

              <select className="form-select mb-4" required ref={role}>
                <option value="" hidden disabled selected>Please select your role: </option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>

              <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5" type="submit">Register</button>

            </form>

            <div>
              <p className="mb-0">Have an account? <a href="#!" className="text-white-50 fw-bold">Sign in</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    );
}