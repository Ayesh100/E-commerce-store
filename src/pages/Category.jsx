import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';

function Category() {
    const { categoryId } = useParams(); // Get category ID from URL
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [brands, setBrands] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [filters, setFilters] = useState({
        minPrice: 0,
        maxPrice: Infinity,
        selectedBrands: [], // Array to store selected brands
    });
    
    // Modal and auth states
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [isRegistering, setIsRegistering] = useState(false);  // Toggle for login/register form
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    
    // States for modal messages and resend option
    const [modalMessage, setModalMessage] = useState("");
    const [modalMessageType, setModalMessageType] = useState(""); // e.g., 'danger' or 'success'
    const [showResend, setShowResend] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        // Fetch category data and products
        axios.get(`http://onlinestore.test/api/category/${categoryId}`)
            .then(response => {
                setCategoryName(response.data.category_name);
                setProducts(response.data.products);
                const initialQuantities = {};
                response.data.products.forEach(product => initialQuantities[product.id] = 1);
                setQuantities(initialQuantities);
            })
            .catch(error => {
                console.error("Error fetching category data:", error);
            });

        // Fetch brands related to the category
        axios.get(`http://onlinestore.test/api/category/${categoryId}/brands`)
            .then(response => {
                setBrands(response.data);
            })
            .catch(error => console.error("Error fetching brands:", error));
    }, [categoryId]);

    const handleQuantityChange = (productId, change) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [productId]: Math.max(1, prevQuantities[productId] + change)
        }));
    };

    // Apply filters to products
    const applyFilters = (product) => {
        const isWithinPriceRange = 
            product.product_price >= filters.minPrice && 
            product.product_price <= filters.maxPrice;

        const matchesBrand = 
            filters.selectedBrands.length === 0 || 
            filters.selectedBrands.includes(product.brand_id);

        return isWithinPriceRange && matchesBrand;
    };

    // Handle Brand checkbox change
    const handleBrandChange = (brandId) => {
        setFilters((prevFilters) => {
            const { selectedBrands } = prevFilters;
            if (selectedBrands.includes(brandId)) {
                return { ...prevFilters, selectedBrands: selectedBrands.filter(id => id !== brandId) };
            } else {
                return { ...prevFilters, selectedBrands: [...selectedBrands, brandId] };
            }
        });
    };

    // Handle Add to Cart
    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token || token === "undefined") {
                setShowLoginModal(true);
                return;
            }
    
            const quantityToSend = quantities[productId] || 1;
            await axios.post('http://onlinestore.test/api/cart/add', 
                { product_id: productId, quantity: quantityToSend }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Item added to cart!");
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            console.error("Error adding to cart:", error.response?.data);
            alert(error.response?.data?.message || "Failed to add item to cart.");
        }
    };

    // Handle login form submission
    const handleLoginSubmit = (e) => {
        e.preventDefault();
        axios.post('http://onlinestore.test/api/login', loginData)
            .then(response => {
                localStorage.setItem('token', response.data.token);
                login(); // update global auth state
                setShowLoginModal(false);
                setModalMessage("");
                setShowResend(false);
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        setModalMessage("Please verify your email before logging in.");
                        setModalMessageType("danger");
                        setShowResend(true);
                    } else if (error.response.status === 401) {
                        setModalMessage("Invalid credentials.");
                        setModalMessageType("danger");
                    } else {
                        setModalMessage("Something went wrong. Please try again.");
                        setModalMessageType("danger");
                    }
                } else {
                    setModalMessage("Network error. Please check your connection.");
                    setModalMessageType("danger");
                }
            });
    };

    // Handle register form submission
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            setModalMessage("Passwords do not match!");
            setModalMessageType("danger");
            return;
        }

        try {
            const response = await axios.post('http://onlinestore.test/api/register', {
                name: registerData.name,
                email: registerData.email,
                password: registerData.password,
                password_confirmation: registerData.confirmPassword
            });
            setModalMessage(response.data.message);
            setModalMessageType("success");
            setIsRegistering(false);
            setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
        } catch (error) {
            if (error.response) {
                setModalMessage("Error: " + JSON.stringify(error.response.data));
                setModalMessageType("danger");
            } else {
                setModalMessage("Network error. Please check your connection.");
                setModalMessageType("danger");
            }
        }
    };

    // Handle resend verification email (for login modal)
    const handleResendEmail = () => {
        axios.post("http://onlinestore.test/api/resend-verification", { email: loginData.email })
            .then((response) => {
                setResendMessage("Verification email has been resent. Please check your inbox.");
                setShowResend(false);
            })
            .catch(() => {
                setResendMessage("Failed to resend verification email. Please try again later.");
            });
    };

    // Toggle between login and register forms
    const toggleForm = () => {
        setIsRegistering(prev => !prev);
        setModalMessage(""); // clear any modal messages when switching
        setShowResend(false);
    };

    return (
        <div className="container mt-5">
            {/* Category Heading */}
            <h1 className="text-center text-uppercase mb-4">{categoryName}</h1>
            
            {/* Layout with Sidebar */}
            <div className="row">
                {/* Sidebar */}
                <div className="col-12 col-lg-3 mb-4">
                    <div className="bg-light p-3 border rounded">
                        <h5 className="mb-3">Filters</h5>
                        <div className="mb-3">
                            <label className="form-label">Price Range</label>
                            <input 
                                type="number" 
                                className="form-control mb-2" 
                                placeholder="Min Price" 
                                onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) || 0 })}
                            />
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Max Price" 
                                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) || Infinity })}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Brands</label>
                            <div className="form-check">
                                {brands.map(brand => (
                                    <div key={brand.id}>
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            id={`brand-${brand.id}`} 
                                            onChange={() => handleBrandChange(brand.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`brand-${brand.id}`}>
                                            {brand.brand_name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="col-12 col-lg-9">
                    <div className="row">
                        {products.filter(applyFilters).map(product => (
                            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                                <div className="card position-relative border-0 shadow-sm">
                                    <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                                        <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                                            Sale {product.sale_percentage}%
                                        </span>
                                        <div className="card-img-top overflow-hidden">
                                            <img 
                                                src={product.product_img} 
                                                alt={product.product_name} 
                                                className="w-100 card-img-top"
                                                style={{ transition: 'transform 0.3s', transform: 'scale(1)' }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                            />
                                        </div>
                                        <div className="card-body text-center">
                                            <h5 className="card-title">{product.product_name}</h5>
                                            <p className="card-text">Rs. {product.product_price}</p>
                                            <div className="d-flex justify-content-center align-items-center mb-2">
                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(product.id, -1)}>-</button>
                                                <span className="mx-2">{quantities[product.id]}</span>
                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(product.id, 1)}>+</button>
                                            </div>
                                        </div>
                                    </Link>
                                    <button 
                                        className="btn btn-primary w-100" 
                                        onClick={() => handleAddToCart(product.id)}>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                        {products.filter(applyFilters).length === 0 && (
                            <p className="text-center text-muted">
                                No products found matching the selected filters.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal for Login/Register */}
            <Modal show={showLoginModal} onHide={() => {
                setShowLoginModal(false);
                setModalMessage("");
                setShowResend(false);
                setResendMessage("");
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>{isRegistering ? 'Register' : 'Login'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Display modal message if available */}
                    {modalMessage && (
                        <div className={`alert alert-${modalMessageType}`}>
                            {modalMessage}
                        </div>
                    )}

                    <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
                        {isRegistering && (
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={isRegistering ? registerData.email : loginData.email}
                                onChange={(e) => {
                                    isRegistering
                                        ? setRegisterData({ ...registerData, email: e.target.value })
                                        : setLoginData({ ...loginData, email: e.target.value });
                                }}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={isRegistering ? registerData.password : loginData.password}
                                onChange={(e) => {
                                    isRegistering
                                        ? setRegisterData({ ...registerData, password: e.target.value })
                                        : setLoginData({ ...loginData, password: e.target.value });
                                }}
                                required
                            />
                        </div>
                        {isRegistering && (
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword"
                                    value={registerData.confirmPassword}
                                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary w-100">
                            {isRegistering ? 'Register' : 'Login'}
                        </button>
                    </form>
                    <div className="mt-3 text-center">
                        <span>
                            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                            <button className="btn btn-link" onClick={toggleForm}>
                                {isRegistering ? 'Login' : 'Register'}
                            </button>
                        </span>
                    </div>

                    {/* Resend Verification Email Option */}
                    {showResend && (
                        <div className="mt-3 text-center">
                            <p>Didn't receive the verification email?</p>
                            <Button variant="warning" onClick={handleResendEmail}>
                                Resend Verification Email
                            </Button>
                        </div>
                    )}
                    {resendMessage && (
                        <div className="alert alert-info mt-3">
                            {resendMessage}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Category;
