import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { FaMoneyCheckAlt } from "react-icons/fa";
import Pagination from "../layout/Pagination";
import _ from 'lodash';
const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [sortOption, setSortOption] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [cookies] = useCookies(["jwtToken"]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const decoded = jwtDecode(cookies.jwtToken);
        const response = await axios.get(
          `http://localhost:8080/api/payments/getPayment/${decoded.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.jwtToken}`,
            },
          }
        );
        if(!_.isEqual(response.data)){
          setPayments(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      }
    };

    if (cookies.jwtToken) {
      fetchPayments();
    }
  }, [cookies.jwtToken,payments]);

  useEffect(() => {
    let sorted = [...payments];

    switch (sortOption) {
      case "asc":
        sorted.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));
        break;
      case "desc":
        sorted.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
        break;
      case "amount":
        sorted.sort((a, b) => b.amount - a.amount);
        break;
      default:
        break;
    }

    setFilteredPayments(sorted);
    setCurrentPage(1);
  }, [payments, sortOption]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirst, indexOfLast);

  return (
    <div className="container d-flex flex-column min-vh-100 mt-5">
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <FaMoneyCheckAlt size={22} className="me-2 text-success" />
            <h3 className="mb-0">Your Payments</h3>
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
              <option value="amount">Amount: High to Low</option>
            </select>
          </div>
        </div>

        {currentItems.length === 0 ? (
          <div className="alert alert-info shadow-sm rounded">
            No payments found.
          </div>
        ) : (
          <ul className="list-group shadow-sm rounded">
            {currentItems.map((payment, index) => (
              <li
                className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row gap-2 p-3"
                key={index}
                style={{
                  backgroundColor: "#f9f9f9",
                  borderLeft: "4px solid #28a745",
                }}
              >
                <div>
                  <strong>Equipment:</strong> {payment.equpmentName} <br />
                  <strong>Payment ID:</strong> {payment.razorpayPaymentId}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className={`badge ${payment.status === "PAID" ? "bg-success" : "bg-danger"}`}>
                    {payment.status}
                  </span>
                  <br />
                  <small className="text-muted">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </small>
                </div>
                <div className="fw-bold text-end text-primary">₹ {payment.amount}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Pagination
          data={filteredPayments}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
        />
      </div>
    </div>
  );
};

export default PaymentPage;
