import React, { useState, useEffect, useContext, useRef} from "react";
import { Link,useNavigate  } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import '../assets/css/navbar.css';
import { ClipLoader } from "react-spinners"; // Import spinner

function Navbar() {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get("http://onlinestore.test/api/categories")
      .then((response) => {
        setCategories(response.data)
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error)
        setLoading(false);
      });
  }, []);

  // When authentication and user data is available, fetch cart count and notifications
  useEffect(() => {
    if (isAuthenticated && user && user.id) {
      fetchCartCount();
      fetchNotifications();
    }
  }, [isAuthenticated, user]);

  // Poll for notifications every 5 seconds (adjust as needed)
  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(() => {
        fetchNotifications();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  // Listen for cart updates
  useEffect(() => {
    const updateCart = () => fetchCartCount();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  // Fetch on user login event
  useEffect(() => {
    const fetchOnLogin = () => {
      fetchCartCount();
      fetchNotifications();
    };
    window.addEventListener("userLoggedIn", fetchOnLogin);
    return () => window.removeEventListener("userLoggedIn", fetchOnLogin);
  }, []);

  // Reset state on logout
  useEffect(() => {
    const resetCartOnLogout = () => {
      setCartCount(0);
      setNotifications([]);
    };
    window.addEventListener("userLoggedOut", resetCartOnLogout);
    return () => window.removeEventListener("userLoggedOut", resetCartOnLogout);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchTerm("");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);

  // Function to fetch cart count
  const fetchCartCount = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://onlinestore.test/api/cart/count", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCartCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching cart count:", error);
      });
  };

  // Function to fetch notifications
  const fetchNotifications = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://onlinestore.test/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setNotifications(response.data)
      })
      .catch((error) =>{
        console.error("Error fetching notifications:", error);
      });
  };

  const markNotificationAsRead = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }

    try {
        await axios.post(
            `http://onlinestore.test/api/notifications/${id}/read`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Update the notification state to mark it as read instead of removing it
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );

    } catch (error) {
        console.error("Error marking notification as read:", error.response?.data || error);
    }
};


const deleteNotification = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found! User might not be logged in.");
        return;
    }

    try {
        await axios.delete(`http://onlinestore.test/api/notifications/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
        console.error("Error deleting notification", error.response?.data || error);
    }
};



  // Logout function
  const handleLogout = () => {
    axios
      .post(
        "http://onlinestore.test/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        localStorage.removeItem("token");
        logout();
        window.dispatchEvent(new Event("userLoggedOut"));
        alert("Logged out successfully");
      })
      .catch((error) =>
        console.error("Logout error:", error.response?.data)
      );
  };

  // Search handling
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 1) {
      axios
        .get(`http://onlinestore.test/api/search?query=${query}`)
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) =>{
          console.error("Error fetching search results:", error);
        });
    } else {
      setSearchResults([]);
    }
  };

  // Dropdown toggles
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotificationDropdown(false);
  };

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowProfileDropdown(false);
  };

  return (
    <nav className="navbar navbar-expand-lg d-flex flex-column navbar-light bg-primary text-white">
      <div className="container-fluid d-flex justify-content-between">
        <Link className="navbar-brand text-white p-2" to="/">
          MyStore
        </Link>
        <div className="d-flex">
          {isAuthenticated && (
            <div className="position-relative me-3">
              <button
                className="btn bg-transparent border-0 p-0"
                onClick={toggleNotificationDropdown}
              >
               <i className="bi bi-bell text-white fs-4"></i>
                {notifications.some(n => !n.is_read) && (
                <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                    {notifications.filter(n => !n.is_read).length}
                </span>
                )}

              </button>
              {showNotificationDropdown && (
                <ul
                  className="dropdown-menu show position-absolute p-2 shadow-lg"
                  style={{
                    right: 0,
                    maxHeight: "250px",
                    overflowY: "auto",
                    width: "400px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <h6 className="dropdown-header border-bottom pb-2">
                    Notifications
                  </h6>
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="dropdown-item border-bottom p-2 d-flex justify-content-between align-items-center"
                        onClick={() => navigate(`/notifications/${notification.id}`)}
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#f8f9fa",
                        }}
                      >
                        <span>{notification.message}</span>
                        {!notification.is_read && (
                        <button
                            className="btn btn-sm text-success"
                            onClick={(e) =>{
                            e.stopPropagation();
                            markNotificationAsRead(notification.id)
                        }}
                            title="Mark as Read"
                        >
                            <i className="bi bi-check-circle"></i> {/* Bootstrap check icon */}
                        </button>
                        )}
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item text-center text-muted py-2">
                      No new notifications
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}

          {isAuthenticated ? (
            <div className="dropdown">
              <button
                className="btn dropdown-toggle border-0 bg-transparent p-0"
                onClick={toggleProfileDropdown}
                style={{ color: "white" }}
              >
                <img
                  src="/img/dummy-image.jpg"
                  alt="Profile"
                  className="rounded-circle me-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                  }}
                />
                <span className="text-white">{user?.name}</span>
              </button>
              {showProfileDropdown && (
                <ul
                  className="dropdown-menu show position-absolute"
                  style={{ right: 0 }}
                >
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person-circle me-2"></i> Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/orders">
                      <i className="bi bi-receipt me-2"></i> Your Orders
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <>
              <Link className="nav-link m-1 text-white" to="/login">
                Login
              </Link>
              <Link className="nav-link m-1 text-white" to="/register">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="container-fluid d-flex justify-content-between align-items-center mt-2">
  {/* Left Section: Navigation Links */}
  <div>
    <ul className="navbar-nav d-flex flex-row">
      <li className="nav-item mx-2">
        <Link className="nav-link text-white" to="/">Home</Link>
      </li>
      <li className="nav-item mx-2">
        <Link className="nav-link text-white" to="/about">About Us</Link>
      </li>
      <li className="nav-item mx-2">
        <Link className="nav-link text-white" to="/contact">Contact</Link>
      </li>
      <li className="nav-item mx-2">
        <Link className="nav-link text-white" to="/faq">FAQ's</Link>
      </li>
    </ul>
  </div>

  {/* Right Section: Search & Cart */}
  <div className="d-flex align-items-center" ref={searchRef}>
    <input
      className="form-control"
      type="search"
      placeholder="Search for products..."
      aria-label="Search"
      value={searchTerm}
      onChange={handleSearch}
      style={{ width: "250px", marginRight: "10px" }}
    />

    {searchTerm.length > 1 && (
      <ul className="dropdown-menu show position-absolute w-100 shadow-lg bg-white p-0"
          style={{ top: "100%", left: 0, zIndex: 1050 }}>
        {searchResults.length > 0 ? (
          searchResults.map((item) => (
            <li key={item.id} className="dropdown-item d-flex align-items-center">
              <Link to={`/product/${item.id}`}
                    className="d-flex align-items-center text-decoration-none w-100"
                    onClick={() => {
                      setSearchTerm("");
                      setSearchResults([]);
                    }}>
                <img
                  src={`http://onlinestore.test/uploads/${item.product_img}`}
                  alt={item.product_name}
                  style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "10px" }}
                />
                <span className="text-dark me-2">{item.product_name}</span>
                <span className="text-dark">Rs.{item.product_price}</span>
              </Link>
            </li>
          ))
        ) : (
          <li className="dropdown-item text-center text-muted py-2">No results found</li>
        )}
      </ul>
    )}

    {/* Cart Icon */}
    <Link to="/cart" className="position-relative text-white ms-3">
      <i className="bi bi-cart-fill fs-3"></i>
      {cartCount > 0 && (
        <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
          {cartCount}
          <span className="visually-hidden">items in cart</span>
        </span>
      )}
    </Link>
  </div>
</div>



      <div className="container-fluid mt-3">
      {loading ? (
                <div className="spinner-container">
                    <ClipLoader size={30} color="#fff" /> {/* Spinner */}
                </div>
            ) : (
        <ul className="d-flex flex-wrap list-unstyled mb-0">
          {categories.map((category) => (
            <li key={category.id} className="me-3">
              <Link to={`/category/${category.id}`} className="text-white">
                {category.category_name}
              </Link>
            </li>
          ))}
        </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
