// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { jwtDecode } from "jwt-decode";
// import { FaBell } from "react-icons/fa";

// const NotificationPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [filteredNotifications, setFilteredNotifications] = useState([]);
//   const [sortOption, setSortOption] = useState("desc");
//   const [cookies] = useCookies(["jwtToken"]);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const decoded = jwtDecode(cookies.jwtToken);
//         const response = await axios.get(
//           `http://localhost:8080/api/notification/${decoded.user_id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${cookies.jwtToken}`,
//             },
//           }
//         );
//         setNotifications(response.data);
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error);
//       }
//     };

//     if (cookies.jwtToken) {
//       fetchNotifications();
//     }
//   }, [cookies.jwtToken]);

//   useEffect(() => {
//     let sorted = [...notifications];

//     switch (sortOption) {
//       case "asc":
//         sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//         break;
//       case "desc":
//         sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
//         break;
//       case "az":
//         sorted.sort((a, b) => a.message.localeCompare(b.message));
//         break;
//       case "za":
//         sorted.sort((a, b) => b.message.localeCompare(a.message));
//         break;
//       default:
//         break;
//     }

//     setFilteredNotifications(sorted);
//   }, [notifications, sortOption]);

//   return (
//     <div className="container mt-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div className="d-flex align-items-center">
//           <FaBell size={22} className="me-2 text-primary" />
//           <h3 className="mb-0">Your Notifications</h3>
//         </div>
//         <div>
//           <select
//             className="form-select"
//             style={{ width: "200px" }}
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//           >
//             <option value="desc">Date: Newest First</option>
//             <option value="asc">Date: Oldest First</option>
//             <option value="az">Message: A to Z</option>
//             <option value="za">Message: Z to A</option>
//           </select>
//         </div>
//       </div>

//       {filteredNotifications.length === 0 ? (
//         <div className="alert alert-info shadow-sm rounded">
//           No notifications found.
//         </div>
//       ) : (
//         <ul className="list-group shadow-sm rounded">
//           {filteredNotifications.map((notification) => (
//             <li
//               className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row gap-2 p-3 notification-item"
//               key={notification.id}
//               style={{
//                 backgroundColor: "#f9f9f9",
//                 borderLeft: "4px solid #0d6efd",
//               }}
//             >
//               <div className="fw-semibold">{notification.message}</div>
//               <div className="text-muted small">
//                 {new Date(notification.timestamp).toLocaleString()}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default NotificationPage;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { FaBell } from "react-icons/fa";
import Pagination from "../layout/Pagination";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [sortOption, setSortOption] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [cookies] = useCookies(["jwtToken"]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const decoded = jwtDecode(cookies.jwtToken);
        const response = await axios.get(
          `http://localhost:8080/api/notification/${decoded.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.jwtToken}`,
            },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (cookies.jwtToken) {
      fetchNotifications();
    }
  }, [cookies.jwtToken]);

  useEffect(() => {
    let sorted = [...notifications];

    switch (sortOption) {
      case "asc":
        sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case "desc":
        sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case "az":
        sorted.sort((a, b) => a.message.localeCompare(b.message));
        break;
      case "za":
        sorted.sort((a, b) => b.message.localeCompare(a.message));
        break;
      default:
        break;
    }

    setFilteredNotifications(sorted);
    setCurrentPage(1); // Reset on sort change
  }, [notifications, sortOption]);

  // Pagination logic using slice
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentItems = filteredNotifications.slice(indexOfFirst, indexOfLast);

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5">
  <div className="flex-grow-1">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div className="d-flex align-items-center">
        <FaBell size={22} className="me-2 text-primary" />
        <h3 className="mb-0">Your Notifications</h3>
      </div>
      <div>
        <select
          className="form-select"
          style={{ width: "200px" }}
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="desc">Date: Newest First</option>
          <option value="asc">Date: Oldest First</option>
          <option value="az">Message: A to Z</option>
          <option value="za">Message: Z to A</option>
        </select>
      </div>
    </div>

    {currentItems.length === 0 ? (
      <div className="alert alert-info shadow-sm rounded">
        No notifications found.
      </div>
    ) : (
      <ul className="list-group shadow-sm rounded">
        {currentItems.map((notification) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row gap-2 p-3 notification-item"
            key={notification.id}
            style={{
              backgroundColor: "#f9f9f9",
              borderLeft: "4px solid #0d6efd",
            }}
          >
            <div className="fw-semibold">{notification.message}</div>
            <div className="text-muted small">
              {new Date(notification.timestamp).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Always visible at the bottom */}
  <div className="d-flex justify-content-center mt-4">
    <Pagination
      data={filteredNotifications}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      productsPerPage={productsPerPage}
    />
  </div>
</div>

  );
};

export default NotificationPage;
