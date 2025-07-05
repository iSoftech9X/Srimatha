import React, { useState } from 'react';
import { Menu, X, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  const handleOrderOnline = () => {
    navigate('/order');
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
              
              <button 
                onClick={handleOrderOnline}
                className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors duration-200 font-medium"
              >
                Order Online
              </button>
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
              <button 
                onClick={handleOrderOnline}
                className="w-full bg-orange-600 text-white py-2 rounded-full hover:bg-orange-700 transition-colors duration-200 font-medium mt-4"
              >
                Order Online
              </button>
              <button
                onClick={() => navigate('/admin')}
                className="w-full bg-gray-600 text-white py-2 rounded-full hover:bg-gray-700 transition-colors duration-200 font-medium"
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