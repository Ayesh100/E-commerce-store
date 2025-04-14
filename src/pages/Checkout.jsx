import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zip_code: "",
        payment_method: "cod", // Default to Cash on Delivery (COD)
        card_number: "",
        card_expiry: "",
        card_cvv: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // If payment method changes to COD, reset card fields
        if (name === "payment_method" && value === "cod") {
            setFormData({
                ...formData,
                payment_method: value,
                card_number: "",
                card_expiry: "",
                card_cvv: "",
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://onlinestore.test/api/checkout", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            alert("Order placed successfully!");
            window.dispatchEvent(new Event("cartUpdated"));
            navigate("/thank-you"); // Redirect to a thank-you page
        } catch (error) {
            console.error("Error submitting order:", error.response?.data);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Checkout</h2>
            <form onSubmit={handleSubmit} className="p-4 border rounded">
                
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-control" name="name" required onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" required onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone</label>
                            <input type="text" className="form-control" name="phone" required onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Address</label>
                            <textarea className="form-control" name="address" required onChange={handleChange}></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">City</label>
                            <input type="text" className="form-control" name="city" required onChange={handleChange} />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Zip Code</label>
                            <input type="text" className="form-control" name="zip_code" required onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Payment Method</label>
                            <select className="form-select" name="payment_method" required onChange={handleChange}>
                                <option value="cod">Cash on Delivery</option>
                                {/* <option value="card">Credit/Debit Card</option> */}
                            </select>
                        </div>

                        {/* Conditionally Show Card Payment Fields
                        {formData.payment_method === "card" && (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Card Number</label>
                                    <input type="text" className="form-control" name="card_number" required={formData.payment_method === "card"} onChange={handleChange} />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label className="form-label">Expiration Date</label>
                                        <input type="text" className="form-control" name="card_expiry" placeholder="MM/YY" required={formData.payment_method === "card"} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">CVV</label>
                                        <input type="text" className="form-control" name="card_cvv" required={formData.payment_method === "card"} onChange={handleChange} />
                                    </div>
                                </div>
                            </>
                        )} */}
                    </div>
                </div>

                {/* Place Order Button */}
                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary w-50">Place Order</button>
                </div>
            </form>
        </div>
    );
}

export default Checkout;
