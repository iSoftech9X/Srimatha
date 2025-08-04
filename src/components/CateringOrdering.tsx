
import React, { useState, useEffect } from 'react';
import { Star, Plus, ShoppingCart, Users, Calendar, X, History, Minus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { menuAPI, ordersAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';
import type { MenuItem } from '../types';
import Header from './Header';


type OrderItem = {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: string;
  special_instructions: string | null;
  name: string;
  description: string;
};

type ApiOrder = {
  id: number;
  order_number: string;
  customer_id: number;
  status: string;
  subtotal: string;
  total: string;
  payment_status: string;
  order_type: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
};

type Address = {
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
};

const CateringOrdering: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { cart, addToCart, removeFromCart, clearCart, updateCartQuantity } = useApp();
  
  const [showCart, setShowCart] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [menuCategories, setMenuCategories] = useState<{id: string, name: string}[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [showCancelForm, setShowCancelForm] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showAddressConfirmation, setShowAddressConfirmation] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: ''
  });
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch user profile data including address
  const fetchUserProfile = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    try {
      const response = await authAPI.getProfile();
      const userData = response.data?.user || response.data?.data?.user;
      
      console.log('User profile data:', userData); // Debug log
      
      if (userData) {
        const newAddress = {
          street: userData.address_street || '',
          city: userData.address_city || '',
          state: userData.address_state || '',
          zipcode: userData.address_zipcode || '',
          country: userData.address_country || ''
        };
        
        console.log('Setting address:', newAddress); // Debug log
        setSelectedAddress(newAddress);
        
        // Update user context if needed
        if (updateUser) {
          updateUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchAllItems = async (page = 1, accumulatedItems: MenuItem[] = []): Promise<MenuItem[]> => {
    try {
      const response = await menuAPI.getItems({
        isAvailable: true,
        page,
        limit: 10000
      });
      
      const newItems = response.data.items || response.data.data?.items || [];
      const allItems = [...accumulatedItems, ...newItems];
      
      if (page < (response.data.totalPages || 1)) {
        return fetchAllItems(page + 1, allItems);
      }
      
      return allItems;
    } catch (error) {
      console.error('Error fetching items:', error);
      return accumulatedItems;
    }
  };

  const fetchOrderHistory = async () => {
    if (!user) return;
    
    setLoadingOrders(true);
    setOrderError('');
    try {
      const response = await ordersAPI.getMyOrders({
        includeItems: true,
        expand: 'items.menu_item'
      });
      setOrders(response.data.orders || response.data.data?.orders || []);
    } catch (err) {
      setOrderError('Failed to load order history');
      console.error('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const cancelOrder = async (id: number) => {
    if (!user || !cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }
    
    setCancellingOrderId(id);
    try {
      await ordersAPI.cancelOrder(id, cancelReason.trim());
      toast.success('Order cancelled successfully');
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status: 'cancelled' } : order
      ));
      setShowCancelForm(null);
      setCancelReason('');
    } catch (err) {
      toast.error('Failed to cancel order. Please try again.');
      console.error('Error cancelling order:', err);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleCancelClick = (orderId: number) => {
    setShowCancelForm(orderId);
    setCancelReason('');
  };

  const handleCancelFormClose = () => {
    setShowCancelForm(null);
    setCancelReason('');
  };

  const handleIncrement = (cartItemId: string) => {
    const item = cart.find(item => item.id === cartItemId);
    if (item) {
      updateCartQuantity(cartItemId, item.quantity + 1);
    }
  };

  const handleDecrement = (cartItemId: string) => {
    const item = cart.find(item => item.id === cartItemId);
    if (item) {
      if (item.quantity > 1) {
        updateCartQuantity(cartItemId, item.quantity - 1);
      } else {
        removeFromCart(cartItemId);
      }
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
  };

  const updateUserAddress = async () => {
    if (!user) return;
    
    setIsUpdatingAddress(true);
    try {
      const patchData = {
        address: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipcode: selectedAddress.zipcode,
          country: selectedAddress.country
        }
      };

      console.log('Sending address update:', patchData); // Debug log
      
      const response = await authAPI.patchProfile(patchData);
      console.log('Update response:', response); // Debug log
      
      toast.success('Address updated successfully!');
      setIsEditingAddress(false);
      
      // Refresh profile data after update
      await fetchUserProfile();

    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address. Please try again.');
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const orderPayload = {
        userName: user?.name,           
        userEmail: user?.email,         
        userPhone: user?.phone, 
        address: selectedAddress,
        items: cart.map(item => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name, 
          quantity: item.quantity,
          price: item.menuItem.price,
          specialInstructions: item.specialInstructions
        })),
        subtotal: cartTotal,
        total: cartTotal,
        paymentStatus: 'pending',
        orderType: 'catering',
      };

      await ordersAPI.createOrder(orderPayload);
      toast.success('Order placed successfully!');
      clearCart();
      setShowCart(false);
      setShowAddressConfirmation(false);
      if (showOrderHistory) {
        fetchOrderHistory();
      }
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
      console.error('Error placing order:', err);
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      (window as any).openAuthModal('login');
      return;
    }

    setShowAddressConfirmation(true);
    setIsEditingAddress(false);
    fetchUserProfile(); // Refresh address data before showing confirmation
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, items] = await Promise.all([
          menuAPI.getCategories(),
          fetchAllItems()
        ]);
        
        const categories = categoriesResponse.data.data || [];
        setMenuCategories([{id: 'all', name: 'All Dishes'}, ...categories]);
        setMenuItems(items);
        setAllItemsLoaded(true);
        setError('');
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    fetchUserProfile(); // Initial profile fetch
  }, []);

  useEffect(() => {
    if (showOrderHistory && user) {
      fetchOrderHistory();
    }
  }, [showOrderHistory, user]);

  useEffect(() => {
    if (!allItemsLoaded) return;
    
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('item');
    if (itemId && menuItems.length > 0) {
      const item = menuItems.find((i) => i.id === itemId);
      if (item) {
        addToCart(item, 1);
        params.delete('item');
        window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
      }
    }
  }, [menuItems, allItemsLoaded]);

  const cartTotal = cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const filteredItems = activeCategory === 'all' 
    ? menuItems.filter(item => item.available)
    : menuItems.filter((item) => item.category === activeCategory && item.available);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Catering Services</h1>
              <p className="text-gray-600">Premium catering for your special events</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                <span style={{fontWeight:"bolder", color:"black"}}>Welcome,</span> 
                <span style={{fontWeight:"bolder", color:"#501608"}}> {user?.name}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOrderHistory(!showOrderHistory)}
                  className={`relative px-4 py-3 rounded-full font-medium flex items-center gap-2 transition-colors duration-300 ${
                    showOrderHistory 
                      ? 'bg-[#501608] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <History size={18} />
                  <span className="hidden sm:inline">My Orders</span>
                </button>
                <button
                  onClick={() => setShowCart(true)}
                  className="relative bg-[#501608] hover:bg-[#722010] text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  <ShoppingCart size={20} />
                  <span className="hidden sm:inline">Selected Items</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {showOrderHistory ? (
          <div className="mb-12 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Your Order History</h2>
              <p className="text-gray-600">Past catering orders</p>
            </div>
            
            {loadingOrders ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#501608] border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading your orders...</p>
              </div>
            ) : orderError ? (
              <div className="p-6 text-center text-red-500">{orderError}</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <History size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No past orders found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          Order #{order.order_number || `ORD-${order.id}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-lg font-bold mt-1">₹{parseFloat(order.total).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
                      {order.items && order.items.length > 0 ? (
                        <ul className="space-y-2">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between text-sm">
                              <span>
                                {item.quantity}x <span style={{fontWeight: 'bold'}}>{item.name}</span>
                                {item.special_instructions && (
                                  <span className="text-xs text-gray-500 ml-2">({item.special_instructions})</span>
                                )}
                              </span>
                              <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No item details available</p>
                      )}
                    </div>

                    {/* {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <div className="mt-4">
                        {showCancelForm === order.id ? (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">Cancel Order</h4>
                            <textarea
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Please provide a reason for cancellation..."
                              className="w-full p-2 border border-gray-300 rounded-md mb-2"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={handleCancelFormClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
                              >
                                Back
                              </button>
                              <button
                                onClick={() => cancelOrder(order.id)}
                                disabled={!cancelReason.trim() || cancellingOrderId === order.id}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300 disabled:opacity-50"
                              >
                                {cancellingOrderId === order.id ? 'Cancelling...' : 'Confirm Cancellation'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleCancelClick(order.id)}
                              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300 text-sm font-medium"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    )} */}
                    {order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'delivered' && (
  <div className="mt-4">
    {showCancelForm === order.id ? (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-2">Cancel Order</h4>
        <textarea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Please provide a reason for cancellation..."
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancelFormClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
          >
            Back
          </button>
          <button
            onClick={() => cancelOrder(order.id)}
            disabled={!cancelReason.trim() || cancellingOrderId === order.id}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300 disabled:opacity-50"
          >
            {cancellingOrderId === order.id ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
        </div>
      </div>
    ) : (
      <div className="flex justify-end">
        <button
          onClick={() => handleCancelClick(order.id)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300 text-sm font-medium"
        >
          Cancel Order
        </button>
      </div>
    )}
  </div>
)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="bg-[#501608] rounded-2xl p-8 md:p-12 text-white mb-12">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Make Your Event Unforgettable
                </h2>
                <p className="text-xl mb-6">
                  From intimate gatherings to grand celebrations, our catering services bring exceptional flavors and professional service to your special occasions.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Users className="text-orange-200" size={24} />
                    <span>Any Group Size</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="text-orange-200" size={24} />
                    <span>Flexible Scheduling</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="text-orange-200" size={24} />
                    <span>Premium Quality</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-6xl mx-auto">
              {menuCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-[#501608] hover:bg-[#722010] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-20 text-xl text-gray-500">Loading menu...</div>
            ) : error ? (
              <div className="text-center py-20 text-xl text-red-500">{error}</div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredItems.length === 0 ? (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No items found in this category</p>
                  </div>
                ) : (
                  filteredItems.map((item) => {
                    const cartItem = cart.find(cartItem => cartItem.menuItem.id === item.id);
                    const quantity = cartItem ? cartItem.quantity : 0;
                    
                    return (
                      <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                            {quantity > 0 && (
                              <span className="bg-[#501608] text-white text-xs px-2 py-1 rounded-full">
                                {quantity} in cart
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold" style={{color: "#501608"}}>
                              ₹{item.price.toLocaleString()}
                            </span>
                            {quantity > 0 ? (
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleDecrement(cartItem!.id)}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition-colors duration-300"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="w-8 text-center">{quantity}</span>
                                <button 
                                  onClick={() => handleIncrement(cartItem!.id)}
                                  className="bg-[#501608] hover:bg-[#722010] text-white rounded-full p-2 transition-colors duration-300"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="bg-[#501608] hover:bg-[#722010] text-white py-2 px-4 rounded-full font-semibold transition-colors duration-300 flex items-center gap-2"
                              >
                                <Plus size={16} />
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Catering Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Your catering cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.menuItem.name}</h4>
                          <p className="text-sm text-gray-600">{item.menuItem.description}</p>
                          {item.specialInstructions && (
                            <p className="text-xs text-orange-600 mt-1">
                              <strong>Details:</strong> {item.specialInstructions}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="" style={{color:"#501608"}}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold" style={{color:"#501608"}}>
                          ₹{(item.menuItem.price * item.quantity).toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleDecrement(item.id)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-1 transition-colors duration-300"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleIncrement(item.id)}
                            className="bg-[#501608] hover:bg-[#722010] text-white rounded-full p-1 transition-colors duration-300"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold" style={{color:"#501608"}}>₹{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-[#501608] hover:bg-[#722010] text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Place Catering Order
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Our team will contact you within 2 hours to confirm details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Address Confirmation Modal */}
      {showAddressConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {isEditingAddress ? 'Edit Delivery Address' : 'Confirm Delivery Address'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddressConfirmation(false);
                    setIsEditingAddress(false);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              {loadingProfile ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#501608] border-t-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading address...</p>
                </div>
              ) : isEditingAddress ? (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={selectedAddress.street}
                      onChange={(e) => setSelectedAddress({...selectedAddress, street: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={selectedAddress.city}
                      onChange={(e) => setSelectedAddress({...selectedAddress, city: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={selectedAddress.state}
                        onChange={(e) => setSelectedAddress({...selectedAddress, state: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        value={selectedAddress.zipcode}
                        onChange={(e) => setSelectedAddress({...selectedAddress, zipcode: e.target.value})}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={selectedAddress.country}
                      onChange={(e) => setSelectedAddress({...selectedAddress, country: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="font-medium text-gray-700">Street:</p>
                    <p>{selectedAddress.street || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">City/State/Zip:</p>
                    <p>
                      {selectedAddress.city || 'N/A'}, {selectedAddress.state || 'N/A'} {selectedAddress.zipcode || ''}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Country:</p>
                    <p>{selectedAddress.country || 'Not provided'}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3">
                {isEditingAddress ? (
                  <>
                    <button
                      onClick={() => setIsEditingAddress(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      disabled={isUpdatingAddress}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateUserAddress}
                      className="px-4 py-2 bg-[#501608] text-white rounded-md hover:bg-[#722010]"
                      disabled={isUpdatingAddress}
                    >
                      {isUpdatingAddress ? 'Saving...' : 'Save Address'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      Edit Address
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className="px-4 py-2 bg-[#501608] text-white rounded-md hover:bg-[#722010]"
                    >
                      Confirm & Place Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CateringOrdering;