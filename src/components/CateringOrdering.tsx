
// import React, { useState } from 'react';

// import { Star, Plus, ShoppingCart, Users, Calendar, X } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import { useApp } from '../context/AppContext';
// // import { menuCategories } from '../data/menuData';
// // @ts-ignore
// import { menuAPI } from '../services/api';
// import toast from 'react-hot-toast';
// // @ts-ignore
// import { ordersAPI } from '../services/api';


// // Use the shared MenuItem type from types/index
// import type { MenuItem } from '../types';

// const CateringOrdering: React.FC = () => {

//   const { user } = useAuth();

//   const { cart, addToCart, removeFromCart, clearCart } = useApp();
//   const [showCart, setShowCart] = useState(false);
//   const [menuCategories, setMenuCategories] = useState<{id: string, name: string}[]>([]);
//   const [activeCategory, setActiveCategory] = useState('');
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch categories and menu items from backend
//   React.useEffect(() => {
//     setLoading(true);
//     Promise.all([
//       menuAPI.getCategories(),
//       menuAPI.getItems({ isAvailable: true })
//     ])
//       .then(([catRes, itemRes]) => {
//         const categories = catRes.data.data || [];
//         setMenuCategories(categories);
//         setMenuItems(itemRes.data.items || itemRes.data.data?.items || []);
//         // Set default active category to first available
//         if (categories.length > 0) setActiveCategory(categories[0].id);
//         setError('');
//       })
//       .catch(() => {
//         setError('Failed to load menu items');
//         setMenuCategories([]);
//         setMenuItems([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   // Auto-add item from query param if present
//   React.useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const itemId = params.get('item');
//     if (itemId && menuItems.length > 0) {
//       const item = menuItems.find((i) => i.id === itemId);
//       if (item) {
//         addToCart(item, 1);
//         toast.success(`${item.name} added to cart!`);
//         // Remove the query param from URL after adding
//         params.delete('item');
//         window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
//       }
//     }
//   }, [menuItems]);

//   const cartTotal = cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
//   const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
//   const filteredItems = menuItems.filter((item) => item.category === activeCategory && item.available);

//   const handleAddToCart = (item: MenuItem) => {
//     addToCart(item, 1);
//     if (!cart.some((cartItem: any) => cartItem.menuItem.id === item.id)) {
//       toast.success(`${item.name} added to cart!`);
//     }
//   };

//   // Remove modal logic (showMenuModal, setShowMenuModal, etc.)

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">Catering Services</h1>
//               <p className="text-gray-600">Premium catering for your special events</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
//               <button
//                 onClick={() => setShowCart(true)}
//                 className="relative bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300"
//               >
//                 <ShoppingCart size={20} />
//                 selected Items
//                 {cartItemCount > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
//                     {cartItemCount}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>


//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Hero Section */}
//         <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 md:p-12 text-white mb-12">
//           <div className="max-w-3xl">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">
//               Make Your Event Unforgettable
//             </h2>
//             <p className="text-xl mb-6">
//               From intimate gatherings to grand celebrations, our catering services bring exceptional flavors and professional service to your special occasions.
//             </p>
//             <div className="grid md:grid-cols-3 gap-6">
//               <div className="flex items-center gap-3">
//                 <Users className="text-orange-200" size={24} />
//                 <span>Any Group Size</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Calendar className="text-orange-200" size={24} />
//                 <span>Flexible Scheduling</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Star className="text-orange-200" size={24} />
//                 <span>Premium Quality</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Category Tabs */}
//         <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-6xl mx-auto">
//           {menuCategories.map((category) => (
//             <button
//               key={category.id}
//               onClick={() => setActiveCategory(category.id)}
//               className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
//                 activeCategory === category.id
//                   ? 'bg-orange-600 text-white shadow-lg'
//                   : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'
//               }`}
//             >
//               {category.name}
//             </button>
//           ))}
//         </div>

//         {/* Menu Items Grid with Combos Placeholder */}
//         {loading ? (
//           <div className="text-center py-20 text-xl text-gray-500">Loading menu...</div>
//         ) : error ? (
//           <div className="text-center py-20 text-xl text-red-500">{error}</div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//             {/* Combos Placeholder */}
//             {activeCategory === menuCategories[0].id && (
//               <div className="col-span-full">
//                 {/* <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-8 flex flex-col items-center justify-center shadow-md">
//                   <h3 className="text-2xl font-bold text-yellow-700 mb-2">Combos Coming Soon!</h3>
//                   <p className="text-yellow-700 text-lg">Exciting catering combos will be available here soon. Stay tuned!</p>
//                 </div> */}
//               </div>
//             )}
//             {filteredItems.map((item: any) => (
//               <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//                 <div className="relative">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="absolute top-2 left-2 flex flex-wrap gap-1">
//                     {item.popular && (
//                       <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//                         <Star size={12} fill="currentColor" />
//                         Popular
//                       </span>
//                     )}
//                     {item.isVegetarian && (
//                       <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
//                         VEG
//                       </span>
//                     )}
//                     {item.spiceLevel && item.spiceLevel !== 'none' && (
//                       <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
//                         {item.spiceLevel.toUpperCase()}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div className="flex justify-between items-start mb-3">
//                     <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
//                     {/* <span className="text-xl font-bold text-orange-600">₹{item.price}</span> */}
//                   </div>
//                   <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
//                   {item.preparationTime && (
//                     <div className="text-xs text-gray-500 mb-3">
//                       ⏱️ {item.preparationTime} mins
//                     </div>
//                   )}
//                   <button
//                     onClick={() => handleAddToCart(item)}
//                     className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
//                   >
//                     <Plus size={16} />
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}


//         {/* (Contact/quote section removed as per new design) */}
//       </div>

//       {/* Menu Modal */}
//       {/* Menu modal removed for new design */}

//       {/* Cart Sidebar */}
//       {showCart && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
//           <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold text-gray-800">Catering Cart</h3>
//                 <button
//                   onClick={() => setShowCart(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={24} />
//                 </button>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-6">
//               {cart.length === 0 ? (
//                 <div className="text-center text-gray-500 mt-8">
//                   <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
//                   <p>Your catering cart is empty</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {cart.map((item) => (
//                     <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
//                       <div className="flex items-start justify-between mb-2">
//                         <div className="flex-1">
//                           <h4 className="font-medium text-gray-800">{item.menuItem.name}</h4>
//                           <p className="text-sm text-gray-600">{item.menuItem.description}</p>
//                           {item.specialInstructions && (
//                             <p className="text-xs text-orange-600 mt-1">
//                               <strong>Details:</strong> {item.specialInstructions}
//                             </p>
//                           )}
//                         </div>
//                         <button
//                           onClick={() => removeFromCart(item.id)}
//                           className="text-red-500 hover:text-red-700 ml-2"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-lg font-bold text-orange-600">
//                           ₹{item.menuItem.price.toLocaleString()}
//                         </span>
//                         <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {cart.length > 0 && (
//               <div className="border-t border-gray-200 p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <span className="text-lg font-semibold text-gray-800">Total:</span>
//                   <span className="text-xl font-bold text-orange-600">₹{cartTotal.toLocaleString()}</span>
//                 </div>
//                 <button
//                   onClick={async () => {
//                     if (!user) {
//                       (window as any).openAuthModal('login');
//                     } else {
//                       try {
//                         const orderPayload = {
//                            userId: user.id,
//                           items: cart.map(item => ({
//                             menuItemId: item.menuItem.id,
//                             quantity: item.quantity,
//                             price: item.menuItem.price,
//                           })),
//                           subtotal: cartTotal,
//                           total: cartTotal, // Add delivery/discount logic if needed
//                           paymentStatus: 'pending',
//                           orderType: 'catering',
//                         };
//                         console.log('Placing order with payload:', orderPayload);
//                         await ordersAPI.createOrder(orderPayload);
//                         toast.success('Order placed!');
//                         clearCart();
//                       } catch (err) {
//                         toast.error('Failed to place order. Please try again.');
//                       }
//                     }
//                   }}
//                   className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
//                 >
//                   Place Catering Order
//                 </button>
//                 <p className="text-xs text-gray-500 text-center mt-2">
//                   Our team will contact you within 2 hours to confirm details
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CateringOrdering;

import React, { useState, useEffect } from 'react';
import { Star, Plus, ShoppingCart, Users, Calendar, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

import { menuAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ordersAPI } from '../services/api';
import type { MenuItem } from '../types';
import Header from './Header';
const CateringOrdering: React.FC = () => {
  const { user } = useAuth();
  const { cart, addToCart, removeFromCart, clearCart } = useApp();
  
  const [showCart, setShowCart] = useState(false);
  const [menuCategories, setMenuCategories] = useState<{id: string, name: string}[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);

  // Fetch all menu items recursively if paginated
  const fetchAllItems = async (page = 1, accumulatedItems: MenuItem[] = []): Promise<MenuItem[]> => {
    try {
      const response = await menuAPI.getItems({
        isAvailable: true,
        page,
        limit: 10000
      });
      
      const newItems = response.data.items || response.data.data?.items || [];
      const allItems = [...accumulatedItems, ...newItems];
      
      if (page < (response.data.totalPages || 1)) {
        return fetchAllItems(page + 1, allItems);
      }
      
      return allItems;
    } catch (error) {
      console.error('Error fetching items:', error);
      return accumulatedItems;
    }
  };

  // Fetch categories and all menu items
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, items] = await Promise.all([
          menuAPI.getCategories(),
          fetchAllItems()
        ]);
        
        const categories = categoriesResponse.data.data || [];
        setMenuCategories([{id: 'all', name: 'All Dishes'}, ...categories]);
        setMenuItems(items);
        setAllItemsLoaded(true);
        setError('');
        
        console.log('Total items loaded:', items.length);
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Auto-add item from query param if present
  useEffect(() => {
    if (!allItemsLoaded) return;
    
    const params = new URLSearchParams(window.location.search);
    const itemId = params.get('item');
    if (itemId && menuItems.length > 0) {
      const item = menuItems.find((i) => i.id === itemId);
      if (item) {
        addToCart(item, 1);
        toast.success(`${item.name} added to cart!`);
        params.delete('item');
        window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`);
      }
    }
  }, [menuItems, allItemsLoaded]);

  const cartTotal = cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const filteredItems = activeCategory === 'all' 
    ? menuItems.filter(item => item.available)
    : menuItems.filter((item) => item.category === activeCategory && item.available);

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item, 1);
    if (!cart.some((cartItem: any) => cartItem.menuItem.id === item.id)) {
      toast.success(`${item.name} added to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
     <Header/>
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
                className="relative bg-[#501608] hover:bg-[#722010] text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors duration-300"
              >
                <ShoppingCart size={20} />
                selected Items
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
        <div className="bg-[#501608] rounded-2xl p-8 md:p-12 text-white mb-12">
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

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-6xl mx-auto">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-[#501608] hover:bg-[#722010] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="text-center py-20 text-xl text-gray-500">Loading menu...</div>
        ) : error ? (
          <div className="text-center py-20 text-xl text-red-500">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No items found in this category</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                      }}
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
                  </div> */}
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
                      className="w-full bg-[#501608] hover:bg-[#722010] text-white py-3 rounded-full font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <Plus size={16} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

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
                  onClick={async () => {
                    if (!user) {
                      (window as any).openAuthModal('login');
                    } else {
                      try {
                        const orderPayload = {
                          userId: user.id,
                          items: cart.map(item => ({
                            menuItemId: item.menuItem.id,
                            quantity: item.quantity,
                            price: item.menuItem.price,
                          })),
                          subtotal: cartTotal,
                          total: cartTotal,
                          paymentStatus: 'pending',
                          orderType: 'catering',
                        };
                        await ordersAPI.createOrder(orderPayload);
                        toast.success('Order placed!');
                        clearCart();
                        setShowCart(false);
                      } catch (err) {
                        toast.error('Failed to place order. Please try again.');
                      }
                    }
                  }}
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