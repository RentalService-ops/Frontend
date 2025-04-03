import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import AddEquipment from "./AddEquipment";
import Pagination from "./Pagination";
import { Modal, Button } from "react-bootstrap";

export default function Equipments() {
    const [cookie] = useCookies();
    const [equipmentData, setEquipmentData] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [showAddEquipment, setShowAddEquipment] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 7;

    // Modal States
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [editedEquipment, setEditedEquipment] = useState(null);

    useEffect(() => {
        async function fetchEquipmentData() {
            try {
                const response = await axios.get("http://localhost:8080/api/equipment/getEquipmentByUserId", {
                    headers: { Authorization: `Bearer ${cookie.jwtToken}` },
                    params: { id: `${jwtDecode(cookie.jwtToken).user_id}` },
                    withCredentials: true
                });

                setEquipmentData(response.data);
                fetchImages(response.data);
            } catch (err) {
                console.error("Error fetching equipment:", err);
            }
        }

        fetchEquipmentData();
    }, [cookie]);

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
                } catch {
                    imageMap[item.imageUrl] = "/defaultImage.png";
                }
            })
        );
        setImageUrls(imageMap);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this equipment?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/equipment/deleteEquipment/${id}`, {
                headers: { Authorization: `Bearer ${cookie.jwtToken}` },
                withCredentials: true
            });

            alert("Equipment deleted successfully");
            setEquipmentData(equipmentData.filter(item => item.equipmentId !== id));
            setShowDetailModal(false);
        } catch (err) {
            console.error("Error deleting equipment:", err.message);
        }
    };

    const handleEdit = (equipment) => {
        setEditedEquipment({ ...equipment, imagePreview: imageUrls[equipment.imageUrl] || "/defaultImage.png" });
        setShowDetailModal(false);
        setShowEditModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedEquipment({ ...editedEquipment, imagePreview: reader.result, imageFile: file });
            };
            reader.readAsDataURL(file);
        }
    };



    const handleSaveEdit = async () => {
        if (!editedEquipment.equipmentId) {
            alert("Equipment ID is missing.");
            return;
        }
    
        const equipmentJson = JSON.stringify({
            equipmentId: editedEquipment.equipmentId,
            name: editedEquipment.name,
            pricePerDay: editedEquipment.pricePerDay,
            quantity: editedEquipment.quantity,
            description: editedEquipment.description,
        });
    
        const formDataToSend = new FormData();
        formDataToSend.append("equipmentDTO", new Blob([equipmentJson], { type: "application/json" }));
    
        // Ensure imageFile is sent correctly
        if (editedEquipment.imageFile) {
            formDataToSend.append("imageFile", editedEquipment.imageFile);
        }
    
        try {
            const response = await axios.patch(
                "http://localhost:8080/api/equipment/editEquipment",
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${cookie.jwtToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
    
            setEquipmentData(
                equipmentData.map((equip) =>
                    equip.equipmentId === response.data.equipmentId ? response.data : equip
                )
            );
            setShowEditModal(false);
        } catch (err) {
            console.error("❌ Error updating equipment:", err);
            alert(err.response?.data?.message || "Failed to update equipment.");
        }
    };
    
    
    

    return (
        <div className="d-flex flex-column" style={{ height: "100vh" }}>
            {!showAddEquipment ? (
                <>
                    <div className="mb-3 d-flex justify-content-between">
                        <button className="btn btn-primary" onClick={() => setShowAddEquipment(true)}>Add Equipment</button>
                    </div>
    
                    {/* Content Wrapper to Grow */}
                    <div className="d-flex flex-column flex-grow-1">
                        <div className="table-responsive flex-grow-1">
                            <table className="table table-hover table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Image</th>
                                        <th>Name</th>
                                        <th>Price Per Day</th>
                                        <th>Quantity</th>
                                        <th>Description</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipmentData.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map((equip, index) => (
                                        <tr key={equip.equipmentId}>
                                            <td>{index + 1}</td>
                                            <td><img src={imageUrls[equip.imageUrl] || "/defaultImage.png"} alt="equipment" style={{ width: "50px", height: "50px" }} /></td>
                                            <td>{equip.name}</td>
                                            <td>${equip.pricePerDay}</td>
                                            <td>{equip.quantity}</td>
                                            <td>{equip.description}</td>
                                            <td>
                                                <button className="btn btn-info" onClick={() => { setSelectedEquipment(equip); setShowDetailModal(true); }}>View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
    
                        {/* Fixed Pagination at Bottom */}
                        <div className="d-flex justify-content-center mt-auto">
                            <Pagination data={equipmentData} currentPage={currentPage} setCurrentPage={setCurrentPage} productsPerPage={productsPerPage} />
                        </div>
                    </div>
    
                    {/* Modals */}
                    {/* View Details Modal */}
                    <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Equipment Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedEquipment && (
                                <div className="row">
                                    <div className="col-md-7">
                                        <p><strong>Name:</strong> {selectedEquipment.name}</p>
                                        <p><strong>Price Per Day:</strong> ${selectedEquipment.pricePerDay}</p>
                                        <p><strong>Quantity:</strong> {selectedEquipment.quantity}</p>
                                        <p><strong>Description:</strong> {selectedEquipment.description}</p>
                                    </div>
                                    <div className="col-md-5 text-center">
                                        <img src={imageUrls[selectedEquipment.imageUrl] || "/defaultImage.png"}
                                            alt="equipment" className="img-fluid rounded shadow-sm"
                                            style={{ maxWidth: "100%", maxHeight: "250px" }} />
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="warning" onClick={() => handleEdit(selectedEquipment)}>Edit</Button>
                            <Button variant="danger" onClick={() => handleDelete(selectedEquipment.equipmentId)}>Delete</Button>
                        </Modal.Footer>
                    </Modal>
    
                    {/* Edit Modal */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Equipment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        {editedEquipment && (
    <div className="row">
        <div className="col-md-7">
            {/* Hidden Input for Equipment ID */}
            <input type="hidden" value={editedEquipment.equipmentId} />

            <label>Name</label>
            <input
                type="text"
                className="form-control mb-2"
                value={editedEquipment.name}
                onChange={(e) => setEditedEquipment({ ...editedEquipment, name: e.target.value })}
            />

            <label>Price Per Day</label>
            <input
                type="number"
                className="form-control mb-2"
                value={editedEquipment.pricePerDay}
                onChange={(e) => setEditedEquipment({ ...editedEquipment, pricePerDay: e.target.value })}
            />

            <label>Quantity</label>
            <input
                type="number"
                className="form-control mb-2"
                value={editedEquipment.quantity}
                onChange={(e) => setEditedEquipment({ ...editedEquipment, quantity: e.target.value })}
            />

            <label>Description</label>
            <textarea
                className="form-control"
                rows="3"
                value={editedEquipment.description}
                onChange={(e) => setEditedEquipment({ ...editedEquipment, description: e.target.value })}
            ></textarea>
        </div>
        <div className="col-md-5">
            <img src={editedEquipment.imagePreview} alt="equipment" className="img-fluid mb-2" />
            <input type="file" className="form-control" onChange={handleImageChange} />
        </div>
    </div>
)}

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="success" onClick={handleSaveEdit}>Save</Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <AddEquipment setShowAddEquipment={setShowAddEquipment} />
            )}
        </div>
    );
    
}
