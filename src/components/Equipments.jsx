import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import AddEquipment from "./AddEquipment";
import Pagination from "./Pagination";
import EditForm from "./EditEquipmentForm";
import { Modal, Button } from "react-bootstrap"; 

export default function Equipments() {
    const [cookie] = useCookies();
    const [equipmentData, setEquipmentData] = useState([]);
    const [imageUrls, setImageUrls] = useState({});
    const [showAddEquipment, setShowAddEquipment] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    // Modals State
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

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
                console.log("Error fetching equipment:", err);
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

    async function handleDelete(id) {
        const confirmDelete = window.confirm("Are you sure you want to delete this equipment?");
        try {
            await axios.delete(`http://localhost:8080/api/equipment/deleteEquipment/${id}`, {
                headers: { Authorization: `Bearer ${cookie.jwtToken}` },
                withCredentials: true
            });

            alert("Equipment deleted successfully");
            setEquipmentData(equipmentData.filter(item => item.equipmentId !== id));
            setShowDetailModal(false);
        } catch (err) {
            console.log("Error deleting equipment:", err.message);
        }
    }

    // Handle View Details Modal
    function handleViewDetails(equipment) {
        setSelectedEquipment(equipment);
        setShowDetailModal(true);
    }

    // Handle Edit Modal
    function handleEdit(equipment) {
        setSelectedEquipment(equipment);
        setShowEditModal(true);
    }

    // Handle After Edit
    function handleAfterEdit(updatedEquipment) {
        setEquipmentData(equipmentData.map(equip => equip.equipmentId === updatedEquipment.equipmentId ? updatedEquipment : equip));
        setShowEditModal(false);
    }

    // Pagination Logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = equipmentData.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div>
            {!showAddEquipment ? (
                <>
                    <div className="mb-3 d-flex justify-content-between">
                        <button className="btn btn-primary" onClick={() => setShowAddEquipment(true)}>Add Equipment</button>
                        <Pagination data={equipmentData} currentPage={currentPage} setCurrentPage={setCurrentPage}
                            productsPerPage={productsPerPage} />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price Per Day</th>
                                    <th>Quantity</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((equip, index) => (
                                    <tr key={equip.equipmentId}>
                                        <td>{index + 1}</td>
                                        <td><img src={imageUrls[equip.imageUrl] || "/defaultImage.png"} alt="equipment" style={{ width: "50px", height: "50px" }} /></td>
                                        <td>{equip.name}</td>
                                        <td>${equip.pricePerDay}</td>
                                        <td>{equip.quantity}</td>
                                        <td style={{ wordWrap: "break-word", maxWidth: "250px", whiteSpace: "pre-line" }}>
                                            {equip.description}
                                        </td>
                                        <td>
                                            <button className="btn btn-info me-2" onClick={() => handleViewDetails(equip)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* View Detail Modal */}
                    <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Equipment Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {selectedEquipment && (
            <div className="row">
                {/* Left side: Equipment details */}
                <div className="col-md-7 d-flex flex-column justify-content-center">
                    <p><strong>Name:</strong> {selectedEquipment.name}</p>
                    <p><strong>Price Per Day:</strong> ${selectedEquipment.pricePerDay}</p>
                    <p><strong>Quantity:</strong> {selectedEquipment.quantity}</p>
                    <p><strong>Description:</strong> {selectedEquipment.description}</p>
                </div>
                
                {/* Right side: Image */}
                <div className="col-md-5 d-flex justify-content-center align-items-center">
                    <img 
                        src={imageUrls[selectedEquipment.imageUrl] || "/defaultImage.png"} 
                        alt="equipment" 
                        style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: "5px" }} 
                    />
                </div>
            </div>
        )}
    </Modal.Body>
    <Modal.Footer>
        <Button variant="primary" onClick={() => { handleEdit(selectedEquipment); setShowDetailModal(false); }}>Edit</Button>
        <Button variant="danger" onClick={() => handleDelete(selectedEquipment.equipmentId)}>Delete</Button>
    </Modal.Footer>
</Modal>


                    {/* Edit Modal */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Equipment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedEquipment && <EditForm values={selectedEquipment} handleAfterEdit={handleAfterEdit} />}
                        </Modal.Body>
                    </Modal>
                </>
            ) : (
                <AddEquipment setShowAddEquipment={setShowAddEquipment} />
            )}
        </div>
    );
}
