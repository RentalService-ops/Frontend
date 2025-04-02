import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import EditForm from "./EditEquipmentForm";
import { jwtDecode } from "jwt-decode";
import AddEquipment from "./AddEquipment";
import Pagination from "./Pagination";
export default function Equipments() {
    const [cookie] = useCookies()
    const [editableValue, setEditableValue] = useState({})
    const [equipmentData, setEquipmentData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [imageUrls, setImageUrls] = useState({});
    const [showAddEquipment, setShowAddEquipment] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        async function fetchEquipmentData() {
            try {
                const response = await axios.get("http://localhost:8080/api/equipment/getEquipmentByUserId", {
                    headers: {
                        Authorization: `Bearer ${cookie.jwtToken}`
                    },
                    params: {
                        id: `${jwtDecode(cookie.jwtToken).user_id}`
                    },
                    withCredentials: true,
                    signal: signal
                })
                setEquipmentData(response.data);
                fetchImages(response.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchEquipmentData();
        return () => {
            controller.abort();
        }
    }
        , [])

    function handleAfterEdit(value) {
        const newData = equipmentData.map((equipment) => {
            if (equipment.equipmentId === value.equipmentId) {
                return value;
            }
            return equipment;
        })
        setEquipmentData(newData);
    }

    function handleEdit(value) {
        setEditableValue(value)
        setShowModal(!showModal)
        console.log(showModal)
    }
    async function handleDelete(id) {
        try {
            await axios.delete(`http://localhost:8080/api/equipment/deleteEquipment/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${cookie.jwtToken}`
                }
            })
            alert("Equipment deleted successfully");
            const response = await axios.get("http://localhost:8080/api/equipment/getEquipmentByUserId", {
                headers: {
                    Authorization: `Bearer ${cookie.jwtToken}`
                },
                params: {
                    id: `${jwtDecode(cookie.jwtToken).user_id}`
                },
                withCredentials: true
            })
            setEquipmentData(response.data);
        }
        catch (err) {
            console.log(err.message)
        }
    }

    // Fetch Images Function
    const fetchImages = async (data) => {
        const imageMap = {};
        await Promise.all(
            data.map(async (item) => {
                try {
                    const imageResponse = await axios.get(`http://localhost:8080/api/equipment/${item.imageUrl}`, {
                        headers: { Authorization: `Bearer ${cookie.jwtToken}` },
                        responseType: "blob",
                        withCredentials: true,
                    });
                    imageMap[item.imageUrl] = URL.createObjectURL(imageResponse.data);
                    console.log(imageMap)
                } catch {
                    imageMap[item.imageUrl] = "/defaultImage.png";
                }
            })
        );
        setImageUrls(imageMap);
    };

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = equipmentData.slice(indexOfFirstProduct, indexOfLastProduct);
    return (
        <div>
            {!showAddEquipment ? <>
                <div className="mb-5">
                    <button className="btn btn-primary position-absolute mb-5" style={{ right: "0px" }}
                        onClick={() => setShowAddEquipment(true)}>Add Equipment</button>

                    <Pagination data={equipmentData} currentPage={currentPage} setCurrentPage={setCurrentPage}
                        productsPerPage={productsPerPage} />
                </div>

                <div className="d-flex justify-content-evenly flex-wrap gap-3 equipment-container">
                    {currentProducts.map((value, index) => {
                        return (
                            <div className="card ms-1 mb-5" style={{ width: "20rem", height: "fit-content" }} key={index}>
                                <img src={imageUrls[value.imageUrl] || "/defaultImage.png"} className="card-img-top" alt="..." style={{ width: "100%", height: "auto" }} />
                                <div className="card-body p-1.5" >
                                    <h5 className="card-text">Name: {value.name}</h5>
                                    <p className="card-text">Price Per Day: {value.pricePerDay}</p>
                                    <p className="card-text">Quantity: {value.quantity}</p>
                                    <p className="card-text">Description: {value.description}</p>
                                    <div className="d-flex justify-content-between">
                                        <button className="btn btn-primary mb-0" onClick={() => handleEdit(value)}>Edit</button>
                                        <button className="btn btn-danger mb-0" onClick={() => handleDelete(value.equipmentId)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {showModal && <EditForm notShow={() => setShowModal(!showModal)} values={editableValue} handleAfterEdit={handleAfterEdit} />
                }</> : <AddEquipment setShowAddEquipment={setShowAddEquipment} />}
        </div>
    );
}