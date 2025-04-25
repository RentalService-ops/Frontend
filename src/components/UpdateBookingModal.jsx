import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UpdateBookingModal = ({
    show,
    selectedProduct,
    updateForm,
    setUpdateForm,
    onClose,
    onSubmit,
}) => {
    if (!show || !selectedProduct) return null;

    const [addresses, setAddresses] = useState([]);
    const [cookie] = useCookies(["jwtToken"]);

    // Fetch user addresses when the modal is opened
    const fetchUserAddresses = async () => {
        try {
            if (!cookie.jwtToken) return;
            const userId = jwtDecode(cookie.jwtToken).user_id;
            const response = await axios.get(
                `http://localhost:8080/api/address/getAddressesByUser/${userId}`,
                {
                    headers: { Authorization: `Bearer ${cookie.jwtToken}` },
                    withCredentials: true,
                }
            );
            setAddresses(response.data);
            if (response.data.length > 0) {
                // Set the first address as the default selected address
                setUpdateForm((prev) => ({
                    ...prev,
                    selectedAddress: response.data[0].id,
                }));
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    // Fetch addresses when the modal is shown
    useEffect(() => {
        if (show) {
            fetchUserAddresses();
        }
    }, [show]);

    // Handle address selection
    const handleAddressChange = (e) => {
        const selectedId = parseInt(e.target.value);
        setUpdateForm((prev) => ({
            ...prev,
            addressDTO: { id: selectedId },
        }));
    };

    return (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Update Booking</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="equipmentQuantity" className="form-label">
                                Equipment Quantity
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="equipmentQuantity"
                                min="1"
                                value={updateForm.equipmentQuantity}
                                onChange={(e) =>
                                    setUpdateForm((prev) => ({
                                        ...prev,
                                        equipmentQuantity: parseInt(e.target.value, 10),
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="startDate" className="form-label">Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="startDate"
                                value={updateForm.startDate}
                                onChange={(e) =>
                                    setUpdateForm((prev) => ({
                                        ...prev,
                                        startDate: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endDate" className="form-label">End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                id="endDate"
                                value={updateForm.endDate}
                                onChange={(e) =>
                                    setUpdateForm((prev) => ({
                                        ...prev,
                                        endDate: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Select New Address */}
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Select Address</label>

                            <select
                                className="form-select"
                                id="address"
                                value={updateForm.addressDTO.id}
                                onChange={handleAddressChange}
                                required
                            >
                                {addresses.length === 0 ? (
                                    <option value="">No address found</option>
                                ) : (
                                    addresses.map((addr) => (
                                        <option key={addr.id} value={addr.id}>
                                            {addr.street}, {addr.city}, {addr.state}
                                        </option>
                                    ))
                                )}
                            </select>

                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-success" onClick={onSubmit}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateBookingModal;
