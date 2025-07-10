import React from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { restaurantInfo, menuCategories, menuItems } from '../data/menuData';

const Menu: React.FC = () => {
  // Download menu handler
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
          const categoryItems = menuItems.filter(item => item.category === category.id);
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

  // Order catering handler
  const handleOrderCatering = () => {
    window.location.href = '/catering';
  };

  return (
    <section id="menu" className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl p-12 shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">
            Download Our <span className="text-orange-600">Complete Menu</span>
          </h2>
          <button 
            onClick={generateMenuPDF}
            className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-3 transition-all duration-300 mb-6"
          >
            <Download size={24} />
            Download Complete Menu
          </button>
          <button
            onClick={handleOrderCatering}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-3 transition-all duration-300"
          >
            Order Catering
          </button>
        </div>
      </div>
    </section>
  );
};

export default Menu;