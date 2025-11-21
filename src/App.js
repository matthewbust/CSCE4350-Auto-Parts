import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { cartAPI } from './services/api';

// Components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import StaffDashboard from './pages/StaffDashboard';
import PartsListing from './pages/PartsListing';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    // merge local cart (if any) into server cart
    try {
      const raw = localStorage.getItem('localCart');
      if (raw) {
        const local = JSON.parse(raw);
        if (Array.isArray(local) && local.length > 0 && userData && userData.customerId) {
          for (const item of local) {
            try {
              await cartAPI.addToCart(userData.customerId, item.part_id, item.quantity || 1);
            } catch (err) {
              // non-fatal: log and continue
              console.warn('Failed to merge cart item', item, err?.response?.data || err);
            }
          }
          localStorage.removeItem('localCart');
        }
      }
    } catch (err) {
      console.error('Error merging local cart on login', err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check for existing session
  React.useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<PartsListing user={user} />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to={user.role === 'customer' ? '/dashboard' : '/staff'} /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register onRegister={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={user && user.role === 'customer' ? <CustomerDashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/staff" 
              element={user && user.role === 'staff' ? <StaffDashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/parts" 
              element={<PartsListing user={user} />} 
            />
            <Route 
              path="/cart" 
              element={<Cart user={user} />} 
            />
            <Route 
              path="/orders" 
              element={user ? <OrderHistory user={user} /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
