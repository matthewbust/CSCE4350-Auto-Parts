import React, { useState, useEffect } from 'react';
import { employeeAPI, orderAPI, inventoryAPI, partsAPI } from '../services/api';
import './Dashboard.css';

function StaffDashboard({ user }) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    totalParts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [ordersRes, partsRes] = await Promise.all([
        orderAPI.getAllOrders({ limit: 10 }),
        partsAPI.getAllParts()
      ]);
      
      const orders = ordersRes.data;
      const parts = partsRes.data;
      
      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        lowStockItems: 0, // Would need inventory API
        totalParts: parts.length
      });
      
      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      fetchDashboardData();
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

  if (loading) {
    return <div className="container loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Staff Dashboard</h1>
        <p>Manage orders, inventory, and system operations</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pendingOrders}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.lowStockItems}</div>
          <div className="stat-label">Low Stock Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalParts}</div>
          <div className="stat-label">Total Parts</div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Recent Orders
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="dashboard-card">
            <h2>System Overview</h2>
            <p>Welcome to the staff dashboard. Use the navigation to manage different aspects of the system.</p>
            <div className="quick-actions">
              <button className="btn btn-primary">Add New Part</button>
              <button className="btn btn-secondary">View Inventory</button>
              <button className="btn btn-secondary">Generate Report</button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-card">
            <h2>Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p className="empty-message">No orders to display</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.order_id}>
                        <td>#{order.order_id}</td>
                        <td>Customer #{order.customer_id}</td>
                        <td>{new Date(order.order_date).toLocaleDateString()}</td>
                        <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {order.status === 'pending' && (
                            <button 
                              className="btn-small btn-primary"
                              onClick={() => handleUpdateOrderStatus(order.order_id, 'completed')}
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffDashboard;
