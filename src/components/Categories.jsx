import '../assets/css/categories.css';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/sea-green';
import React, { useState, useEffect } from "react";
import axios from "axios"; 

function Categories() {
    const [categories, setCategories] = useState([]); 

    useEffect(() => {
        // Fetch categories from Laravel backend
        axios.get("http://onlinestore.test/api/categories") 
            .then(response => {
                setCategories(response.data); 
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }, []); 
    return (
        <div className="container categories text-center">
            <h2 className='underline'>CATEGORIES</h2>
            <p className='container w-75 mt-4'>
                Explore our diverse selection of electronics, including smartphones, refrigerators, ovens, air conditioners, and computers. Find the perfect products to enhance your home and elevate your daily life.
            </p>
            <Splide
                options={{
                    perPage: 3,
                    perMove: 1,
                    pagination: true,
                    arrows: true,
                    autoplay: true,
                    type: 'loop',
                    breakpoints: {
                        768: {
                            perPage: 1,
                        },
                        1024: {
                            perPage: 2,
                        },
                    },
                }} 
                aria-label="My Favorite Images"
            >
                {categories.map(category => (
                <SplideSlide key={category.id} className={"categories_slide"} style={{position:"relative"}}>
                    <img src="/img/slider1.jpg" alt="Image 1" />
                    <h4 className={"categories_heading"}>{category.category_name}</h4>
                </SplideSlide>
                ))}
               
            </Splide>
        </div>
    );
}

export default Categories;
