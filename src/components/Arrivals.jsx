import '../assets/css/arrivals.css'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/sea-green';
import React, { useState, useEffect } from "react";
import axios from "axios"; 

function Arrivals() {
    const [products, setProducts] = useState([]); 

    useEffect(() => {
        // Fetch products from Laravel backend
        axios.get("http://onlinestore.test/api/products") 
            .then(response => {
                setProducts(response.data.products);
                console.log(response.data.products); 
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }, []); 
    return (
        <div className="container-fluid arrivals text-center">
            <h2 className='underline'>NEW ARRIVALS</h2>
            <Splide
                options={{
                    perPage: 1,
                    perMove: 1,
                    pagination: true,
                    arrows: true,
                    autoplay: true,
                    loop: true,
                    breakpoints: {
                        768: {
                            perPage: 1,
                        },
                        1024: {
                            perPage: 1,
                        },
                    },
                }}
                aria-label="My Favorite Images"
            >
                {products.slice(0,3).map(product => (
                <SplideSlide key={product.id} className="arrivals-slide">
                    <div className="slide-content d-flex align-items-center">
                        <div className="product-details w-50 p-3">
                            <h1 className="product-price">Rs.{product.product_price}</h1>
                            <h3 className="product-name">{product.product_name}</h3>
                            <button className="btn btn-primary text-uppercase fs-5 pt-2 pb-2 ps-4 pe-4 mt-2">Add to Cart</button>
                        </div>
                        <div className="product-image w-50">
                            <img src={product.product_img} alt={product.product_name} className="d-block w-100" />
                        </div>
                    </div>
                </SplideSlide>

                ))}
               
            </Splide>
        </div>
    )
}
export default Arrivals