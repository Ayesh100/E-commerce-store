import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const VerifyStatus = () => {
    const location = useLocation();
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setStatus(params.get("status"));
        setMessage(params.get("message"));
    }, [location]);

    const handleResendEmail = async () => {
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        try {
            const response = await fetch("https://mylaravelecommerce-x59pn02e.b4a.run/api/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert("Failed to resend verification email.");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-3">Email Verification</h2>
                <p className={`text-center fw-bold ${status === "error" ? "text-danger" : "text-success"}`}>
                    {message}
                </p>

                {status === "error" && <p className="text-center text-muted">If the email is incorrect, please register again.</p>}

                {/* Email input field */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">Enter your email</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Resend Button */}
                <button className="btn btn-primary w-100" onClick={handleResendEmail}>
                    Resend Verification Email
                </button>
            </div>
        </div>
    );
};

export default VerifyStatus;
