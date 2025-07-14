import React, { useState } from 'react';
import { Menu, X, Phone, MapPin, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
              <span>040-4859 5886/7</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>Secunderabad-500 003</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>24/7 Catering Service Available</span>
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

            {/* Centered Services Only */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-8">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-gray-700 font-medium">Restaurant</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  <span className="text-gray-700 font-medium">Food Court</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-gray-700 font-medium">Catering</span>
                </span>
              </div>
            </div>

            {/* User Auth */}
            <div className="flex items-center gap-2">
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
        </div>
      </header>
    </>
  );
};

export default Header;