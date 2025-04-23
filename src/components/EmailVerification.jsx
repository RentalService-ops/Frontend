import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function EmailVerification() {
    const [emailValue, setEmailValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    async function handleClick() {
        setIsLoading(true);
        try {
            await axios.get(`http://localhost:8080/otp`, {
                params: {
                    useremail: emailValue
                }
            });
            localStorage.setItem("email", emailValue);
            setEmailValue("");
            setShowModal(true);
        } catch (err) {
            console.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleModalClose() {
        setShowModal(false);
        navigate("/forgot-password");
    }

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <>
            <div style={{
                height: "83vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
                <div className="card shadow p-4" style={{ minWidth: "400px", borderRadius: "15px" ,top:"50px"}}>
                    <h4 className="text-center mb-4">Email Verification</h4>
                    <div className="form-group mb-3">
                        <label htmlFor="emailInput" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="emailInput"
                            placeholder="Enter your email"
                            className="form-control"
                            value={emailValue}
                            required
                            onChange={(e) => setEmailValue(e.target.value)}
                        />
                    </div>
                    <button
                        className="btn btn-primary w-100"
                        onClick={handleClick}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </button>
                </div>
            </div>
            {showModal && (
                <div className="modal fade show" tabIndex="-1" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Success</h5>
                            </div>
                            <div className="modal-body">
                                <p>We have sent an OTP to your email address for verification.</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={handleModalClose}>Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
