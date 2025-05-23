import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // Import useLocation to access URL query params
import axios from "axios";
import { AuthContext } from "../AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [showResend, setShowResend] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [verifiedMessage, setVerifiedMessage] = useState(""); // For verification success message
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const location = useLocation(); // Get the location object to access the URL
    const queryParams = new URLSearchParams(location.search); // Parse query params

    useEffect(() => {
        // Check if the URL has the "verified" query parameter
        const verified = queryParams.get('verified');
        const message = queryParams.get('message');
        
        if (verified && message) {
            setVerifiedMessage(message); // Set the verification message to be displayed
        }
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post("https://mylaravelecommerce-x59pn02e.b4a.run/api/login", formData)
            .then((response) => {
                localStorage.setItem("token", response.data.token); // Save token
                login(); // Update authentication state
                navigate("/"); // Redirect to home
                console.log("Login state updated, navigating...");
                window.dispatchEvent(new Event("userLoggedIn")); // Dispatch login event
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 403) {
                        setError("Please verify your email before logging in.");
                        setShowResend(true); // Show resend email option
                    } else if (error.response.status === 401) {
                        setError("Invalid credentials.");
                    } else {
                        setError("Something went wrong. Please try again.");
                    }
                } else {
                    setError("Network error. Please check your connection.");
                }
            });
    };

    const handleResendEmail = () => {
        axios
            .post("https://mylaravelecommerce-x59pn02e.b4a.run/api/resend-verification", { email: formData.email })
            .then((response) => {
                setResendMessage("Verification email has been resent. Please check your inbox.");
                setShowResend(false); // Hide form after resending
            })
            .catch(() => {
                setResendMessage("Failed to resend verification email. Please try again later.");
            });
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="col-md-6">
                <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-white">
                    <h3 className="mb-4 text-center">Login</h3>
                    
                    {/* Display verification success message */}
                    {verifiedMessage && <div className="alert alert-success">{verifiedMessage}</div>}

                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>

                {showResend && (
                    <div className="mt-3 mb-3 p-3 border rounded bg-light text-center">
                        <p>Your email is not verified. Would you like to resend the verification email?</p>
                        <button className="btn btn-warning" onClick={handleResendEmail}>
                            Resend Verification Email
                        </button>
                    </div>
                )}

                {resendMessage && <div className="alert alert-info mt-3">{resendMessage}</div>}
            </div>
        </div>
    );
};

export default Login;
