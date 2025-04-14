import React from "react";
import { Link } from "react-router-dom";

function ThankYou() {
    return (
        <div className="container text-center mt-5">
            <h2>Thank You for Your Order!</h2>
            <p>Your order has been placed successfully.</p>
            <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
        </div>
    );
}

export default ThankYou;
