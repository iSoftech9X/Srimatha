import axios from 'axios';

// const API_BASE_URL =  'http://localhost:5000/api';
// import.meta.env.VITE_API_URL ||
const API_BASE_URL = 'https://ggm4eesv2d.ap-south-1.awsapprunner.com/api';
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  patchProfile: (userData) => api.patch('/auth/profile', userData),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
  logout: () => api.post('/auth/logout'),
};

// Menu API
export const menuAPI = {
  getItems: (params) => api.get('/menu', { params }),
  getItem: (id) => api.get(`/menu/${id}`),
  getPopularItems: () => api.get('/menu/featured/popular'),
  getCategories: () => api.get('/menu/categories'),
  createItem: (itemData) => api.post('/menu', itemData),
  updateItem: (id, itemData) => api.patch(`/menu/${id}`, itemData),
  // toggleAvailability: (id) => api.patch(`/menu/${id}/availability`),
  deleteItem: (id) => api.delete(`/menu/${id}`),
};

// Orders API
export const ordersAPI = {
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getAllOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  updateOrderStatus: (id, statusData) => api.patch(`/orders/${id}/status`, statusData),
  assignStaff: (id, staffData) => api.patch(`/orders/${id}/assign`, staffData),
  cancelOrder: (id, reason) => api.patch(`/orders/${id}/cancel`, { reason }),
  addReview: (id, reviewData) => api.post(`/orders/${id}/review`, reviewData),
  
};

// Customers API
export const customersAPI = {
  getCustomers: (params) => api.get('/customers', { params }),
  getCustomer: (id) => api.get(`/customers/${id}`),
  createCustomer: (customerData) => api.post('/customers', customerData),
  updateCustomer: (id, customerData) => api.put(`/customers/${id}`, customerData),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
  updateCustomerStatus: (id, statusData) => api.patch(`/customers/${id}/status`, statusData),
  getAnalytics: () => api.get('/customers/analytics/overview'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  //getSalesAnalytics: (params) => api.get('/admin/analytics/sales', { params }),
  getSettings: () => api.get('/admin/settings'),
  // getAllOrders: (params) => api.get('/orders', { params }),
};

// Contact API
export const contactAPI = {
  submitForm: (contactData) => api.post('/contact', contactData),
  getContacts: (params) => api.get('/contact', { params }),
  getContact: (id) => api.get(`/contact/${id}`),
  updateStatus: (id, statusData) => api.patch(`/contact/${id}/status`, statusData),
  assignContact: (id, assignData) => api.patch(`/contact/${id}/assign`, assignData),
  addResponse: (id, responseData) => api.post(`/contact/${id}/response`, responseData),
  addNote: (id, noteData) => api.post(`/contact/${id}/notes`, noteData),
};

export default api;