import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipLoader } from "react-spinners"; // Import spinner

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state

    useEffect(() => {
        fetchCart(); // Fetch cart when component mounts

        const updateCart = () => fetchCart();
        window.addEventListener("cartUpdated", updateCart);

        return () => {
            window.removeEventListener("cartUpdated", updateCart);
        };
    }, []);

    useEffect(() => {
        const clearCartOnLogout = () => setCartItems([]); // Clear cart on logout
        window.addEventListener("userLoggedOut", clearCartOnLogout);
        return () => {
            window.removeEventListener("userLoggedOut", clearCartOnLogout);
        };
    })

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get('http://onlinestore.test/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://onlinestore.test/api/cart/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error removing item:", error.response?.data);
        }
    };

    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return; // Prevent quantity from going below 1

        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`http://onlinestore.test/api/cart/${id}`, 
                { quantity: newQuantity }, 
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                setCartItems(prevItems => 
                    prevItems.map(item => 
                        item.id === id ? { ...item, quantity: newQuantity } : item
                    )
                );

                window.dispatchEvent(new Event("cartUpdated")); // Refresh cart badge
            }
        } catch (error) {
            console.error("Error updating quantity:", error.response?.data);
        }
    };

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + (item.product.product_price * item.quantity), 0);

    return (
        <div className="container mt-5">
            <h1 className='text-center'>Shopping Cart</h1>
            {loading ? (
                <div className="d-flex justify-content-center mt-4">
                    <ClipLoader size={50} color={"#007bff"} loading={loading} />
                </div>
            ) : cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between align-items-center border p-3 mb-2">
                            {/* Product Image */}
                            <Link to={`/product/${item.product.id}`} className="text-decoration-none">
                            <img 
                                src={`http://onlinestore.test/uploads/${item.product.product_img}`} 
                                alt={item.product.product_name} 
                                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                            />
                            </Link>
                            
                            {/* Product Details */}
                            <div className="flex-grow-1 ms-3">
                                <h5 className="mb-1">{item.product.product_name}</h5>
                                <p className="mb-1">Rs. {item.product.product_price} x {item.quantity}</p>
                                
                                {/* Quantity Controls */}
                                <div className="d-flex align-items-center">
                                    <button 
                                        className="btn btn-sm btn-outline-primary me-2" 
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity === 1} // Prevents going below 1
                                    >−</button>
                                    
                                    <span className="mx-2">{item.quantity}</span>

                                    <button 
                                        className="btn btn-sm btn-outline-primary ms-2" 
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >+</button>
                                </div>
                            </div>

                            {/* Remove Button */}
                            <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                        </div>
                    ))}

                    {/* Total Price */}
                    <div className="d-flex justify-content-between mt-4 mb-4">
                        <h5 className="fw-bold">Total: Rs. {totalPrice}</h5>
                        <div className="text-center">
                            <Link to="/checkout" className="btn btn-success btn-md">Proceed to Checkout</Link>
                        </div>
                    </div>

                    
                </div>
            )}
        </div>
    );
}

export default Cart;
