import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password, role) => 
    api.post('/auth/login', { email, password, role }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  logout: () => 
    api.post('/auth/logout'),
};

// Parts APIs
export const partsAPI = {
  getAllParts: (params) => 
    api.get('/parts', { params }),
  
  getPartById: (id) => 
    api.get(`/parts/${id}`),
  
  searchParts: (query) => 
    api.get('/parts/search', { params: { q: query } }),
  
  createPart: (partData) => 
    api.post('/parts', partData),
  
  updatePart: (id, partData) => 
    api.put(`/parts/${id}`, partData),
  
  deletePart: (id) => 
    api.delete(`/parts/${id}`),
};

// Cart APIs
export const cartAPI = {
  getCart: (customerId) => 
    api.get(`/cart/${customerId}`),
  
  addToCart: (customerId, partId, quantity) => 
    api.post('/cart', { customerId, partId, quantity }),
  
  updateCartItem: (cartItemId, quantity) => 
    api.put(`/cart/${cartItemId}`, { quantity }),
  
  removeFromCart: (cartItemId) => 
    api.delete(`/cart/${cartItemId}`),
  
  clearCart: (customerId) => 
    api.delete(`/cart/clear/${customerId}`),
};

// Order APIs
export const orderAPI = {
  createOrder: (orderData) => 
    api.post('/orders', orderData),
  
  getOrdersByCustomer: (customerId) => 
    api.get(`/orders/customer/${customerId}`),
  
  getOrderById: (orderId) => 
    api.get(`/orders/${orderId}`),
  
  updateOrderStatus: (orderId, status) => 
    api.put(`/orders/${orderId}/status`, { status }),
  
  getAllOrders: (params) => 
    api.get('/orders', { params }),
};

// Customer APIs
export const customerAPI = {
  getProfile: (customerId) => 
    api.get(`/customers/${customerId}`),
  
  updateProfile: (customerId, profileData) => 
    api.put(`/customers/${customerId}`, profileData),
  
  addVehicle: (customerId, vehicleData) => 
    api.post(`/customers/${customerId}/vehicles`, vehicleData),
  
  getVehicles: (customerId) => 
    api.get(`/customers/${customerId}/vehicles`),
};

// Employee APIs
export const employeeAPI = {
  getAllEmployees: (params) => 
    api.get('/employees', { params }),
  
  getEmployeeById: (id) => 
    api.get(`/employees/${id}`),
  
  createEmployee: (employeeData) => 
    api.post('/employees', employeeData),
  
  updateEmployee: (id, employeeData) => 
    api.put(`/employees/${id}`, employeeData),
  
  deleteEmployee: (id) => 
    api.delete(`/employees/${id}`),
};

// Inventory APIs
export const inventoryAPI = {
  getInventory: (storeId, params) => 
    api.get(`/inventory/store/${storeId}`, { params }),
  
  updateInventory: (inventoryId, quantity) => 
    api.put(`/inventory/${inventoryId}`, { quantity }),
  
  getLowStockItems: (storeId) => 
    api.get(`/inventory/store/${storeId}/low-stock`),
};

// Store APIs
export const storeAPI = {
  getAllStores: () => 
    api.get('/stores'),
  
  getStoreById: (id) => 
    api.get(`/stores/${id}`),
  
  createStore: (storeData) => 
    api.post('/stores', storeData),
  
  updateStore: (id, storeData) => 
    api.put(`/stores/${id}`, storeData),
};

// Payment Method APIs
export const paymentAPI = {
  getPaymentMethods: (customerId) => 
    api.get(`/payment-methods/${customerId}`),
  
  addPaymentMethod: (paymentData) => 
    api.post('/payment-methods', paymentData),
  
  updatePaymentMethod: (id, paymentData) => 
    api.put(`/payment-methods/${id}`, paymentData),
  
  deletePaymentMethod: (id) => 
    api.delete(`/payment-methods/${id}`),
  
  setDefaultPaymentMethod: (id) => 
    api.put(`/payment-methods/${id}/set-default`),
};

// Return APIs
export const returnAPI = {
  createReturn: (returnData) => 
    api.post('/returns', returnData),
  
  getReturnsByCustomer: (customerId) => 
    api.get(`/returns/customer/${customerId}`),
  
  updateReturnStatus: (returnId, status) => 
    api.put(`/returns/${returnId}/status`, { status }),
  
  getAllReturns: (params) => 
    api.get('/returns', { params }),
};

// Reports APIs
export const reportsAPI = {
  getDailySales: (date) => 
    api.get('/reports/daily-sales', { params: { date } }),
  
  getWeeklySales: (startDate) => 
    api.get('/reports/weekly-sales', { params: { startDate } }),
  
  getMonthlySales: (year, month) => 
    api.get('/reports/monthly-sales', { params: { year, month } }),
  
  getEmployeeActivity: (employeeId, startDate, endDate) => 
    api.get(`/reports/employee-activity/${employeeId}`, { 
      params: { startDate, endDate } 
    }),
};

export default api;
