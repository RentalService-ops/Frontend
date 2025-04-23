import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

const ProductModal = ({ product, show, onClose }) => {
  const [rentalData, setRentalData] = useState({
    startDate: "",
    endDate: "",
    totalDays: 0,
    totalCost: 0,
    quantity: 1,
    selectedAddress: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [cookie] = useCookies(["jwtToken"]);
  const [error, setError] = useState("");  

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      fetchUserAddresses();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show, cookie.jwtToken]);

  useEffect(() => {
    const { startDate, endDate, quantity } = rentalData;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        setRentalData((prev) => ({
          ...prev,
          totalDays: 0,
          totalCost: 0,
        }));
        return;
      }
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const cost = diffDays * (product?.pricePerDay || 0) * quantity;
      setRentalData((prev) => ({
        ...prev,
        totalDays: diffDays,
        totalCost: cost,
      }));
    } else {
      setRentalData((prev) => ({
        ...prev,
        totalDays: 0,
        totalCost: 0,
      }));
    }
  }, [rentalData.startDate, rentalData.endDate, rentalData.quantity, product]);

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
        setRentalData((prev) => ({
          ...prev,
          selectedAddress: response.data[0].id,
        }));
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleRentNow = async () => {
    const { startDate, endDate, selectedAddress, quantity, totalCost } = rentalData;

    if (!startDate || !endDate || !selectedAddress) {
      alert("Please select start date, end date, and address.");
      return;
    }


    if (quantity > product.quantity) {
      setError(`Sorry, only ${product.quantity} units are available.`);
      return;
    }

    try {
      if (!cookie.jwtToken) {
        setError("User authentication failed. Please login again.");
        return;
      }

      const userId = jwtDecode(cookie.jwtToken).user_id;
      const bookingData = {
        user: { id: userId },
        equipment: { equipmentId: product.equipmentId },
        address: { id: selectedAddress },
        startDate,
        endDate,
        totalPrice: totalCost,
        equipmentQuantity: quantity,
        status: "PENDING",
      };

      await axios.post("http://localhost:8080/api/bookings/equipmentBooking", bookingData, {
        headers: { Authorization: `Bearer ${cookie.jwtToken}` },
        withCredentials: true,
      });

      setError("");
      alert("Booking successful!");
      onClose();
    } catch (error) {
      console.error("Error booking equipment:", error);
      setError("Failed to book equipment. Please try again.");
    }
  };

  function handleClose() {
    setRentalData({
      startDate: "",
      endDate: "",
      totalDays: 0,
      totalCost: 0,
      quantity: 1,
      selectedAddress: "",
    });
    setError(""); 
    onClose();
  }

  return (
    <div className={`modal fade ${show ? "show d-block" : "d-none"}`} style={{background:"rgba(0, 0, 0, 0.5)"}} >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product?.name || "Product Name"}</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="row align-items-center">
              <div className="col-md-5 text-center">
                <img
                  src={product?.image || "/defaultImage.png"}
                  alt={product?.name || "Product"}
                  className="img-fluid rounded"
                  style={{ width: "100%", height: "auto", maxHeight: "3000px", objectFit: "cover" }}
                />
              </div>

              <div className="col-md-7">
                <h6>Rental Details:</h6>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mb-2">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      value={rentalData.startDate}
                      onChange={(e) => setRentalData({ ...rentalData, startDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="endDate"
                      value={rentalData.endDate}
                      onChange={(e) => setRentalData({ ...rentalData, endDate: e.target.value })}
                      min={rentalData.startDate || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      value={rentalData.quantity}
                      onChange={(e) =>
                        setRentalData({
                          ...rentalData,
                          quantity: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      min="1"
                      required
                    />
                    {error && error.includes("units") && (
                      <div className="text-danger mt-2">{error}</div>  
                    )}
                  </div>
                  <div className="mb-2">
                    <label htmlFor="address" className="form-label">Select Address</label>
                    <select
                      className="form-select"
                      id="address"
                      value={rentalData.selectedAddress}
                      onChange={(e) =>
                        setRentalData({ ...rentalData, selectedAddress: e.target.value })
                      }
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

                  <div className="alert alert-info d-flex justify-content-between">
                    <strong>Total Days: {rentalData.totalDays}</strong>
                    <strong>Total Cost: ₹{rentalData.totalCost.toFixed(2)}</strong>
                  </div>

                  <button type="button" className="btn btn-primary w-100" onClick={handleRentNow}>
                    Submit Rental Request
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
