import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token
      if (!token) {
        console.error("No token found! User is not authenticated.");
        return;
      }

      const response = await axios.get(
        `http://onlinestore.test/api/orders?page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          withCredentials: true,
        }
      );

      setOrders(response.data.orders);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error.response);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="text-muted">No orders found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered" style={{textAlign: 'center'}}>
            <thead className="table-dark">
              <tr>
                <th>Order #</th>
                <th>Order Date</th>
                <th>Price</th>
                <th>Status</th>
                <th>View Order</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>
                      {order.id}
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>Rs.{order.total_price}</td>
                  <td>
  <span
    className={`badge rounded-pill text-uppercase px-3 py-2
      ${order.status === "completed"
        ? "bg-light-success text-success"
        : order.status === "pending"
        ? "bg-light-warning text-warning"
        : order.status === "cancelled"
        ? "bg-light-danger text-danger"
        : order.status === "processing"
        ? "bg-light-primary text-primary"
        : "bg-light-secondary text-secondary"}
    `}
  >
    <i className="bx bxs-circle me-1"></i> {order.status}
  </span>
</td>
                  <td>
                    <Link to={`/orders/${order.id}`} className="text-primary">
                      View Order
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default Orders;
