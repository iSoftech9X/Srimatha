import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Star, X, Calendar, Users, Clock, MapPin, Phone, Mail, User, Crown, Award, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { srimathaMenu, menuCategories, restaurantInfo } from '../data/menuData';
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
  premium?: boolean;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
}

const CateringOrdering: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart } = useApp();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CateringPackage | null>(null);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState('non-veg-starters');
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
  const [quoteForm, setQuoteForm] = useState({
    eventType: '',
    guestCount: '',
    eventDate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    specialRequirements: ''
  });
  const [loading, setLoading] = useState(false);

  const cateringPackages: CateringPackage[] = [
    {
      id: 'premium-wedding',
      name: 'Premium Wedding Package',
      description: 'Luxurious wedding feast with premium dishes, live counters, and royal service',
      pricePerPerson: 1200,
      minimumGuests: 100,
      image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Welcome Drinks', 'Live Chaat Counter', 'Premium Appetizers', 'Main Course (5 options)', 'Live Dosa Counter', 'Dessert Station', 'Ice Cream Counter'],
      popular: true,
      premium: true,
      icon: Crown,
      color: 'from-purple-600 to-pink-600',
      features: ['Royal Service', 'Live Counters', 'Premium Ingredients', 'Decoration Included']
    },
    {
      id: 'deluxe-wedding',
      name: 'Deluxe Wedding Package',
      description: 'Complete wedding feast with traditional dishes and excellent service',
      pricePerPerson: 850,
      minimumGuests: 100,
      image: 'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Welcome Drinks', 'Appetizer Platter', 'Main Course (3 options)', 'Dessert Station', 'Traditional Sweets'],
      popular: true,
      icon: Award,
      color: 'from-orange-600 to-red-600',
      features: ['Traditional Menu', 'Professional Service', 'Quality Ingredients', 'Setup Included']
    },
    {
      id: 'corporate-premium',
      name: 'Corporate Premium Package',
      description: 'Professional catering for high-end business events and conferences',
      pricePerPerson: 650,
      minimumGuests: 25,
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Welcome Coffee/Tea', 'Premium Snacks', 'Buffet Setup', 'Vegetarian & Non-Veg Options', 'Beverages', 'Service Staff'],
      icon: Sparkles,
      color: 'from-blue-600 to-indigo-600',
      features: ['Professional Setup', 'Business Friendly', 'Flexible Timing', 'Corporate Service']
    },
    {
      id: 'corporate-standard',
      name: 'Corporate Standard Package',
      description: 'Professional catering for business events and meetings',
      pricePerPerson: 450,
      minimumGuests: 25,
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Tea/Coffee', 'Snacks', 'Buffet Setup', 'Vegetarian & Non-Veg Options', 'Beverages', 'Service Staff'],
      popular: true,
      icon: Users,
      color: 'from-green-600 to-teal-600',
      features: ['Cost Effective', 'Quality Food', 'Professional Service', 'Quick Setup']
    },
    {
      id: 'birthday-deluxe',
      name: 'Birthday Deluxe Package',
      description: 'Special birthday celebration with cake, decorations and festive menu',
      pricePerPerson: 420,
      minimumGuests: 15,
      image: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Custom Birthday Cake', 'Party Snacks', 'Main Course', 'Beverages', 'Decoration Setup', 'Party Games Setup'],
      icon: Star,
      color: 'from-pink-600 to-rose-600',
      features: ['Custom Cake', 'Decorations', 'Party Setup', 'Fun Activities']
    },
    {
      id: 'birthday-standard',
      name: 'Birthday Standard Package',
      description: 'Fun and festive catering for birthday parties',
      pricePerPerson: 320,
      minimumGuests: 15,
      image: 'https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Birthday Cake', 'Party Snacks', 'Beverages', 'Basic Decoration'],
      icon: Star,
      color: 'from-yellow-600 to-orange-600',
      features: ['Birthday Cake', 'Party Food', 'Decorations', 'Affordable']
    },
    {
      id: 'festival-special',
      name: 'Festival Special Package',
      description: 'Traditional dishes for religious and cultural celebrations',
      pricePerPerson: 380,
      minimumGuests: 50,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Traditional Sweets', 'Regional Specialties', 'Prasadam Items', 'Cultural Setup', 'Traditional Decorations'],
      icon: Award,
      color: 'from-amber-600 to-yellow-600',
      features: ['Traditional Menu', 'Cultural Setup', 'Religious Friendly', 'Authentic Taste']
    },
    {
      id: 'family-gathering',
      name: 'Family Gathering Package',
      description: 'Warm and comfortable catering for family events and reunions',
      pricePerPerson: 280,
      minimumGuests: 20,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      items: ['Home Style Cooking', 'Comfort Food', 'Traditional Dishes', 'Family Friendly Service'],
      icon: Users,
      color: 'from-emerald-600 to-green-600',
      features: ['Home Style', 'Comfort Food', 'Family Friendly', 'Affordable']
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

  const filteredMenuItems = srimathaMenu.filter(item => 
    item.category === activeMenuCategory && item.isAvailable
  );

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
    const packageMenuItem = {
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
    toast.success('Package added to cart!');
  };

  const handleAddMenuItemToCart = (item: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      (window as any).openAuthModal?.('login');
      return;
    }
    
    addToCart(item, 1);
    toast.success(`${item.name} added to cart!`);
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

    setLoading(true);

    try {
      // Create catering order data
      const orderData = {
        items: cart,
        totalAmount: cartTotal,
        eventDetails: orderDetails,
        specialInstructions: orderDetails.specialRequirements,
        paymentStatus: 'pending',
        status: 'pending'
      };

      const response = await fetch('/api/catering/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        clearCart();
        setShowCart(false);
        
        // Reset order details
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
      } else {
        throw new Error(result.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/catering/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quoteForm)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setShowQuoteModal(false);
        setQuoteForm({
          eventType: '',
          guestCount: '',
          eventDate: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          specialRequirements: ''
        });
      } else {
        throw new Error(result.message || 'Failed to submit quote request');
      }
    } catch (error) {
      console.error('Quote submission error:', error);
      toast.error(error.message || 'Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
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
                onClick={() => setShowMenuModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
              >
                Browse Menu
              </button>
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

        {/* Catering Packages */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">Our Catering Packages</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cateringPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {pkg.popular && (
                      <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        Popular
                      </div>
                    )}
                    {pkg.premium && (
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Crown size={12} fill="currentColor" />
                        Premium
                      </div>
                    )}
                  </div>
                  <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-r ${pkg.color} rounded-full flex items-center justify-center`}>
                    <pkg.icon className="text-white" size={20} />
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{pkg.name}</h4>
                  <p className="text-gray-600 mb-4 text-sm">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <div className="text-lg font-bold text-orange-600 mb-2">
                      ₹{pkg.pricePerPerson}/person
                    </div>
                    <div className="text-sm text-gray-500">
                      Minimum {pkg.minimumGuests} guests
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Features:</h5>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pkg.features.map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">Includes:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {pkg.items.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                      {pkg.items.length > 3 && (
                        <li className="text-orange-600 text-xs">+{pkg.items.length - 3} more items</li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => handlePackageSelect(pkg)}
                    className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}
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
                  <span className="text-gray-700">{restaurantInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-600" size={20} />
                  <span className="text-gray-700">{restaurantInfo.mobile}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-orange-600" size={20} />
                  <span className="text-gray-700">catering@srimatha.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-orange-600" size={20} />
                  <span className="text-gray-700">24/7 Catering Support</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-orange-600 mt-1" size={20} />
                  <span className="text-gray-700">
                    {restaurantInfo.address.line1}<br />
                    {restaurantInfo.address.line2}<br />
                    {restaurantInfo.address.line3}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-4">Quick Quote Request</h4>
              <button
                onClick={() => setShowQuoteModal(true)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Get Custom Quote
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Browse Our Menu</h3>
                <button
                  onClick={() => setShowMenuModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6 max-h-32 overflow-y-auto">
                {menuCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveMenuCategory(category.id)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                      activeMenuCategory === category.id
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredMenuItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                      <span className="text-orange-600 font-bold">₹{item.price}</span>
                    </div>
                    <p className="text-gray-600 text-xs mb-3">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {item.isVegetarian && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">VEG</span>
                        )}
                        {item.popular && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">Popular</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddMenuItemToCart(item)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredMenuItems.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No items available in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                <div className="relative mb-4">
                  <img
                    src={selectedPackage.image}
                    alt={selectedPackage.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className={`absolute top-2 right-2 w-10 h-10 bg-gradient-to-r ${selectedPackage.color} rounded-full flex items-center justify-center`}>
                    <selectedPackage.icon className="text-white" size={16} />
                  </div>
                </div>
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

      {/* Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Request Custom Quote</h3>
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Event Type *</label>
                    <select
                      value={quoteForm.eventType}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, eventType: e.target.value }))}
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
                      value={quoteForm.guestCount}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, guestCount: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Number of guests"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Event Date *</label>
                  <input
                    type="date"
                    value={quoteForm.eventDate}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Contact Name *</label>
                    <input
                      type="text"
                      value={quoteForm.contactName}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, contactName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Contact Phone *</label>
                    <input
                      type="tel"
                      value={quoteForm.contactPhone}
                      onChange={(e) => setQuoteForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Email *</label>
                  <input
                    type="email"
                    value={quoteForm.contactEmail}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Special Requirements</label>
                  <textarea
                    value={quoteForm.specialRequirements}
                    onChange={(e) => setQuoteForm(prev => ({ ...prev, specialRequirements: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="Any specific requirements, dietary restrictions, budget range, etc."
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                  >
                    {loading ? 'Submitting...' : 'Get Quote'}
                  </button>
                </div>
              </form>
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
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  {loading ? 'Placing Order...' : 'Place Catering Order'}
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