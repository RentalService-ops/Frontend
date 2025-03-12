import { jwtDecode } from "jwt-decode"
import { useCookies } from "react-cookie"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Profile() {

    const [profileDetails, setProfileDetails] = useState({})
    const [editProfile, setEditProfile] = useState(false);
    const [formData,setFormData]=useState({})
    const [cookie] = useCookies()
    const role = cookie.role;
    const userId = jwtDecode(cookie.jwtToken).user_id

    useEffect(() => {
        async function fetchProfileDetails() {
            try {
                const response = await axios.get(`http://localhost:8080/api/${role}/getRenter`, {
                    params: {
                        id: `${userId}`
                    },
                    headers: {
                        Authorization: `Bearer ${cookie.jwtToken}`
                    },
                    withCredentials: true
                })
                setProfileDetails(response.data);
            }
            catch (err) {
                console.log(err.message);
            }
        }
        fetchProfileDetails();
    }, [])

    function handleChange(event){
        setFormData({...formData,[event.target.name]:event.target.value})
    }

    async function handleClick() {
        for(let key in formData){
            if(!formData[key]){
                alert("please fill all the details!!!")
                return;
            }
        }
        try { 
            const response=await axios.post(`http://localhost:8080/api/${role}/updateRenter`,formData,{
                withCredentials:true,
                headers:{
                    Authorization:`Bearer ${cookie.jwtToken}`
                },
                params:{
                    id:`${userId}`
                }
            })
            setProfileDetails(response.data);
            setEditProfile(false);
        }
        catch (err) {
            console.log(err.stack)
        }
    }

    return (
        <>{profileDetails ? <>{!editProfile ?
            <section style={{ backgroundColor: "#eee", height: "80vh" }}>
                <div className="row d-flex align-items-center justify-content-center text-center">
                    <div className="col-lg-8">
                        <div className="card mb-4">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Full Name</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{profileDetails.username}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Email</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{profileDetails.email}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Phone</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{profileDetails.phoneNo ||
                                            "None"}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Address</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{profileDetails.address || "None"}</p>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center align-items-center mt-3">
                                    <button className="btn btn-primary" onClick={() =>{ 
                                    setEditProfile(true);
                                    setFormData(profileDetails)
                                    }}>Edit Profile</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> :
            <div style={{ height: "80vh" }}>
                <div className="login-container" >
                    <div className="mb-3">
                        <label>Name: </label>
                        <input
                            type="text"
                            className="form-control"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                    <label>Email: </label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                    <label>PhoneNo: </label>
                    <input type="tel" 
                    className="form-control" 
                    name="phoneNo" 
                    value={formData.phoneNo}
                    placeholder="eg-9999999999"
                    pattern="[0-9]{10}" 
                    onChange={handleChange}/>
                    </div>

                    <div className="mb-3">
                    <label>Address: </label>
                    <input type="textarea" 
                    className="form-control" 
                    name="address" 
                    onChange={handleChange} 
                    value={formData.address}/>
                    </div>
                    <div className="d-flex justify-content-between">
                    <button className="btn btn-primary" onClick={handleClick}>Edit Profile</button>
                    <button className="btn btn-primary" onClick={()=>setEditProfile(false)}>Go Back</button>
                    </div>
                </div>
            </div>
        }</>
            : <>Unable to fetch Details</>}
        </>
    )
}