// import { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useCookies } from "react-cookie";

// const ProductModal = ({ product, show, onClose }) => {
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [totalDays, setTotalDays] = useState(0);
//   const [totalCost, setTotalCost] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [cookie] = useCookies(["jwtToken"]);

//   useEffect(() => {
//     if (show) {
//       fetchUserAddresses();
//     }
//   }, [show, cookie.jwtToken]); // Ensure jwtToken is available before fetching addresses

//   useEffect(() => {
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       const end = new Date(endDate);
//       if (start > end) {
//         setTotalDays(0);
//         setTotalCost(0);
//         return;
//       }
//       const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
//       setTotalDays(diffDays);
//       setTotalCost(diffDays * (product?.pricePerDay || 0) * quantity);
//     } else {
//       setTotalDays(0);
//       setTotalCost(0);
//     }
//   }, [startDate, endDate, quantity, product]);

//   const fetchUserAddresses = async () => {
//     try {
//       if (!cookie.jwtToken) {
//         console.error("Error: jwtToken is missing in cookies.");
//         return;
//       }

//       const userId = jwtDecode(cookie.jwtToken).user_id;
//       const response = await axios.get(
//         `http://localhost:8080/api/address/getAddressesByUser/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${cookie.jwtToken}` },
//           withCredentials: true,
//         }
//       );

//       setAddresses(response.data);
//       if (response.data.length > 0) setSelectedAddress(response.data[0].id);
//     } catch (error) {
//       console.error("Error fetching addresses:", error);
//     }
//   };

//   const handleRentNow = async () => {
//     if (!startDate || !endDate || !selectedAddress) {
//       alert("Please select start date, end date, and address.");
//       return;
//     }

//     try {
//       if (!cookie.jwtToken) {
//         alert("User authentication failed. Please login again.");
//         return;
//       }

//       const userId = jwtDecode(cookie.jwtToken).user_id;
//       const bookingData = {
//         user: { id: userId },
//         equipment: { equipmentId: product.equipmentId },
//         address: { id: selectedAddress },
//         startDate,
//         endDate,
//         totalPrice: totalCost,
//         equipment_quantity: quantity,
//         status: "PENDING",
//       };

//       await axios.post("http://localhost:8080/api/bookings/equipmentBooking", bookingData, {
//         headers: { Authorization: `Bearer ${cookie.jwtToken}` },
//         withCredentials: true,
//       });

//       alert("Booking successful!");
//       onClose();
//     } catch (error) {
//       console.error("Error booking equipment:", error);
//       alert("Failed to book equipment. Please try again.");
//     }
//   };

//   return (
//     <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1">
//       <div className="modal-dialog modal-lg">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">{product?.name || "Product Name"}</h5>
//             <button type="button" className="btn-close" onClick={onClose}></button>
//           </div>
//           <div className="modal-body">
//             <div className="row">
//               <div className="col-md-6">
//                 <img
//                   src={product?.image || "/defaultImage.png"}
//                   alt={product?.name || "Product"}
//                   className="img-fluid rounded"
//                   style={{ width: "200px", height: "200px", objectFit: "cover" }}
//                 />
//                 <div className="mt-3">
//                   <h6>Product Details:</h6>
//                   <p>{product?.description || "No description available."}</p>
//                   <p><strong>Category:</strong> {product?.category || "N/A"}</p>
//                   <p><strong>Price per Day:</strong> ${product?.pricePerDay || 0}</p>
//                 </div>
//               </div>
//               <div className="col-md-6">
//                 <h6>Rental Details:</h6>
//                 <form onSubmit={(e) => e.preventDefault()}>
//                   <div className="mb-3">
//                     <label htmlFor="startDate" className="form-label">Start Date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       id="startDate"
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       min={new Date().toISOString().split("T")[0]}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="endDate" className="form-label">End Date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       id="endDate"
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       min={startDate || new Date().toISOString().split("T")[0]}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="quantity" className="form-label">Quantity</label>
//                     <input
//                       type="number"
//                       className="form-control"
//                       id="quantity"
//                       value={quantity}
//                       onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
//                       min="1"
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label htmlFor="address" className="form-label">Select Address</label>
//                     <select
//                       className="form-select"
//                       id="address"
//                       value={selectedAddress}
//                       onChange={(e) => setSelectedAddress(e.target.value)}
//                       required
//                     >
//                       {addresses.length === 0 ? (
//                         <option value="">No address found</option>
//                       ) : (
//                         addresses.map((addr) => (
//                           <option key={addr.id} value={addr.id}>
//                             {addr.street}, {addr.city}, {addr.state}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                   </div>
//                   <div className="alert alert-info">
//                     <p><strong>Total Days:</strong> {totalDays}</p>
//                     <p><strong>Total Cost:</strong> ${totalCost.toFixed(2)}</p>
//                   </div>
//                   <button type="button" className="btn btn-primary w-100" onClick={handleRentNow}>
//                     Submit Rental Request
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductModal;


import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";

const ProductModal = ({ product, show, onClose }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [cookie] = useCookies(["jwtToken"]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      fetchUserAddresses();
    } else {
      document.body.style.overflow = "auto"; // Restore scrolling
    }
    return () => {
      document.body.style.overflow = "auto"; // Cleanup when modal unmounts
    };
  }, [show, cookie.jwtToken]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        setTotalDays(0);
        setTotalCost(0);
        return;
      }
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays);
      setTotalCost(diffDays * (product?.pricePerDay || 0) * quantity);
    } else {
      setTotalDays(0);
      setTotalCost(0);
    }
  }, [startDate, endDate, quantity, product]);

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
      if (response.data.length > 0) setSelectedAddress(response.data[0].id);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleRentNow = async () => {
    if (!startDate || !endDate || !selectedAddress) {
      alert("Please select start date, end date, and address.");
      return;
    }

    try {
      if (!cookie.jwtToken) {
        alert("User authentication failed. Please login again.");
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
        equipment_quantity: quantity,
        status: "PENDING",
      };

      await axios.post("http://localhost:8080/api/bookings/equipmentBooking", bookingData, {
        headers: { Authorization: `Bearer ${cookie.jwtToken}` },
        withCredentials: true,
      });

      alert("Booking successful!");
      onClose();
    } catch (error) {
      console.error("Error booking equipment:", error);
      alert("Failed to book equipment. Please try again.");
    }
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : "d-none"}`} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product?.name || "Product Name"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row align-items-center">
              {/* Left Side: Image */}
              <div className="col-md-5 text-center">
                <img
                  src={product?.image || "/defaultImage.png"}
                  alt={product?.name || "Product"}
                  className="img-fluid rounded"
                  style={{ width: "100%", height: "auto", maxHeight: "3000px", objectFit: "cover" }}
                />
              </div>

              {/* Right Side: Details */}
              <div className="col-md-7">
                <h6>Rental Details:</h6>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mb-2">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
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
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="quantity" className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="address" className="form-label">Select Address</label>
                    <select
                      className="form-select"
                      id="address"
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
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

                  {/* Total Cost Row */}
                  <div className="alert alert-info d-flex justify-content-between">
                    <strong>Total Days: {totalDays}</strong>
                    <strong>Total Cost: ₹{totalCost.toFixed(2)}</strong>
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
