import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star, X, MapPin, Phone, User, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { srimathaMenu, menuCategories, restaurantInfo } from '../data/menuData';
import toast from 'react-hot-toast';

const UserOrdering: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const { user, isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState('non-veg-starters');
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderType: 'delivery',
    deliveryAddress: '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    paymentMethod: 'cash',
    specialInstructions: ''
  });

  const filteredItems = srimathaMenu.filter(item => 
    item.category === activeCategory && item.isAvailable
  );

  const cartTotal = cart.reduce((total, item) => 
    total + (item.menuItem.price * item.quantity), 0
  );

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const deliveryFee = orderDetails.orderType === 'delivery' ? 50 : 0;
  const tax = Math.round(cartTotal * 0.05); // 5% tax
  const finalTotal = cartTotal + deliveryFee + tax;

  const handleAddToCart = (item: any, quantity: number = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      (window as any).openAuthModal?.('login');
      return;
    }
    
    addToCart(item, quantity, specialInstructions);
    setSelectedItem(null);
    setSpecialInstructions('');
    toast.success(`${item.name} added to cart!`);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place order');
      (window as any).openAuthModal?.('login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (orderDetails.orderType === 'delivery' && !orderDetails.deliveryAddress.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (!orderDetails.contactPhone.trim()) {
      toast.error('Please enter contact phone number');
      return;
    }

    try {
      const orderData = {
        customerId: user?.id,
        customerName: user?.name,
        customerPhone: orderDetails.contactPhone,
        customerEmail: orderDetails.contactEmail || user?.email,
        items: cart,
        totalAmount: finalTotal,
        orderType: orderDetails.orderType,
        deliveryAddress: orderDetails.orderType === 'delivery' ? orderDetails.deliveryAddress : undefined,
        specialInstructions: orderDetails.specialInstructions,
        paymentMethod: orderDetails.paymentMethod,
        paymentStatus: 'pending',
        status: 'pending'
      };

      // Simulate API call
      console.log('Placing order:', orderData);
      
      // Create order ID
      const orderId = `ORD${Date.now()}`;
      
      // Clear cart and show success
      clearCart();
      setShowCart(false);
      setShowCheckout(false);
      
      toast.success(`Order placed successfully! Order ID: ${orderId}`);
      
      // Reset order details
      setOrderDetails({
        orderType: 'delivery',
        deliveryAddress: '',
        contactPhone: user?.phone || '',
        contactEmail: user?.email || '',
        paymentMethod: 'cash',
        specialInstructions: ''
      });

    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <User className="mx-auto text-orange-600 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800">Login Required</h2>
            <p className="text-gray-600 mt-2">Please login to start ordering</p>
          </div>
          <button
            onClick={() => (window as any).openAuthModal?.('login')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Login to Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order Online</h1>
              <p className="text-gray-600">Welcome, {user?.name}! Choose from our delicious menu</p>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300"
            >
              <ShoppingCart size={20} />
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Restaurant Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-600 mb-2">{restaurantInfo.name}</h2>
            <p className="text-gray-600 mb-4">{restaurantInfo.tagline}</p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Phone size={16} className="text-orange-600" />
                <span>{restaurantInfo.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone size={16} className="text-orange-600" />
                <span>{restaurantInfo.mobile}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin size={16} className="text-orange-600" />
                <span>{restaurantInfo.address.line1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-6xl mx-auto">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {item.popular && (
                    <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star size={12} fill="currentColor" />
                      Popular
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      VEG
                    </span>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <span className="text-xl font-bold text-orange-600">₹{item.price}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                
                {item.preparationTime && (
                  <div className="text-xs text-gray-500 mb-3">
                    ⏱️ {item.preparationTime} mins
                  </div>
                )}

                <button
                  onClick={() => setSelectedItem(item)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full font-semibold transition-colors duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items available in this category</p>
          </div>
        )}
      </div>

      {/* Add to Cart Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Add to Cart</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-semibold text-gray-800">{selectedItem.name}</h4>
                <p className="text-gray-600 text-sm">{selectedItem.description}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">₹{selectedItem.price}</p>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Any special requests..."
                />
              </div>

              <button
                onClick={() => handleAddToCart(selectedItem)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Your Cart</h3>
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
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                        <div>
                          <h4 className="font-medium text-gray-800">{item.menuItem.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.menuItem.price}</p>
                          {item.specialInstructions && (
                            <p className="text-xs text-orange-600">Note: {item.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%):</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee:</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-orange-600">₹{finalTotal}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Checkout</h3>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Type */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Order Type *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['delivery', 'takeaway', 'dine-in'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderDetails(prev => ({ ...prev, orderType: type }))}
                        className={`p-3 rounded-lg border-2 font-medium capitalize transition-colors duration-200 ${
                          orderDetails.orderType === type
                            ? 'border-orange-600 bg-orange-50 text-orange-600'
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Contact Phone *</label>
                    <input
                      type="tel"
                      value={orderDetails.contactPhone}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={orderDetails.contactEmail}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your email address"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                {orderDetails.orderType === 'delivery' && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Delivery Address *</label>
                    <textarea
                      value={orderDetails.deliveryAddress}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows={3}
                      placeholder="Complete delivery address with landmarks"
                      required
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Payment Method *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'cash', label: 'Cash on Delivery' },
                      { value: 'upi', label: 'UPI Payment' },
                      { value: 'card', label: 'Card Payment' },
                      { value: 'online', label: 'Online Payment' }
                    ].map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setOrderDetails(prev => ({ ...prev, paymentMethod: method.value }))}
                        className={`p-3 rounded-lg border-2 font-medium text-sm transition-colors duration-200 ${
                          orderDetails.paymentMethod === method.value
                            ? 'border-orange-600 bg-orange-50 text-orange-600'
                            : 'border-gray-300 hover:border-orange-300'
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Special Instructions</label>
                  <textarea
                    value={orderDetails.specialInstructions}
                    onChange={(e) => setOrderDetails(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                    placeholder="Any special requests for your order..."
                  />
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items ({cartItemCount}):</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5%):</span>
                      <span>₹{tax}</span>
                    </div>
                    {orderDetails.orderType === 'delivery' && (
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>₹{deliveryFee}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span className="text-orange-600">₹{finalTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors duration-300"
                >
                  Place Order - ₹{finalTotal}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdering;