import ReactDOM from "react-dom"
import "../styles/modal.css"
import axios from "axios"
import { useState } from "react";
import { useCookies } from "react-cookie";
function EditEquipmentForm({ notShow, values }) { //to add functionality to change image also
  const [cookie] = useCookies()
  const [formData, setFormData] = useState({
    name: values.name,
    description: values.description,
    imageUrl: values.imageUrl,
    quantity: values.quantity,
    pricePerDay: values.pricePerDay
  });

  async function handleClick() {
    console.log(formData)
    for (let keys in formData) {
      if(keys!== "imageUrl"   &&  !formData[keys] ) {
        alert("Please enter all the details!!");
        return;
      }
    }
    console.log(formData)
    console.log(values.equipmentId)
    try {
      await axios.patch("http://localhost:8080/api/equipment/editEquipment", {...formData,equipmentId:values.equipmentId}, {
        headers: {
          Authorization: `Bearer ${cookie.jwtToken}`
        }
        , withCredentials: true
      })
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      setFormData({})
      notShow(false);
    }
  }

  function handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value })
  }

  return ReactDOM.createPortal(
    <div>
      <div className="fixed inset-0 bg-gray-300 opacity-80" style={{ zIndex: 1050 }}></div>
      <div className="fixed inset-40 p-7 bg-white login-container" style={{ zIndex: 1060, height: "fit-content",top:"55px" }}>
        <h1>Edit Equipment Details : </h1>
        <input type="text" name="name" className="form-control mb-3" value={formData.name} onChange={handleChange} />
        <input type="number" name="quantity" className="form-control mb-3" value={formData.quantity} onChange={handleChange} />
        <input type="number" name="pricePerDay" className="form-control mb-3" value={formData.pricePerDay} onChange={handleChange} />
        <textarea name="description" className="form-control mb-3" id="exampleFormControlTextarea1" rows="3" required={true} onChange={handleChange} value={formData.description}></textarea>
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleClick}>Edit Details</button>
          <button className="btn btn-primary" onClick={() => notShow(false)}>Go back</button>
        </div>
      </div>
    </div>,
    document.querySelector(".modal-container")
  )

}

export default EditEquipmentForm;
