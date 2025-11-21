import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🚗 Auto Parts Store
        </Link>
        <div className="navbar-menu">
          <Link to="/parts" className="navbar-link">
            Parts
          </Link>
          {user ? (
            <>
              {user.role === 'customer' && (
                <>
                  <Link to="/cart" className="navbar-link">
                    🛒 Cart
                  </Link>
                  <Link to="/orders" className="navbar-link">
                    Orders
                  </Link>
                  <Link to="/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                </>
              )}
              {user.role === 'staff' && (
                <Link to="/staff" className="navbar-link">
                  Staff Dashboard
                </Link>
              )}
              <span className="navbar-link">
                Welcome, {user.firstName || user.email}
              </span>
              <button onClick={onLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
