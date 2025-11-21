import React, { useState, useEffect } from 'react';
import { partsAPI, cartAPI } from '../services/api';
import './PartsListing.css';

function PartsListing({ user }) {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchParts();
  }, [category]);

  const fetchParts = async () => {
    try {
      setLoading(true);
      const params = category !== 'all' ? { category } : {};
      const response = await partsAPI.getAllParts(params);
      setParts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load parts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchParts();
      return;
    }

    try {
      setLoading(true);
      const response = await partsAPI.searchParts(searchQuery);
      setParts(response.data);
      setError('');
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (partId) => {
    if (!user) {
      // redirect anonymous users to login to complete the action
      setMessage('Please login to add items to cart');
      setTimeout(() => setMessage(''), 2000);
      window.location.href = '/login';
      return;
    }

    if (user.role !== 'customer') {
      setMessage('Only customers can add items to cart');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      await cartAPI.addToCart(user.customerId, partId, 1);
      setMessage('Item added to cart successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add item to cart');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const filteredParts = parts.filter(part => 
    part.status === 'available'
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>Auto Parts Catalog</h1>
        <p>Browse our extensive collection of quality auto parts</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-info'}`}>
          {message}
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <div className="parts-controls">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search parts by name or part number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="filter-group">
          <label>Category:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="engine">Engine</option>
            <option value="brakes">Brakes</option>
            <option value="suspension">Suspension</option>
            <option value="electrical">Electrical</option>
            <option value="exhaust">Exhaust</option>
            <option value="transmission">Transmission</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading parts...</div>
      ) : (
        <div className="parts-grid">
          {filteredParts.length === 0 ? (
            <div className="no-results">
              <p>No parts found matching your criteria</p>
            </div>
          ) : (
            filteredParts.map((part) => (
              <div key={part.part_id} className="part-card">
                <div className="part-header">
                  <h3>{part.name}</h3>
                  <span className="part-number">#{part.part_number}</span>
                </div>
                <div className="part-body">
                  <p className="part-description">{part.description || 'No description available'}</p>
                  <div className="part-details">
                    <div className="detail-row">
                      <span className="label">Manufacturer:</span>
                      <span>{part.manufacturer || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Category:</span>
                      <span>{part.category || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Status:</span>
                      <span className="status-badge">{part.status}</span>
                    </div>
                  </div>
                </div>
                <div className="part-footer">
                  <span className="price">${parseFloat(part.price).toFixed(2)}</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(part.part_id)}
                    disabled={user && user.role !== 'customer'}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PartsListing;
