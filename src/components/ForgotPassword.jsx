import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
    const [showSetPassword, setShowSetPassword] = useState(false);
    const [enteredOTPValue, setEnteredOTPValue] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [isLoading,setIsLoading]=useState(false);
    const [confirmResetPassword, setConfirmResetPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    async function handleClick() {
        try {
            const response = await axios.post(`http://localhost:8080/verify-otp`, {
                email: `${localStorage.getItem("email")}`,
                sentOTP: enteredOTPValue
            });

            if (response.data === "OTP verified") {
                setShowSetPassword(true);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                alert("Wrong OTP Entered!!");
                localStorage.removeItem("email");
                navigate("/verify-email");
            }
            console.log(err);
        } finally {
            setEnteredOTPValue("");
        }
    }

    async function handleResetOTPClick() {
        setIsLoading(true);
        try {
            await axios.get(`http://localhost:8080/otp`, {
                params: {
                    useremail: localStorage.getItem("email")
                }
            });
            setShowModal(true);
        } catch (err) {
            console.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResetPassword() {
        const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

        if (resetPassword.length < 8) {
            alert("Password must contain at least 8 characters.");
        } else if (!passwordPattern.test(resetPassword)) {
            alert("Password should contain at least one uppercase character, one number, and one special character.");
        } else if (resetPassword !== confirmResetPassword) {
            alert("Passwords do not match.");
        } else {
            try {
                await axios.post(`http://localhost:8080/reset-password`, {
                    email: `${localStorage.getItem("email")}`,
                    resetPassword: resetPassword
                });
                alert("Your password has been reset.");
                localStorage.removeItem("email");
                navigate("/login");
            } catch (err) {
                console.log(err.message);
            }
        }
        setResetPassword("");
        setConfirmResetPassword("");
    }

    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f9fa"
        }}>
            <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}>
                {showSetPassword ? (
                    <>
                        <h4 className="text-center mb-4">Reset Password</h4>
                        <div className="form-group mb-3">
                            <label htmlFor="newPass">New Password</label>
                            <input
                                id="newPass"
                                type="password"
                                className="form-control"
                                value={resetPassword}
                                onChange={(e) => setResetPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="confirmPass">Confirm New Password</label>
                            <input
                                id="confirmPass"
                                type="password"
                                className="form-control"
                                value={confirmResetPassword}
                                onChange={(e) => setConfirmResetPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100" onClick={handleResetPassword}>
                            Reset Password
                        </button>
                    </>
                ) : (
                    <>
                        <h4 className="text-center mb-4">OTP Verification</h4>
                        <div className="form-group mb-3">
                            <input
                                id="otpInput"
                                type="number"
                                className="form-control"
                                placeholder="Enter your OTP"
                                value={enteredOTPValue}
                                onChange={(e) => setEnteredOTPValue(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                        <button className="btn btn-primary" onClick={handleClick}>
                            Verify OTP
                        </button>
                        <button className="btn btn-primary" onClick={handleResetOTPClick}>
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Sending...
                            </>
                        ) : (
                            "Reset OTP"
                        )}
                        </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
