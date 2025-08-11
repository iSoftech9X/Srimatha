// import React, { useEffect, useState } from 'react';
// import { Download } from 'lucide-react';
// import toast from 'react-hot-toast';
// import { restaurantInfo, menuCategories } from '../data/menuData';
// import { menuAPI } from '../services/api';
// import type { MenuItem } from '../types';

// const Menu: React.FC = () => {
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     setLoading(true);
//     menuAPI.getItems({ isAvailable: true })
//       .then((res: { data: { data: { items: MenuItem[] } } }) => {
//         setMenuItems(res.data.data.items || []);
//         setError('');
//       })
//       .catch(() => {
//         setError('Failed to load menu items');
//         setMenuItems([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   // Download menu handler
//   const generateMenuPDF = () => {
//     const menuContent = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>${restaurantInfo.name} - Complete Menu</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
//           .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #ea580c; padding-bottom: 20px; }
//           .restaurant-name { font-size: 36px; font-weight: bold; color: #ea580c; margin-bottom: 10px; }
//           .tagline { font-size: 16px; color: #666; font-style: italic; margin-bottom: 20px; }
//           .contact-info { font-size: 14px; color: #666; margin: 5px 0; }
//           .category { margin: 30px 0; page-break-inside: avoid; }
//           .category-title { font-size: 24px; font-weight: bold; color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
//           .menu-item { margin: 15px 0; padding: 15px; border: 1px solid #eee; border-radius: 8px; background: #fafafa; }
//           .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
//           .item-name { font-size: 18px; font-weight: bold; color: #333; }
//           .item-price { font-size: 18px; font-weight: bold; color: #ea580c; }
//           .item-description { color: #666; font-size: 14px; margin-top: 5px; }
//           .popular-badge { background: #ea580c; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; margin-left: 10px; }
//           .veg-badge { background: #10B981; color: white; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: bold; margin-left: 5px; }
//           .spice-level { font-size: 12px; color: #dc2626; margin-left: 10px; }
//           .footer { margin-top: 40px; text-align: center; border-top: 2px solid #ea580c; padding-top: 20px; color: #666; }
//           @media print { body { margin: 0; } .category { page-break-inside: avoid; } }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <div class="restaurant-name">${restaurantInfo.name.toUpperCase()}</div>
//           <div class="tagline">${restaurantInfo.tagline}</div>
//           <div class="contact-info">📞 ${restaurantInfo.phone} | 📱 ${restaurantInfo.mobile}</div>
//           <div class="contact-info">🌐 ${restaurantInfo.website}</div>
//           <div class="contact-info">📍 ${restaurantInfo.address.line1}, ${restaurantInfo.address.line2} ${restaurantInfo.address.line3}</div>
//         </div>
//         ${menuCategories.map(category => {
//           const categoryItems = menuItems.filter(item => item.category === category.id);
//           if (categoryItems.length === 0) return '';
//           return `
//             <div class="category">
//               <div class="category-title">${category.name}</div>
//               ${categoryItems.map(item => `
//                 <div class="menu-item">
//                   <div class="item-header">
//                     <span class="item-name">
//                       ${item.name}
//                       ${item.popular ? '<span class="popular-badge">POPULAR</span>' : ''}
//                       ${item.isVegetarian ? '<span class="veg-badge">VEG</span>' : ''}
//                       ${item.spiceLevel && item.spiceLevel !== 'none' ? `<span class="spice-level">${item.spiceLevel?.toUpperCase()}</span>` : ''}
//                     </span>
//                     <span class="item-price">₹${item.price}</span>
//                   </div>
//                   <div class="item-description">${item.description}</div>
//                   ${item.preparationTime ? `<div style=\"font-size: 12px; color: #888; margin-top: 5px;\">⏱️ ${item.preparationTime} mins</div>` : ''}
//                 </div>
//               `).join('')}
//             </div>
//           `;
//         }).join('')}
//         <div class="footer">
//           <div style="margin-bottom: 15px;"><strong>${restaurantInfo.services.veg} • ${restaurantInfo.services.nonVeg}</strong></div>
//           <div style="margin-bottom: 10px;"><strong>📞 For Orders:</strong> ${restaurantInfo.phone} | ${restaurantInfo.mobile}</div>
//           <div style="margin-bottom: 10px;"><strong>🌐 Website:</strong> ${restaurantInfo.website}</div>
//           <div style="margin-bottom: 10px;"><strong>📍 Address:</strong> ${restaurantInfo.address.line1}, ${restaurantInfo.address.line2} ${restaurantInfo.address.line3}</div>
//           <div style="margin-top: 20px; font-style: italic; color: #ea580c;">"${restaurantInfo.tagline}"</div>
//         </div>
//       </body>
//       </html>
//     `;
//     const blob = new Blob([menuContent], { type: 'text/html' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${restaurantInfo.name}-Complete-Menu-${new Date().toISOString().split('T')[0]}.html`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//     toast.success('Menu downloaded successfully!');
//   };

//   // Order catering handler
//   const handleOrderCatering = () => {
//     window.location.href = '/catering';
//   };

//   return (
//     <section id="menu" className="py-20 bg-gray-50">
//       <div className="max-w-2xl mx-auto px-4">
//         <div className="bg-white rounded-2xl p-12 shadow-xl flex flex-col items-center justify-center">
//           <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">
//             Download Our <span className="text-orange-600">Complete Menu</span>
//           </h2>
//           <button 
//             onClick={generateMenuPDF}
//             className=" text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-3 transition-all duration-300 mb-6" style={{ backgroundColor: '#501608' }}
//           >
//             <Download size={24} />
//             Download Complete Menu
//           </button>
//           <button
//             onClick={handleOrderCatering}
//             className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-3 transition-all duration-300"
//           >
//             Order Catering
//           </button>
//           {loading && <div className="mt-6 text-gray-500">Loading menu...</div>}
//           {error && <div className="mt-6 text-red-500">{error}</div>}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Menu;
import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { restaurantInfo } from '../data/menuData';
import { menuAPI } from '../services/api';
import type { MenuItem, MenuCategory } from '../types';
import html2pdf from 'html2pdf.js';

const Menu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories + items
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError('');

        const [catRes, itemRes] = await Promise.all([
          menuAPI.getCategories(),
          menuAPI.getItems({}) // Fetch ALL items
        ]);

        setCategories(catRes.data.data || []);
        setMenuItems(itemRes.data.data.items || []);
      } catch (err) {
        setError('Failed to load menu data');
        setCategories([]);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Generate PDF
  const generateMenuPDF = () => {
    const element = document.createElement('div');
    element.style.fontFamily = "'Poppins', sans-serif";
    element.style.padding = '20px';
    element.style.width = '100%';
    element.style.boxSizing = 'border-box';
    element.style.backgroundColor = '#fffaf5';

    // Header
    element.innerHTML += `
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 3px double #ea580c;">
        <h1 style="margin: 0; font-size: 36px; font-weight: bold; color: #b45309; letter-spacing: 2px;">
          ${restaurantInfo.name}
        </h1>
        <p style="margin: 5px 0; font-style: italic; color: #6b7280; font-size: 16px;">
          ${restaurantInfo.tagline}
        </p>
        <p style="margin: 0; font-size: 13px; color: #6b7280;">
          📞 ${restaurantInfo.phone} | 📱 ${restaurantInfo.mobile} | 🌐 ${restaurantInfo.website}
        </p>
        <p style="margin: 0; font-size: 13px; color: #6b7280;">
          📍 ${restaurantInfo.address.line1}, ${restaurantInfo.address.line2} ${restaurantInfo.address.line3}
        </p>
      </div>
    `;

    // Categories + Items (No prices)
    categories.forEach((category) => {
      const categoryItems = menuItems.filter(item => item.category === category.id);
      if (categoryItems.length === 0) return;

      element.innerHTML += `
        <div style="margin-bottom: 25px;">
          <h2 style="font-size: 22px; margin-bottom: 10px; color: #b45309; border-left: 5px solid #ea580c; padding-left: 10px;">
            ${category.name}
          </h2>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${categoryItems
              .map(item => `
                <li style="margin-bottom: 12px; background: #fff3e6; padding: 10px 14px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                  <strong style="font-size: 15px; color: #333;">${item.name}</strong>
   
                  ${item.isVegetarian ? '<span style="background: #10B981; color: white; padding: 8px 6px; border-radius: 8px; font-size: 10px; margin-left: 6px;">VEG</span>' : ''}
          
               
                </li>
              `)
              .join('')}
          </ul>
        </div>
      `;
    });

    // Footer
    element.innerHTML += `
      <div style="margin-top: 30px; text-align: center; font-size: 13px; color: #6b7280; border-top: 3px double #ea580c; padding-top: 10px;">
        <p><strong>${restaurantInfo.services.veg} • ${restaurantInfo.services.nonVeg}</strong></p>
        <p><strong>📞</strong> ${restaurantInfo.phone} | ${restaurantInfo.mobile}</p>
        <p><strong>🌐</strong> ${restaurantInfo.website}</p>
        <p><strong>📍</strong> ${restaurantInfo.address.line1}, ${restaurantInfo.address.line2} ${restaurantInfo.address.line3}</p>
        <p style="margin-top: 8px; font-style: italic; color: #b45309;">"${restaurantInfo.tagline}"</p>
      </div>
    `;

    document.body.appendChild(element);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${restaurantInfo.name.replace(/\s+/g, '-')}-Menu-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: 1200 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        toast.success('Menu PDF downloaded successfully!');
        document.body.removeChild(element);
      })
      .catch(() => {
        toast.error('Failed to generate PDF');
        document.body.removeChild(element);
      });
  };

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
            className="text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-3 transition-all duration-300 mb-6"
            style={{ backgroundColor: '#501608' }}
            disabled={loading || !!error}
          >
            <Download size={24} />
            {loading ? 'Loading...' : 'Download Complete Menu'}
          </button>
          <button
            onClick={handleOrderCatering}
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg flex items-center gap-3 transition-all duration-300"
          >
            Order Catering
          </button>
          {loading && <div className="mt-6 text-gray-500">Loading menu...</div>}
          {error && <div className="mt-6 text-red-500">{error}</div>}
        </div>
      </div>
    </section>
  );
};

export default Menu;
