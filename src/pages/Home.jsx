import React from 'react';
import Carousel from '../components/Carousel.jsx';
import Categories from '../components/Categories.jsx';
import Arrivals from '../components/Arrivals.jsx';
import OurStory from '../components/OurStory.jsx';
import Footer from '../components/Footer.jsx';

function Home() {
    return (
        <>
            <Carousel />
            <Categories />
            <Arrivals />
            <OurStory />
            <Footer />
        </>
    );
}

export default Home;
