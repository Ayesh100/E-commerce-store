import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import spinner


const NotificationsPage = () => {
  const { id } = useParams(); // Get notification ID from URL
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-success bg-light-success";
      case "pending":
        return "text-warning bg-light-warning";
      case "cancelled":
        return "text-danger bg-light-danger";
      case "processing":
        return "text-primary bg-light-primary";
      default:
        return "text-secondary bg-light-secondary";
    }
  };


  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://onlinestore.test/api/notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // Debugging
        setOrderDetails(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);


  return (
    <div className="container mt-4">
      <h2 className="text-center">Order Details</h2>
      <p><strong>Order ID:</strong> {loading ? (<ClipLoader size={15} color={"#0D6EFD"} loading={loading} />) : (orderDetails?.order?.id)} </p>
      <p><strong>Total Price:</strong> {loading ? (<ClipLoader size={15} color={"#0D6EFD"} loading={loading} />) : (orderDetails?.order?.total_price)} </p>
      <p><strong>Order Date:</strong> {loading ? (<ClipLoader size={15} color={"#0D6EFD"} loading={loading} />) : (orderDetails?.order?.created_at)} </p>
      <p>
        <strong>Status:</strong>{" "}
        {loading ? (
          <ClipLoader size={15} color={"#0D6EFD"} loading={loading} />
        ) : (
          <span className={`badge rounded-pill p-2 text-uppercase px-3 ${getStatusClass(orderDetails?.order?.status)}`}>
            <i className="bx bxs-circle me-1"></i>
            {orderDetails?.order?.status}
          </span>
        )}
      </p>

      <h3>Items in Order</h3>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={40} color="#0D6EFD" /> {/* Spinner */}
        </div>
      ) : (
        <ul className="list-group">
          {orderDetails?.items?.map((item) => (
            <li key={item.id} className="list-group-item d-flex align-items-center">
              <img
                src={`http://onlinestore.test/uploads/${item?.product_img}`}
                alt={item?.product_name || "Unknown Product"}
                style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", marginRight: "10px" }}
              />
              <strong>{item?.product_name || "Unknown Product"}</strong>
              - Quantity: {item?.quantity} - Price: Rs. {item?.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
