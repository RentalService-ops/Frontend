import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import Equipments from "./Equipments"; // 👈 Assuming this is your detailed view component

const RentalDashboard = (props) => {
  const [cookies] = useCookies(["jwtToken"]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookingCount, setBookingCount] = useState(0);
  const [showAllEquipments, setShowAllEquipments] = useState(false); // 👈 New state

  const [darkMode, setDarkMode] = useState(false);

  const decodedToken = cookies.jwtToken ? jwtDecode(cookies.jwtToken) : null;
  const userId = decodedToken?.user_id;

  const headers = {
    Authorization: `Bearer ${cookies.jwtToken}`,
  };

  useEffect(() => {
    if (!userId) return;

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/category/category/${userId}`,
          { headers }
        );
        setCategoryCount(response.data.body?.length);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchEquipments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/equipment/getEquipmentByUserId?id=${userId}`,
          { headers }
        );
        setEquipmentList(response.data);
      } catch (error) {
        console.error("Error fetching equipments:", error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/bookings/getBookings?id=${userId}`,
          { headers }
        );
        setBookingCount(response.data.length);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchCategories();
    fetchEquipments();
    fetchBookings();
  }, [userId]);

  const cardStyles = {
    minHeight: "120px",
  };

  const darkStyles = {
    backgroundColor: "#212529",
    color: "white",
    minHeight: "100vh",
  };

  const darkCard = {
    backgroundColor: "#343a40",
    color: "white",
  };

  // 👉 Conditional rendering for detailed Equipment view
  if (showAllEquipments) {
    return <Equipments onBack={() => setShowAllEquipments(false)} />;
  }

  return (
    <div className="container-fluid p-4" style={darkMode ? darkStyles : {}}>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary" style={cardStyles}>
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <p className="card-text fs-4 te">{categoryCount}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success" style={cardStyles}>
            <div className="card-body">
              <h5 className="card-title">Equipments</h5>
              <p className="card-text fs-4">{equipmentList.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning" style={cardStyles}>
            <div className="card-body">
              <h5 className="card-title">Bookings</h5>
              <p className="card-text fs-4">{bookingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Table Preview */}
      <div className="card" style={darkMode ? darkCard : {}}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Your Equipments</h5>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => {setShowAllEquipments(true)
              localStorage.setItem("state", "My Equipments");
              props.setActiveLink("My Equipments")
            }
            } 
          >
            View All
          </button>
        </div>
        <div className="card-body table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price Per Day</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {equipmentList.length > 0 ? (
                equipmentList.slice(0, 7).map((eq, i) => (
                  <tr key={i}>
                    <td>{eq.name}</td>
                    <td>{eq.categoryName || "-"}</td>
                    <td>₹{eq.pricePerDay}</td>
                    <td>{eq.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No equipment found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default RentalDashboard;
