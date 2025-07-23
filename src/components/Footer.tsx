import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { restaurantInfo } from '../data/menuData';
import logo from '../Images/finallogo.png';
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className=" flex items-center justify-center mr-3">
                <img src={logo} alt="Srimatha Logo" className="w-auto h-24" />
              </div>
              <div>
                {/* <h3 className="text-2xl font-bold">{restaurantInfo.name}</h3> */}
                {/* <p className="text-gray-400 text-sm">{restaurantInfo.tagline}</p> */}
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {restaurantInfo.tagline} We're committed to creating memorable dining experiences for every occasion with authentic flavors and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/g/16uuVxDBD9/?mibextid=wwXIfr" target="_blank" className="bg-gray-700 hover:bg-[#501608] p-3 rounded-full transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/sri_matha_foodcourt?igsh=NXNnb3NsczVhYXln" target="_blank" className="bg-gray-700 hover:bg-[#501608] p-3 rounded-full transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" target="_blank" className="bg-gray-700 hover:bg-[#501608] p-3 rounded-full transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" target="_blank" className="bg-gray-700 hover:bg-[#501608] p-3 rounded-full transition-colors duration-300">
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
                <span className="text-gray-300 text-sm">
                  {restaurantInfo.address.line1}<br />
                  {restaurantInfo.address.line2}<br />
                  {restaurantInfo.address.line3}
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 flex-shrink-0 text-orange-400" size={18} />
                <div className="text-gray-300 text-sm">
                  {/* <div>{restaurantInfo.phone}</div> */}
                  <div>{restaurantInfo.mobile}</div>
                </div>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 flex-shrink-0 text-orange-400" size={18} />
                <span className="text-gray-300 text-sm">info@srimatha.com</span>
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
              © 2025 {restaurantInfo.name} Restaurant. All rights reserved.
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