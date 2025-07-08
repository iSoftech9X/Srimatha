import React, { useState } from 'react';
import { Star, Download, ShoppingCart, Plus } from 'lucide-react';
import { srimathaMenu, menuCategories, restaurantInfo } from '../data/menuData';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('non-veg-starters');
  const { addToCart } = useApp();
  const { isAuthenticated } = useAuth();

  const filteredItems = srimathaMenu.filter(item => 
    item.category === activeCategory && item.isAvailable
  );

  const handleAddToCart = (item: any) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      (window as any).openAuthModal?.('login');
      return;
    }
    
    addToCart(item, 1);
    toast.success(`${item.name} added to cart!`);
  };

  const generateMenuPDF = () => {
    const menuContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${restaurantInfo.name} - Complete Menu</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
            line-height: 1.6;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #ea580c;
            padding-bottom: 20px;
          }
          .restaurant-name { 
            font-size: 36px; 
            font-weight: bold; 
            color: #ea580c; 
            margin-bottom: 10px;
          }
          .tagline { 
            font-size: 16px; 
            color: #666; 
            font-style: italic;
            margin-bottom: 20px;
          }
          .contact-info {
            font-size: 14px;
            color: #666;
            margin: 5px 0;
          }
          .category { 
            margin: 30px 0; 
            page-break-inside: avoid;
          }
          .category-title { 
            font-size: 24px; 
            font-weight: bold; 
            color: #ea580c; 
            border-bottom: 2px solid #ea580c; 
            padding-bottom: 10px; 
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .menu-item { 
            margin: 15px 0; 
            padding: 15px; 
            border: 1px solid #eee; 
            border-radius: 8px;
            background: #fafafa;
          }
          .item-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 8px;
          }
          .item-name { 
            font-size: 18px; 
            font-weight: bold; 
            color: #333;
          }
          .item-price { 
            font-size: 18px; 
            font-weight: bold; 
            color: #ea580c;
          }
          .item-description { 
            color: #666; 
            font-size: 14px;
            margin-top: 5px;
          }
          .popular-badge { 
            background: #ea580c; 
            color: white; 
            padding: 3px 8px; 
            border-radius: 12px; 
            font-size: 12px; 
            font-weight: bold;
            margin-left: 10px;
          }
          .veg-badge {
            background: #10B981;
            color: white;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            margin-left: 5px;
          }
          .spice-level {
            font-size: 12px;
            color: #dc2626;
            margin-left: 10px;
          }
          .footer { 
            margin-top: 40px; 
            text-align: center; 
            border-top: 2px solid #ea580c; 
            padding-top: 20px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .category { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="restaurant-name">${restaurantInfo.name.toUpperCase()}</div>
          <div class="tagline">${restaurantInfo.tagline}</div>
          <div class="contact-info">📞 ${restaurantInfo.phone} | 📱 ${restaurantInfo.mobile}</div>
          <div class="contact-info">🌐 ${restaurantInfo.website}</div>
          <div class="contact-info">📍 ${restaurantInfo.address.line1}, ${restaurantInfo.address.line2} ${restaurantInfo.address.line3}</div>
        </div>
        
        ${menuCategories.map(category => {
          const categoryItems = srimathaMenu.filter(item => item.category === category.id);
          if (categoryItems.length === 0) return '';
          
          return `
            <div class="category">
              <div class="category-title">${category.name}</div>
              ${categoryItems.map(item => `
                <div class="menu-item">
                  <div class="item-header">
                    <span class="item-name">
                      ${item.name}
                      ${item.popular ? '<span class="popular-badge">POPULAR</span>' : ''}
                      ${item.isVegetarian ? '<span class="veg-badge">VEG</span>' : ''}
                      ${item.spiceLevel && item.spiceLevel !== 'none' ? `<span class="spice-level">${item.spiceLevel.toUpperCase()}</span>` : ''}
                    </span>
                    <span class="item-price">₹${item.price}</span>
                  </div>
                  <div class="item-description">${item.description}</div>
                  ${item.preparationTime ? `<div style="font-size: 12px; color: #888; margin-top: 5px;">⏱️ ${item.preparationTime} mins</div>` : ''}
                </div>
              `).join('')}
            </div>
          `;
        }).join('')}
        
        <div class="footer">
          <div style="margin-bottom: 15px;">
            <strong>${restaurantInfo.services.veg} • ${restaurantInfo.services.nonVeg}</strong>
          </div>
          <div style="margin-bottom: 10px;">
            <strong>📞 For Orders:</strong> ${restaurantInfo.phone} | ${restaurantInfo.mobile}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>🌐 Website:</strong> ${restaurantInfo.website}
          </div>
          <div style="margin-bottom: 10px;">
            <strong>📍 Address:</strong> ${restaurantInfo.address.line1}, ${restaurantInfo.address.line2} ${restaurantInfo.address.line3}
          </div>
          <div style="margin-top: 20px; font-style: italic; color: #ea580c;">
            "${restaurantInfo.tagline}"
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([menuContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${restaurantInfo.name}-Complete-Menu-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Menu downloaded successfully!');
  };

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our <span className="text-orange-600">Menu</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            {restaurantInfo.tagline}
          </p>
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>📞 {restaurantInfo.phone}</div>
              <div>📱 {restaurantInfo.mobile}</div>
              <div>🌐 {restaurantInfo.website}</div>
              <div>📍 {restaurantInfo.address.line1}</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-6xl mx-auto">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                  {item.spiceLevel && item.spiceLevel !== 'none' && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {item.spiceLevel.toUpperCase()}
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
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
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

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Download Our Complete Menu</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get our full menu with all categories, prices, and contact information for easy reference
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={generateMenuPDF}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download Complete Menu
              </button>
              <button 
                onClick={() => window.location.href = '/catering'}
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
              >
                Order Catering
              </button>
            </div>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Contact Us for Orders</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div>📞 {restaurantInfo.phone}</div>
                <div>📱 {restaurantInfo.mobile}</div>
                <div className="md:col-span-2">📍 {restaurantInfo.address.line1}, {restaurantInfo.address.line2} {restaurantInfo.address.line3}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;