import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import spinner


function Product() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        axios.get(`http://onlinestore.test/api/products/${productId}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => console.error("Error fetching product details:", error));
    }, [productId]);

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login to add items to cart.");
                return;
            }

            await axios.post(
                "http://onlinestore.test/api/cart/add",
                { product_id: productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Item added to cart!");
            window.dispatchEvent(new Event("cartUpdated")); // Update cart count
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add item to cart.");
        }
    };

    if (!product) return <div className="spinner-container">
    <ClipLoader size={100} color="#0D6EFD" /> {/* Spinner */}
</div>

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Product Image */}
                <div className="col-md-6 text-center">
                    <img src={`http://onlinestore.test/uploads/${product.product_img}`} alt={product.product_name} className="img-fluid fixed-img object-fit-cover" style = {{width : "300px", height: "300px",borderRadius: "10px"}} />
                </div>

                {/* Product Details */}
                <div className="col-md-6">
                    <h1>{product.product_name}</h1>
                    <p className="text-muted">Rs. {product.product_price}</p>
                    <p>{product.product_dscp}</p>

                    {/* Quantity Selector */}
                    <div className="d-flex align-items-center mb-3">
                        <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                        <span className="mx-3">{quantity}</span>
                        <button className="btn btn-outline-secondary" onClick={() => setQuantity(q => q + 1)}>+</button>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
}

export default Product;
