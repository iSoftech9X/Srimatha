import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Srimath</h3>
                <p className="text-gray-400 text-sm">Restaurant • Food Court • Catering</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience the finest culinary journey with our exceptional restaurant, diverse food court, and premium catering services. We're committed to creating memorable dining experiences for every occasion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-700 hover:bg-orange-600 p-3 rounded-full transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-orange-600 p-3 rounded-full transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-orange-600 p-3 rounded-full transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-gray-700 hover:bg-orange-600 p-3 rounded-full transition-colors duration-300">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Home</a></li>
              <li><a href="#about" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">About Us</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Services</a></li>
              <li><a href="#menu" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Menu</a></li>
              <li><a href="#gallery" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Gallery</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 mt-1 flex-shrink-0 text-orange-400" size={18} />
                <span className="text-gray-300 text-sm">123 Food Street, Gourmet District, Culinary City, CC 560001</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 flex-shrink-0 text-orange-400" size={18} />
                <span className="text-gray-300 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 flex-shrink-0 text-orange-400" size={18} />
                <span className="text-gray-300 text-sm">info@srimath.com</span>
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h5 className="font-semibold mb-2 text-orange-400">Operating Hours</h5>
              <p className="text-gray-300 text-sm">
                Monday - Sunday<br />
                11:00 AM - 11:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Srimath Restaurant. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors duration-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;