import React, { useState } from 'react';
import { Menu, X, Phone, MapPin, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Menu', href: '#menu' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleRestaurantOrder = () => {
    window.location.href = 'https://srimatha.co.in/';
  };

  const handleFoodCourtOrder = () => {
    window.location.href = 'https://srimatha.co.in/';
  };

  const handleCateringOrder = () => {
    navigate('/catering');
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      (window as any).openAuthModal?.('login');
    }
  };

  return (
    <>
      {/* Top Contact Bar */}
      <div className="hidden md:block bg-orange-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>123 Food Street, Gourmet City</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>Open Daily: 11:00 AM - 11:00 PM</span>
            <button
              onClick={() => navigate('/admin')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Srimatha</h1>
              </div>
            </div>

            {/* Services Indicator */}
            <div className="hidden lg:flex items-center gap-6">
              <p className="text-base text-gray-600 flex gap-4 items-center">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Restaurant
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Food Court
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Catering
                </span>
              </p>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Order Buttons */}
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-full hover:bg-orange-700 transition-colors duration-200 font-medium">
                    Order Now
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <button
                        onClick={handleRestaurantOrder}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        Restaurant
                      </button>
                      <button
                        onClick={handleFoodCourtOrder}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        Food Court
                      </button>
                      <button
                        onClick={handleCateringOrder}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                      >
                        Catering
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Auth */}
                <button
                  onClick={handleAuthAction}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  {isAuthenticated ? (
                    <>
                      <LogOut size={16} />
                      Logout
                    </>
                  ) : (
                    <>
                      <User size={16} />
                      Login
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left py-2 text-gray-700 hover:text-orange-600 font-medium"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Mobile Order Buttons */}
              <div className="pt-4 space-y-2">
                <button 
                  onClick={handleRestaurantOrder}
                  className="w-full bg-red-600 text-white py-2 rounded-full hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Restaurant Order
                </button>
                <button 
                  onClick={handleFoodCourtOrder}
                  className="w-full bg-yellow-600 text-white py-2 rounded-full hover:bg-yellow-700 transition-colors duration-200 font-medium"
                >
                  Food Court Order
                </button>
                <button 
                  onClick={handleCateringOrder}
                  className="w-full bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Catering Order
                </button>
                <button
                  onClick={handleAuthAction}
                  className="w-full bg-gray-600 text-white py-2 rounded-full hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                  {isAuthenticated ? (
                    <>
                      <LogOut size={16} />
                      Logout ({user?.name})
                    </>
                  ) : (
                    <>
                      <User size={16} />
                      Login
                    </>
                  )}
                </button>
              </div>
              
              <button
                onClick={() => navigate('/admin')}
                className="w-full bg-gray-800 text-white py-2 rounded-full hover:bg-gray-900 transition-colors duration-200 font-medium mt-2"
              >
                Admin Panel
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;