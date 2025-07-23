import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, MenuItem, Order, CartItem, AdminStats } from '../types';
import { menuAPI, ordersAPI, customersAPI, adminAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface AppContextType {
  // Customer data
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Menu data
  menuItems: MenuItem[];
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  fetchMenuItems: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Cart functionality
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  fetchOrders: () => Promise<void>;
  
  // Admin stats
  adminStats: AdminStats;
  fetchAdminStats: () => Promise<void>;
  
  // Auth
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  
  // Loading states
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
    popularItems: []
  });
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch initial data
  useEffect(() => {
    fetchMenuItems();
    if (user?.role === 'admin') {
      fetchAdminStats();
      fetchOrders();
      fetchCustomers();
    }
  }, [user]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getItems({ limit: 100 });
      setMenuItems(response.data.data.items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAllOrders({ limit: 100 });
      console.log('Fetched orders response:', response.data);
      // Normalize order property names for frontend compatibility
      const normalizedOrders = response.data.data.orders.map((order: any) => ({
        ...order,
        customerName: order.customerName || order.customer_name || '',
        customerPhone: order.customerPhone || order.customer_phone || '',
        customerEmail: order.customerEmail || order.customer_email || '',
        orderDate: order.orderDate || order.order_date || order.createdAt || order.created_at,
        items: order.items || order.order_items || [],
        totalAmount: order.totalAmount || order.total_amount || 0,
        paymentStatus: order.paymentStatus || order.payment_status || 'pending',
        orderType: order.orderType || order.order_type || '',
        status: order.status || 'pending',
      }));
      setOrders(normalizedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getCustomers({ limit: 100 });
      setCustomers(response.data.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await adminAPI.getDashboard();
      const data = response.data.data;
      
      setAdminStats({
        totalCustomers: data.overview.totalCustomers,
        totalOrders: data.overview.totalOrders,
        totalRevenue: data.overview.totalRevenue,
        todayOrders: data.overview.todayOrders,
        pendingOrders: data.overview.pendingOrders,
        popularItems: data.popularItems
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to load dashboard statistics');
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    try {
      // Call backend to create customer
      const response = await customersAPI.createCustomer(customerData);
      const newCustomer = response.data.data.customer;
      setCustomers(prev => [...prev, newCustomer]);
      toast.success('Customer added successfully');
    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast.error(error.response?.data?.message || 'Failed to add customer');
    }
  };

  const updateCustomer = async (id: string, customerUpdate: Partial<Customer>) => {
    try {
      // Call backend to update customer
      const response = await customersAPI.updateCustomer(id, customerUpdate);
      const updatedCustomer = response.data.data.customer;
      setCustomers(prev => prev.map(customer =>
        customer.id === id ? { ...customer, ...updatedCustomer } : customer
      ));
      toast.success('Customer updated successfully');
    } catch (error: any) {
      console.error('Error updating customer:', error);
      toast.error(error.response?.data?.message || 'Failed to update customer');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      // Call backend to delete customer
      await customersAPI.deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      toast.success('Customer deleted successfully');
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast.error(error.response?.data?.message || 'Failed to delete customer');
    }
  };

  const updateMenuItem = async (id: string, itemUpdate: Partial<MenuItem>) => {
    try {
      await menuAPI.updateItem(id, itemUpdate);
      setMenuItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...itemUpdate } : item
      ));
      toast.success('Menu item updated successfully');
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>) => {
    try {
      const response = await menuAPI.createItem(itemData);
      const newItem = response.data.data.item;
      setMenuItems(prev => [...prev, newItem]);
      toast.success('Menu item added successfully');
    } catch (error) {
      console.error('Error adding menu item:', error);
      // toast.error('Failed to add menu item');
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await menuAPI.deleteItem(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const addToCart = (item: MenuItem, quantity: number, specialInstructions?: string) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(prev => prev.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      const cartItem: CartItem = {
        id: item.id,
        menuItem: item,
        quantity,
        specialInstructions
      };
      setCart(prev => [...prev, cartItem]);
    }
    
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const addOrder = async (orderData: any) => {
    try {
      const response = await ordersAPI.createOrder(orderData);
      const newOrder = response.data.data.order;
      
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      toast.success('Order placed successfully!');
      
      return { success: true, order: newOrder };
    } catch (error) {
      console.error('Error creating order:', error);
      const message = error.response?.data?.message || 'Failed to place order';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await ordersAPI.updateOrderStatus(orderId, { status });
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <AppContext.Provider value={{
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      menuItems,
      updateMenuItem,
      addMenuItem,
      deleteMenuItem,
      fetchMenuItems,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      addOrder,
      updateOrderStatus,
      fetchOrders,
      adminStats,
      fetchAdminStats,
      isAdmin,
      setIsAdmin,
      loading,
      setLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};