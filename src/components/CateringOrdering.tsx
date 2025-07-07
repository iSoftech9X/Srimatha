import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Star, X, Calendar, Users, Clock, MapPin, Phone, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../types';
import toast from 'react-hot-toast';

interface CateringPackage {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  minimumGuests: number;
  image: string;
  items: string[];
  popular?: boolean;
}

const CateringOrdering: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { menuItems, cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CateringPackage | null>(null);
  const [orderDetails, setOrderDetails] = useState({
    eventDate: '',
    eventTime: '',
    guestCount: '',
    eventType: '',
    venue: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    specialRequirements: ''
  });

  const cateringPackages: CateringPackage[] = [
    {
      id: 'wedding-deluxe',
      name: 'Wedding Deluxe Package',
      description: 'Complete wedding feast with premium dishes and desserts',
      pricePerPerson: 850,
      minimumGuests: 100,
      image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Welcome Drinks', 'Appetizer Platter', 'Main Course (3 options)', 'Dessert Station', 'Live Counters'],
      popular: true
    },
    {
      id: 'corporate-lunch',
      name: 'Corporate Lunch Package',
      description: 'Professional catering for business events and meetings',
      pricePerPerson: 450,
      minimumGuests: 25,
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Buffet Setup', 'Vegetarian & Non-Veg Options', 'Beverages', 'Service Staff'],
      popular: true
    },
    {
      id: 'birthday-celebration',
      name: 'Birthday Celebration Package',
      description: 'Fun and festive catering for birthday parties',
      pricePerPerson: 320,
      minimumGuests: 15,
      image: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Birthday Cake', 'Party Snacks', 'Beverages', 'Decoration Setup']
    },
    {
      id: 'festival-special',
      name: 'Festival Special Package',
      description: 'Traditional dishes for religious and cultural celebrations',
      pricePerPerson: 380,
      minimumGuests: 50,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Traditional Sweets', 'Regional Specialties', 'Prasadam Items', 'Cultural Setup']
    }
  ];

  const eventTypes = [
    'Wedding', 'Corporate Event', 'Birthday Party', 'Anniversary', 'Festival Celebration',
    'Conference', 'Product Launch', 'Family Gathering', 'Religious Ceremony', 'Other'
  ];

  const cartTotal = cart.reduce((total, item) => 
    total + (item.menuItem.price * item.quantity), 0
  );

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [isAuthenticated]);

  const handlePackageSelect = (pkg: CateringPackage) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedPackage(pkg);
  };

  const handleAddPackageToCart = () => {
    if (!selectedPackage || !orderDetails.guestCount) {
      toast.error('Please fill in guest count');
      return;
    }

    const guestCount = parseInt(orderDetails.guestCount);
    if (guestCount < selectedPackage.minimumGuests) {
      toast.error(`Minimum ${selectedPackage.minimumGuests} guests required for this package`);
      return;
    }

    // Create a menu item from the package
    const packageMenuItem: MenuItem = {
      id: selectedPackage.id,
      name: selectedPackage.name,
      description: `${selectedPackage.description} (${guestCount} guests)`,
      price: selectedPackage.pricePerPerson * guestCount,
      image: selectedPackage.image,
      category: 'catering',
      popular: selectedPackage.popular || false,
      available: true
    };

    addToCart(packageMenuItem, 1, `Event: ${orderDetails.eventType}, Date: ${orderDetails.eventDate}, Guests: ${guestCount}`);
    setSelectedPackage(null);
    setOrderDetails({
      eventDate: '',
      eventTime: '',
      guestCount: '',
      eventType: '',
      venue: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      specialRequirements: ''
    });
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Create real-time order
    const orderData = {
      customerId: user?.id,
      customerName: user?.name,
      customerPhone: orderDetails.contactPhone || user?.phone,
      customerEmail: user?.email,
      items: cart,
      totalAmount: cartTotal,
      orderType: 'catering',
      eventDetails: orderDetails,
      specialInstructions: orderDetails.specialRequirements,
      paymentStatus: 'pending',
      status: 'pending'
    };

    try {
      // Simulate real-time order creation
      const response = await fetch('/api/orders/catering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        toast.success('Catering order placed successfully! We will contact you shortly.');
        clearCart();
        setShowCart(false);
        
        // Real-time notification to admin (simulate WebSocket)
        if (window.EventSource) {
          const eventSource = new EventSource('/api/orders/stream');
          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'new_catering_order') {
              // This would notify admin in real-time
              console.log('New catering order received:', data.order);
            }
          };
        }
      } else {
        throw new Error('Failed to place order');
      }
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
            <p className="text-gray-600 mt-2">Please login to access our catering services</p>
          </div>
          <button
            onClick={() => (window as any).openAuthModal?.('login')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Login to Continue
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
              <h1 className="text-2xl font-bold text-gray-800">Catering Services</h1>
              <p className="text-gray-600">Premium catering for your special events</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 md:p-12 text-white mb-12">
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

        {/* Catering Packages */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Our Catering Packages</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cateringPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-48 object-cover"
                  />
                  {pkg.popular && (
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Star size={14} fill="currentColor" />
                      Popular
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h4>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-lg font-bold text-orange-600 mb-2">
                      ₹{pkg.pricePerPerson}/person
                    </div>
                    <div className="text-sm text-gray-500">
                      Minimum {pkg.minimumGuests} guests
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Includes:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {pkg.items.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePackageSelect(pkg)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Select Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Need Custom Catering?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-6">
                Have specific requirements? Our catering team can create a custom menu tailored to your event needs, dietary restrictions, and budget.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-600" size={20} />
                  <span className="text-gray-700">+91 98765 43211 (Catering)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-orange-600" size={20} />
                  <span className="text-gray-700">catering@srimatha.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-orange-600" size={20} />
                  <span className="text-gray-700">24/7 Catering Support</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Quick Quote Request</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Event Type"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  placeholder="Number of Guests"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold transition-colors duration-300">
                  Get Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Selection Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Configure Your Catering</h3>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <img
                  src={selectedPackage.image}
                  alt={selectedPackage.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="font-semibold text-gray-800">{selectedPackage.name}</h4>
                <p className="text-gray-600 text-sm">{selectedPackage.description}</p>
                <p className="text-lg font-bold text-orange-600 mt-2">
                  ₹{selectedPackage.pricePerPerson}/person (Min. {selectedPackage.minimumGuests} guests)
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Event Type *</label>
                    <select
                      value={orderDetails.eventType}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, eventType: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="">Select Event Type</option>
                      {eventTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Number of Guests *</label>
                    <input
                      type="number"
                      value={orderDetails.guestCount}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, guestCount: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder={`Minimum ${selectedPackage.minimumGuests}`}
                      min={selectedPackage.minimumGuests}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Event Date *</label>
                    <input
                      type="date"
                      value={orderDetails.eventDate}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, eventDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Event Time *</label>
                    <input
                      type="time"
                      value={orderDetails.eventTime}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, eventTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Venue Address *</label>
                  <textarea
                    value={orderDetails.venue}
                    onChange={(e) => setOrderDetails(prev => ({ ...prev, venue: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={2}
                    placeholder="Complete venue address"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Contact Person</label>
                    <input
                      type="text"
                      value={orderDetails.contactPerson}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, contactPerson: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Contact person name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={orderDetails.contactPhone}
                      onChange={(e) => setOrderDetails(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Special Requirements</label>
                  <textarea
                    value={orderDetails.specialRequirements}
                    onChange={(e) => setOrderDetails(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Any dietary restrictions, special arrangements, etc."
                  />
                </div>

                {orderDetails.guestCount && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800">Estimated Total:</span>
                      <span className="text-xl font-bold text-orange-600">
                        ₹{(selectedPackage.pricePerPerson * parseInt(orderDetails.guestCount || '0')).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Final pricing may vary based on specific requirements
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPackageToCart}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
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
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-orange-600">
                          ₹{item.menuItem.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-orange-600">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
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
    </div>
  );
};

export default CateringOrdering;