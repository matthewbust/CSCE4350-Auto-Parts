import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import './OrderHistory.css';

function OrderHistory({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrdersByCustomer(user.customerId);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      setSelectedOrder(response.data);
    } catch (err) {
      console.error('Failed to load order details:', err);
    }
  };

  if (loading) {
    return <div className="container loading">Loading orders...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Order History</h1>
        <p>View all your past orders and their status</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>No orders yet</h2>
          <p>Your order history will appear here once you make a purchase</p>
        </div>
      ) : (
        <div className="orders-container">
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.order_id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.order_id}</h3>
                    <p className="order-date">
                      {new Date(order.order_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-body">
                  <div className="order-info">
                    <div className="info-item">
                      <span className="label">Total Amount:</span>
                      <span className="value">${parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    {order.completed_date && (
                      <div className="info-item">
                        <span className="label">Completed:</span>
                        <span className="value">
                          {new Date(order.completed_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button 
                    className="btn btn-secondary btn-small"
                    onClick={() => handleViewDetails(order.order_id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedOrder && (
            <div className="order-details-modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Order Details - #{selectedOrder.order_id}</h2>
                  <button 
                    className="close-btn"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <div className="detail-section">
                    <h3>Order Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Order Date:</span>
                        <span>{new Date(selectedOrder.order_date).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Status:</span>
                        <span className={`status-badge status-${selectedOrder.status}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Total:</span>
                        <span>${parseFloat(selectedOrder.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.items && selectedOrder.items.length > 0 && (
                    <div className="detail-section">
                      <h3>Order Items</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>Part</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.part_name || `Part #${item.part_id}`}</td>
                              <td>{item.quantity}</td>
                              <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                              <td>${parseFloat(item.subtotal).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
