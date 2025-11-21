import React, { useState, useEffect } from 'react';
import { customerAPI, orderAPI } from '../services/api';
import './Dashboard.css';

function CustomerDashboard({ user }) {
  const [profile, setProfile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, vehiclesRes, ordersRes] = await Promise.all([
        customerAPI.getProfile(user.customerId),
        customerAPI.getVehicles(user.customerId),
        orderAPI.getOrdersByCustomer(user.customerId)
      ]);
      
      setProfile(profileRes.data);
      setVehicles(vehiclesRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container loading">Loading dashboard...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Welcome back, {profile?.first_name}!</h1>
        <p>Manage your account and view your activity</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Profile Information</h2>
          <div className="info-group">
            <div className="info-row">
              <span className="label">Name:</span>
              <span>{profile?.first_name} {profile?.last_name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span>{profile?.email}</span>
            </div>
            <div className="info-row">
              <span className="label">Phone:</span>
              <span>{profile?.phone || 'Not provided'}</span>
            </div>
            <div className="info-row">
              <span className="label">Address:</span>
              <span>{profile?.address || 'Not provided'}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>My Vehicles</h2>
          {vehicles.length === 0 ? (
            <p className="empty-message">No vehicles added yet</p>
          ) : (
            <div className="vehicles-list">
              {vehicles.map((vehicle) => (
                <div key={vehicle.vehicle_id} className="vehicle-item">
                  <strong>{vehicle.year} {vehicle.make} {vehicle.model}</strong>
                  {vehicle.vin && <span className="vin">VIN: {vehicle.vin}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card full-width">
          <h2>Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="empty-message">No orders yet</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td>#{order.order_id}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
