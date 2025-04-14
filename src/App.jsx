import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { StrictMode } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Category from './pages/Category.jsx';
import ThankYou from './pages/ThankYou.jsx';
import Product from "./pages/Product.jsx"; // Import Product component
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import './assets/css/body.css';
import Home from './pages/Home.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import AuthProvider from './AuthContext';
import NotificationsPage from "./pages/Notification.jsx"; // Import page
import VerifyStatus from './pages/VerifyStatus.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';

function App() {
  return (
    <StrictMode>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<Category />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path='/verify-status' element={<VerifyStatus />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/notifications/:id" element={<NotificationsPage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Routes>
        </Router>
      </AuthProvider>
    </StrictMode>
  );
}

export default App;
