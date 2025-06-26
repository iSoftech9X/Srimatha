import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, MenuItem, Order, CartItem, AdminStats } from '../types';

interface AppContextType {
  // Customer data
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Menu data
  menuItems: MenuItem[];
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  
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
  
  // Admin stats
  adminStats: AdminStats;
  
  // Auth
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
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
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      address: '123 MG Road, Bangalore, Karnataka 560001',
      joinDate: '2024-01-15',
      totalOrders: 12,
      totalSpent: 8500,
      status: 'active'
    },
    {
      id: '2',
      name: 'Raj Patel',
      email: 'raj.patel@email.com',
      phone: '+91 87654 32109',
      address: '456 Park Street, Mumbai, Maharashtra 400001',
      joinDate: '2024-02-20',
      totalOrders: 8,
      totalSpent: 5200,
      status: 'active'
    },
    {
      id: '3',
      name: 'Anita Singh',
      email: 'anita.singh@email.com',
      phone: '+91 76543 21098',
      address: '789 Civil Lines, Delhi, Delhi 110001',
      joinDate: '2024-03-10',
      totalOrders: 15,
      totalSpent: 12300,
      status: 'active'
    }
  ]);

  const [menuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Crispy Calamari',
      description: 'Fresh squid rings with tangy marinara sauce',
      price: 450,
      image: 'https://images.pexels.com/photos/725996/pexels-photo-725996.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'appetizers',
      popular: true,
      available: true,
      ingredients: ['Squid', 'Flour', 'Marinara Sauce', 'Herbs'],
      allergens: ['Seafood', 'Gluten']
    },
    {
      id: '2',
      name: 'Paneer Tikka',
      description: 'Marinated cottage cheese grilled to perfection',
      price: 420,
      image: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'appetizers',
      popular: true,
      available: true,
      ingredients: ['Paneer', 'Yogurt', 'Spices', 'Bell Peppers'],
      allergens: ['Dairy']
    },
    {
      id: '3',
      name: 'Butter Chicken',
      description: 'Tender chicken in rich tomato and cream sauce',
      price: 650,
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'main-course',
      popular: true,
      available: true,
      ingredients: ['Chicken', 'Tomato', 'Cream', 'Butter', 'Spices'],
      allergens: ['Dairy']
    },
    {
      id: '4',
      name: 'Vegetable Biryani',
      description: 'Aromatic basmati rice with mixed vegetables',
      price: 480,
      image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'main-course',
      popular: true,
      available: true,
      ingredients: ['Basmati Rice', 'Mixed Vegetables', 'Saffron', 'Spices'],
      allergens: []
    },
    {
      id: '5',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center',
      price: 320,
      image: 'https://images.pexels.com/photos/8844893/pexels-photo-8844893.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'desserts',
      popular: true,
      available: true,
      ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'],
      allergens: ['Eggs', 'Gluten', 'Dairy']
    },
    {
      id: '6',
      name: 'Mango Lassi',
      description: 'Traditional yogurt drink with fresh mango',
      price: 180,
      image: 'https://images.pexels.com/photos/19764735/pexels-photo-19764735.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      category: 'beverages',
      popular: true,
      available: true,
      ingredients: ['Fresh Mango', 'Yogurt', 'Sugar', 'Cardamom'],
      allergens: ['Dairy']
    }
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD001',
      customerId: '1',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      customerEmail: 'priya.sharma@email.com',
      items: [
        {
          id: '1',
          menuItem: menuItems[0],
          quantity: 2,
          specialInstructions: 'Extra spicy'
        }
      ],
      totalAmount: 900,
      status: 'preparing',
      orderType: 'dine-in',
      orderDate: new Date().toISOString(),
      paymentStatus: 'paid',
      paymentMethod: 'card'
    }
  ]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = {
      ...customer,
      id: Date.now().toString()
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, customerUpdate: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...customerUpdate } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  const updateMenuItem = (id: string, itemUpdate: Partial<MenuItem>) => {
    // In a real app, this would update the menu items
    console.log('Update menu item:', id, itemUpdate);
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
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
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
  };

  const addOrder = (order: Omit<Order, 'id'>) => {
    const newOrder = {
      ...order,
      id: `ORD${Date.now()}`
    };
    setOrders(prev => [...prev, newOrder]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const adminStats: AdminStats = {
    totalCustomers: customers.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    todayOrders: orders.filter(order => 
      new Date(order.orderDate).toDateString() === new Date().toDateString()
    ).length,
    pendingOrders: orders.filter(order => order.status === 'pending').length,
    popularItems: menuItems.filter(item => item.popular).slice(0, 5)
  };

  return (
    <AppContext.Provider value={{
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      menuItems,
      updateMenuItem,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      addOrder,
      updateOrderStatus,
      adminStats,
      isAdmin,
      setIsAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};