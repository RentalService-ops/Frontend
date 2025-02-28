import axios from "axios";
import { useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // ✅ Import correctly
import "../styles/Auth.css";

export default function Login() {
  const username = useRef("");
  const password = useRef("");
  const [cookies, setCookie] = useCookies(["jwtToken", "role", "userId"]); // ✅ Store userId too
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/login",
        {
          email: username.current.value,
          password: password.current.value,
        },
        { withCredentials: true }
      );

      console.log("Login Response:", response.data);

      if (response.data.token) {
        const token = response.data.token;
        console.log("Token:", token);

        // ✅ Decode token to extract user_id and role
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // ✅ Extract user_id from claims
        const userId = decodedToken.user_id; // New addition

        // ✅ Extract role from "role" claim
        const userRole = decodedToken.role;

        console.log("User ID:", userId);
        console.log("User Role:", userRole);

        // ✅ Store token, role, and user_id in cookies
        setCookie("jwtToken", token, { path: "/", maxAge: 86400 });
        setCookie("role", userRole, { path: "/", maxAge: 86400 });
        setCookie("userId", userId, { path: "/", maxAge: 86400 }); // ✅ Store user_id

        // ✅ Navigate based on role
        if (userRole === "admin") navigate("/admin-home");
        else if (userRole === "rental") navigate("/rental-home");
        else navigate("/user-home"); // Default for 'user'
      } else {
        console.error("Token missing in response");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }

    if (username.current) username.current.value = "";
    if (password.current) password.current.value = "";
  }

  return (
    <section className="vh-100 gradient-custom body-container">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">
                <form onSubmit={handleSubmit} className="mb-2 md-5 mt-md-4 pb-2">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">Please enter your login and password!</p>

                  <div className="form-outline form-white mb-4">
                    <input type="email" className="form-control form-control-md" placeholder="Email" ref={username} required />
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input type="password" className="form-control form-control-md" placeholder="Password" ref={password} required />
                  </div>

                  <button className="btn btn-outline-light btn-lg px-5" type="submit">
                    Login
                  </button>
                </form>

                <p className="small mb-5 pb-lg-2">
                  <a className="text-white-50" href="#!">Forgot password?</a>
                </p>

                <div>
                  <p className="mb-0">
                    Don't have an account?
                    <a href="/register" className="text-white-50 fw-bold"> Sign Up</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
