import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import AddEquipment from "./AddEquipment";
import Pagination from "../layout/Pagination";
import { Modal, Button } from "react-bootstrap";
import EditEquipmentForm from "./EditEquipmentForm";
import Table from "./Table"
export default function Equipments() {
    const [cookie] = useCookies();
    const [equipmentData, setEquipmentData] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [showAddEquipment, setShowAddEquipment] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    // Modal States
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    const tableData = [
        {
            label: "Image",
            render: (equipment) => (<img src={imageUrls[equipment.imageUrl] || "/defaultImage.png"} alt="equipment" style={{ width: "50px", height: "50px" }} />)
        },
        {
            label: "Name",
            render: (equipment) => equipment.name
        },
        {
            label: "Price Per Day",
            render: (equipment) => equipment.pricePerDay
        },
        {
            label: "Quantity",
            render: (equipment) => equipment.quantity
        },
        {
            label: "Description",
            render: (equipment) => equipment.description
        },
        {
            label: "Details",
            render: (equipment) => (<button className="btn btn-info" onClick={() => { setSelectedEquipment(equipment); setShowDetailModal(true); }}>View</button>)
        },
    ]

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
    }, [equipmentData, cookie.jwtToken]);

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

    const handleEdit = () => {
        setShowDetailModal(false);
        setShowEditModal(true);
    };

    const handleSaveEdit = async (editedEquipment) => {
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
            console.error("❌ Error updating equipment:", err.message);
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

                    <div className="d-flex flex-column flex-grow-1">
                        <Table config={tableData} bookings={equipmentData.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)} keyFn={(equipment) => equipment.equipmentId} />
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
                                <div className="d-flex flex-column">
                                    <div>
                                        <img src={imageUrls[selectedEquipment.imageUrl] || "/defaultImage.png"}
                                            alt="equipment" className="img-fluid rounded shadow-sm"
                                            style={{ width: "100%", height: "auto" }} />
                                    </div>
                                    <div>
                                        <p><strong>Name:</strong> {selectedEquipment.name}</p>
                                        <p><strong>Price Per Day:</strong> ${selectedEquipment.pricePerDay}</p>
                                        <p><strong>Quantity:</strong> {selectedEquipment.quantity}</p>
                                        <p><strong>Description:</strong> {selectedEquipment.description}</p>
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="warning" onClick={() => handleEdit(selectedEquipment)}>Edit</Button>
                            <Button variant="danger" onClick={() => handleDelete(selectedEquipment.equipmentId)}>Delete</Button>
                        </Modal.Footer>
                    </Modal>

                    <EditEquipmentForm equipment={{ ...selectedEquipment, imagePreview: imageUrls[selectedEquipment?.imageUrl] || "/defaultImage.png" }} showEditModal={showEditModal} handleSaveEdit={handleSaveEdit} setShowEditModal={setShowEditModal} />
                </>
            ) : (
                <AddEquipment setShowAddEquipment={setShowAddEquipment} />
            )}
        </div>
    );

}
