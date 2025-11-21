import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';
import './Cart.css';

function Cart({ user }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user && user.customerId) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart(user.customerId);
      setCartItems(response.data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await cartAPI.updateCartItem(cartItemId, newQuantity);
      fetchCart();
    } catch (err) {
      setMessage('Failed to update quantity');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      setMessage('Item removed from cart');
      fetchCart();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to remove item');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setMessage('Your cart is empty');
      return;
    }

    setProcessing(true);
    try {
      const orderData = {
        customerId: user.customerId,
        items: cartItems.map(item => ({
          partId: item.part_id,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price)
        })),
        totalAmount: calculateTotal()
      };

      await orderAPI.createOrder(orderData);
      await cartAPI.clearCart(user.customerId);
      setMessage('Order placed successfully!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return <div className="container loading">Loading cart...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Shopping Cart</h1>
        <p>Review your items before checkout</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-info'}`}>
          {message}
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Browse our parts catalog to add items</p>
          <button className="btn btn-primary" onClick={() => navigate('/parts')}>
            Browse Parts
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.cart_item_id} className="cart-item">
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="part-number">Part #: {item.part_number}</p>
                  <p className="manufacturer">{item.manufacturer}</p>
                </div>
                <div className="item-quantity">
                  <button 
                    className="qty-btn"
                    onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-price">
                  <span className="unit-price">${parseFloat(item.price).toFixed(2)} each</span>
                  <span className="total-price">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
                <button 
                  className="btn-remove"
                  onClick={() => handleRemoveItem(item.cart_item_id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8.25%):</span>
              <span>${(calculateTotal() * 0.0825).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(parseFloat(calculateTotal()) * 1.0825).toFixed(2)}</span>
            </div>
            <button 
              className="btn btn-primary btn-block"
              onClick={handleCheckout}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <button 
              className="btn btn-secondary btn-block"
              onClick={() => navigate('/parts')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
