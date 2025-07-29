// // import React, { useState, useEffect } from 'react';
// // import { Plus, Search, Edit, Trash2, ToggleLeft, ToggleRight, Star, Upload, X, Save } from 'lucide-react';
// // import { useApp } from '../context/AppContext';
// // import { MenuItem } from '../types';
// // import toast from 'react-hot-toast';
// // import { menuAPI } from '../services/api';

// // const MenuManagement: React.FC = () => {
// //   const { menuItems: contextMenuItems, updateMenuItem, addMenuItem, deleteMenuItem } = useApp();
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [showAddModal, setShowAddModal] = useState(false);
// //   const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     description: '',
// //     price: '',
// //     category: 'appetizers',
// //     image: '',
// //     ingredients: '',
// //     allergens: '',
// //     isVegetarian: false,
// //     isVegan: false,
// //     isGlutenFree: false,
// //     spiceLevel: 'mild',
// //     preparationTime: '',
// //     available: true,
// //     popular: false
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);

// //   // Fetch all menu items from API
// //   useEffect(() => {
// //     const fetchAllItems = async () => {
// //       setLoading(true);
// //       try {
// //         const response = await menuAPI.getItems({ isAvailable: true, limit: 200 });
// //         const items = response.data.items || response.data.data?.items || [];
// //         setAllMenuItems(items);
// //       } catch (error) {
// //         console.error('Error fetching menu items:', error);
// //         toast.error('Failed to load menu items');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAllItems();
// //   }, []);

// //   // Combine API items with context items (if needed)
// //   const combinedMenuItems = [...allMenuItems, ...contextMenuItems.filter(item =>
// //     !allMenuItems.some(apiItem => apiItem.id === item.id)
// //   )];

// //   const filteredItems = combinedMenuItems.filter(item => {
// //     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       item.description.toLowerCase().includes(searchTerm.toLowerCase());
// //     return matchesSearch;
// //   });

// //   const categories = [
// //     { id: 'all', name: 'All Items' },
// //     { id: 'appetizers', name: 'Appetizers' },
// //     { id: 'main-course', name: 'Main Course' },
// //     { id: 'desserts', name: 'Desserts' },
// //     { id: 'beverages', name: 'Beverages' },
// //     { id: 'specials', name: 'Chef Specials' }
// //   ];

// //   const spiceLevels = [
// //     { value: 'none', label: 'No Spice' },
// //     { value: 'mild', label: 'Mild' },
// //     { value: 'medium', label: 'Medium' },
// //     { value: 'hot', label: 'Hot' },
// //     { value: 'very-hot', label: 'Very Hot' }
// //   ];

// //   const allergenOptions = [
// //     'dairy', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy', 'sesame'
// //   ];

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     try {

// //       const itemData = {
// //         name: formData.name,
// //         description: formData.description || null,
// //         price: parseFloat(formData.price),
// //         category: formData.category,
// //         image: formData.image,
// //         ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
// //         allergens: formData.allergens.split(',').map(a => a.trim()).filter(a => a),
// //         is_vegetarian: formData.isVegetarian,
// //         is_vegan: formData.isVegan,
// //         is_gluten_free: formData.isGlutenFree,
// //         spice_level: formData.spiceLevel as 'none' | 'mild' | 'medium' | 'hot' | 'very-hot',
// //         preparation_time: parseInt(formData.preparationTime).toString() || 0,
// //         is_available: formData.available,
// //         popular: formData.popular,
// //       };
// //       if (editingItem) {
// //         await menuAPI.updateItem(editingItem.id, itemData);
// //         updateMenuItem(editingItem.id, itemData);
// //         // toast.success('Menu item updated successfully!');
// //       } else {
// //         const newItem = await menuAPI.createItem(itemData);
// //         addMenuItem(newItem.data);
// //         toast.success('Menu item added successfully!');
// //       }

// //       resetForm();
// //     } catch (error) {
// //       console.error('Error saving menu item:', error);
// //       toast.error('Failed to save menu item');
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       name: '',
// //       description: '',
// //       price: '',
// //       category: 'appetizers',
// //       image: '',
// //       ingredients: '',
// //       allergens: '',
// //       isVegetarian: false,
// //       isVegan: false,
// //       isGlutenFree: false,
// //       spiceLevel: 'mild',
// //       preparationTime: '',
// //       available: true,
// //       popular: false
// //     });
// //     setEditingItem(null);
// //     setShowAddModal(false);
// //   };

// //   const handleEdit = (item: MenuItem) => {
// //     setEditingItem(item);
// //     setFormData({
// //       name: item.name,
// //       description: item.description,
// //       price: item.price.toString(),
// //       category: item.category,
// //       image: item.image,
// //       ingredients: item.ingredients?.join(', ') || '',
// //       allergens: item.allergens?.join(', ') || '',
// //       isVegetarian: item.isVegetarian || false,
// //       isVegan: item.isVegan || false,
// //       isGlutenFree: item.isGlutenFree || false,
// //       spiceLevel: item.spiceLevel || 'mild',
// //       preparationTime: item.preparationTime?.toString() || '',
// //       available: item.available,
// //       popular: item.popular
// //     });
// //     setShowAddModal(true);
// //   };

// //   // const handleDelete = async (id: string, name: string) => {
// //   //   if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
// //   //     try {
// //   //       await menuAPI.deleteItem(id);
// //   //       deleteMenuItem(id);
// //   //       toast.success('Menu item deleted successfully!');
// //   //     } catch (error) {
// //   //       console.error('Error deleting menu item:', error);
// //   //       toast.error('Failed to delete menu item');
// //   //     }
// //   //   }
// //   // };
// // const handleDelete = async (id: string, name: string) => {
// //   if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
// //     try {
// //       await deleteMenuItem(id);
// //       // toast.success('Menu item deleted successfully!');
// //     } catch {
// //       toast.error('Failed to delete menu item');
// //     }
// //   }
// // };
// //   const toggleAvailability = async (itemId: string, currentStatus: boolean) => {
// //     try {
// //       await menuAPI.updateItem(itemId, { available: !currentStatus });
// //       updateMenuItem(itemId, { available: !currentStatus });
// //       // toast.success(`Item ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
// //     } catch (error) {
// //       console.error('Error toggling availability:', error);
// //       toast.error('Failed to update availability');
// //     }
// //   };

// //   const togglePopular = async (itemId: string, currentStatus: boolean) => {
// //     try {
// //       await menuAPI.updateItem(itemId, { popular: !currentStatus });
// //       updateMenuItem(itemId, { popular: !currentStatus });
// //       toast.success(`Item ${!currentStatus ? 'marked as popular' : 'removed from popular'}!`);
// //     } catch (error) {
// //       console.error('Error toggling popular status:', error);
// //       toast.error('Failed to update popular status');
// //     }
// //   };

// //   const bulkActions = [
// //     { value: 'enable', label: 'Enable Selected' },
// //     { value: 'disable', label: 'Disable Selected' },
// //     // { value: 'popular', label: 'Mark as Popular' },
// //     // { value: 'unpopular', label: 'Remove from Popular' },
// //     { value: 'delete', label: 'Delete Selected' }
// //   ];

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="text-xl text-gray-500">Loading menu items...</div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //         <div>
// //           <h2 className="text-2xl font-bold text-gray-800">Menu Management</h2>
// //           <p className="text-gray-600">Manage your restaurant menu items</p>
// //         </div>
// //         <button
// //           onClick={() => setShowAddModal(true)}
// //           className="bg-[#501608] hover:bg-[#722010] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
// //         >
// //           <Plus size={20} />
// //           Add New Item
// //         </button>
// //       </div>

// //       {/* Filters and Search */}
// //       <div className="bg-white rounded-lg shadow-md p-6">
// //         <div className="grid md:grid-cols-3 gap-4 mb-4">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
// //             <input
// //               type="text"
// //               placeholder="Search menu items..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //             />
// //           </div>
// //           <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
// //             <option value="all">All Categories</option>
// //             {categories.slice(1).map(category => (
// //               <option key={category.id} value={category.id}>{category.name}</option>
// //             ))}
// //           </select>
// //           <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
// //             <option value="">Bulk Actions</option>
// //             {bulkActions.map(action => (
// //               <option key={action.value} value={action.value}>{action.label}</option>
// //             ))}
// //           </select>
// //         </div>

// //         {/* Quick Stats */}
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //           <div className="bg-blue-50 p-4 rounded-lg">
// //             <div className="text-2xl font-bold text-blue-600">{combinedMenuItems.length}</div>
// //             <div className="text-sm text-blue-700">Total Items</div>
// //           </div>
// //           <div className="bg-green-50 p-4 rounded-lg">
// //             <div className="text-2xl font-bold text-green-600">
// //               {combinedMenuItems.filter(item => item.available).length}
// //             </div>
// //             <div className="text-sm text-green-700">Available</div>
// //           </div>
// //           {/* <div className="bg-orange-50 p-4 rounded-lg">
// //             <div className="text-2xl font-bold text-orange-600">
// //               {combinedMenuItems.filter(item => item.popular).length}
// //             </div>
// //             <div className="text-sm text-orange-700">Popular</div>
// //           </div> */}
// //           <div className="bg-purple-50 p-4 rounded-lg">
// //             <div className="text-2xl font-bold text-purple-600">
// //               {combinedMenuItems.filter(item => item.isVegetarian).length}
// //             </div>
// //             <div className="text-sm text-purple-700">Vegetarian</div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Menu Items Grid */}
// //       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {filteredItems.length === 0 ? (
// //           <div className="col-span-full text-center py-10">
// //             <p className="text-gray-500">No menu items found matching your search</p>
// //           </div>
// //         ) : (
// //           filteredItems.map((item) => (
// //             <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">

// //               <div className="p-4">
// //                 <div className="flex justify-between items-start mb-2">
// //                   <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
// //                   <span className="text-lg font-bold text-orange-600">₹{item.price}</span>
// //                 </div>

// //                 <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

// //                 <div className="mb-3">
// //                   <span className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
// //                     {item.category.replace('-', ' ')}
// //                   </span>
// //                   {item.spiceLevel && item.spiceLevel !== 'none' && (
// //                     <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium ml-2 capitalize">
// //                       {item.spiceLevel} Spice
// //                     </span>
// //                   )}
// //                   {/* {item.preparationTime && (
// //                     <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
// //                       {item.preparationTime} mins
// //                     </span>
// //                   )} */}
// //                 </div>

// //                 {item.allergens && item.allergens.length > 0 && (
// //                   <div className="mb-3">
// //                     <p className="text-xs text-gray-500 mb-1">Allergens:</p>
// //                     <div className="flex flex-wrap gap-1">
// //                       {item.allergens.map((allergen, index) => (
// //                         <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
// //                           {allergen}
// //                         </span>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}

// //                 <div className="flex justify-between items-center pt-3 border-t border-gray-200">
// //                   <div className="flex items-center space-x-3">
// //                     <button
// //                       onClick={() => toggleAvailability(item.id, item.available)}
// //                       className="flex items-center space-x-1 text-sm"
// //                       title={item.available ? 'Disable item' : 'Enable item'}
// //                     >
// //                       {item.available ? (
// //                         <ToggleRight className="text-green-600" size={20} />
// //                       ) : (
// //                         <ToggleLeft className="text-gray-400" size={20} />
// //                       )}
// //                     </button>

// //                     {/* <button
// //                       onClick={() => togglePopular(item.id, item.popular)}
// //                       className="flex items-center space-x-1 text-sm"
// //                       title={item.popular ? 'Remove from popular' : 'Mark as popular'}
// //                     >
// //                       {item.popular ? (
// //                         <Star className="text-orange-600" size={16} fill="currentColor" />
// //                       ) : (
// //                         <Star className="text-gray-400" size={16} />
// //                       )}
// //                     </button> */}
// //                   </div>

// //                   <div className="flex items-center space-x-2">
// //                     <button
// //                       onClick={() => handleEdit(item)}
// //                       className="text-blue-600 hover:text-blue-800 p-1"
// //                       title="Edit item"
// //                     >
// //                       <Edit size={16} />
// //                     </button>
// //                     <button
// //                       onClick={() => handleDelete(item.id, item.name)}
// //                       className="text-red-600 hover:text-red-800 p-1"
// //                       title="Delete item"
// //                     >
// //                       <Trash2 size={16} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>

// //       {/* Add/Edit Modal */}
// //       {showAddModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
// //             <div className="p-6">
// //               <div className="flex justify-between items-center mb-6">
// //                 <h3 className="text-xl font-semibold text-gray-800">
// //                   {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
// //                 </h3>
// //                 <button
// //                   onClick={resetForm}
// //                   className="text-gray-400 hover:text-gray-600"
// //                 >
// //                   <X size={24} />
// //                 </button>
// //               </div>

// //               <form onSubmit={handleSubmit} className="space-y-6">
// //                 <div className="grid md:grid-cols-2 gap-6">
// //                   {/* Basic Information */}
// //                   <div className="space-y-4">
// //                     <h4 className="font-semibold text-gray-800">Basic Information</h4>

// //                     <div>
// //                       <label className="block text-gray-700 font-medium mb-2">Item Name *</label>
// //                       <input
// //                         type="text"
// //                         value={formData.name}
// //                         onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                         required
// //                       />
// //                     </div>

// //                     <div>
// //                       <label className="block text-gray-700 font-medium mb-2">Description *</label>
// //                       <textarea
// //                         value={formData.description}
// //                         onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                         rows={3}
// //                         // required
// //                       />
// //                     </div>

// //                     <div className="grid grid-cols-2 gap-4">
// //                       <div>
// //                         <label className="block text-gray-700 font-medium mb-2">Price (₹) *</label>
// //                         <input
// //                           type="number"
// //                           value={formData.price}
// //                           onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                           required
// //                           min="0"
// //                           step="0.01"
// //                         />
// //                       </div>
// //                       <div>
// //                         <label className="block text-gray-700 font-medium mb-2">Prep Time (mins)</label>
// //                         <input
// //                           type="number"
// //                           value={formData.preparationTime}
// //                           onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: e.target.value }))}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                           min="1"
// //                         />
// //                       </div>
// //                     </div>

// //                     <div className="grid grid-cols-2 gap-4">
// //                       <div>
// //                         <label className="block text-gray-700 font-medium mb-2">Category *</label>
// //                         <select
// //                           value={formData.category}
// //                           onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                           required
// //                         >
// //                           {categories.slice(1).map(category => (
// //                             <option key={category.id} value={category.id}>{category.name}</option>
// //                           ))}
// //                         </select>
// //                       </div>
// //                       <div>
// //                         <label className="block text-gray-700 font-medium mb-2">Spice Level</label>
// //                         <select
// //                           value={formData.spiceLevel}
// //                           onChange={(e) => setFormData(prev => ({ ...prev, spiceLevel: e.target.value }))}
// //                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                         >
// //                           {spiceLevels.map(level => (
// //                             <option key={level.value} value={level.value}>{level.label}</option>
// //                           ))}
// //                         </select>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {/* Additional Details */}
// //                   <div className="space-y-4">
// //                     <h4 className="font-semibold text-gray-800">Additional Details</h4>

// //                     <div>
// //                       <label className="block text-gray-700 font-medium mb-2">Image URL</label>
// //                       <div className="flex gap-2">
// //                         <input
// //                           type="url"
// //                           value={formData.image}
// //                           onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
// //                           className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                           placeholder="https://example.com/image.jpg"
// //                         />
// //                         <button
// //                           type="button"
// //                           className="bg-gray-200 hover:bg-gray-300 px-4 py-3 rounded-lg transition-colors duration-200"
// //                           title="Upload image"
// //                         >
// //                           <Upload size={20} />
// //                         </button>
// //                       </div>
// //                     </div>

// //                     <div>
// //                       <label className="block text-gray-700 font-medium mb-2">Ingredients (comma-separated)</label>
// //                       <textarea
// //                         value={formData.ingredients}
// //                         onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.target.value }))}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                         rows={2}
// //                         placeholder="Chicken, Tomatoes, Onions, Spices"
// //                       />
// //                     </div>

// //                     <div>
// //                       <label className="block text-gray-700 font-medium mb-2">Allergens (comma-separated)</label>
// //                       <input
// //                         type="text"
// //                         value={formData.allergens}
// //                         onChange={(e) => setFormData(prev => ({ ...prev, allergens: e.target.value }))}
// //                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
// //                         placeholder="dairy, eggs, nuts"
// //                       />
// //                       <div className="mt-2 flex flex-wrap gap-2">
// //                         {allergenOptions.map(allergen => (
// //                           <button
// //                             key={allergen}
// //                             type="button"
// //                             onClick={() => {
// //                               const current = formData.allergens.split(',').map(a => a.trim()).filter(a => a);
// //                               if (current.includes(allergen)) {
// //                                 setFormData(prev => ({
// //                                   ...prev,
// //                                   allergens: current.filter(a => a !== allergen).join(', ')
// //                                 }));
// //                               } else {
// //                                 setFormData(prev => ({
// //                                   ...prev,
// //                                   allergens: [...current, allergen].join(', ')
// //                                 }));
// //                               }
// //                             }}
// //                             className={`px-2 py-1 text-xs rounded-full transition-colors duration-200 ${formData.allergens.includes(allergen)
// //                                 ? 'bg-red-600 text-white'
// //                                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
// //                               }`}
// //                           >
// //                             {allergen}
// //                           </button>
// //                         ))}
// //                       </div>
// //                     </div>

// //                     {/* Checkboxes */}
// //                     <div className="space-y-3">
// //                       <h5 className="font-medium text-gray-700">Dietary Options</h5>
// //                       <div className="grid grid-cols-2 gap-3">
// //                         <label className="flex items-center">
// //                           <input
// //                             type="checkbox"
// //                             checked={formData.isVegetarian}
// //                             onChange={(e) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
// //                             className="mr-2 text-orange-600 focus:ring-orange-500"
// //                           />
// //                           Vegetarian
// //                         </label>
// //                         <label className="flex items-center">
// //                           <input
// //                             type="checkbox"
// //                             checked={formData.isVegan}
// //                             onChange={(e) => setFormData(prev => ({ ...prev, isVegan: e.target.checked }))}
// //                             className="mr-2 text-orange-600 focus:ring-orange-500"
// //                           />
// //                           Vegan
// //                         </label>
// //                         <label className="flex items-center">
// //                           <input
// //                             type="checkbox"
// //                             checked={formData.isGlutenFree}
// //                             onChange={(e) => setFormData(prev => ({ ...prev, isGlutenFree: e.target.checked }))}
// //                             className="mr-2 text-orange-600 focus:ring-orange-500"
// //                           />
// //                           Gluten Free
// //                         </label>
// //                         <label className="flex items-center">
// //                           <input
// //                             type="checkbox"
// //                             checked={formData.popular}
// //                             onChange={(e) => setFormData(prev => ({ ...prev, popular: e.target.checked }))}
// //                             className="mr-2 text-orange-600 focus:ring-orange-500"
// //                           />
// //                           Popular Item
// //                         </label>
// //                         <label className="flex items-center">
// //                           <input
// //                             type="checkbox"
// //                             checked={formData.available}
// //                             onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
// //                             className="mr-2 text-orange-600 focus:ring-orange-500"
// //                           />
// //                           Available
// //                         </label>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
// //                   <button
// //                     type="button"
// //                     onClick={resetForm}
// //                     className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-semibold transition-colors duration-300"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
// //                   >
// //                     <Save size={20} />
// //                     {editingItem ? 'Update Item' : 'Add Item'}
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MenuManagement;

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Loader2,
  X,
  Star,
  Flame,
  Leaf,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";
import { menuAPI } from "../services/api";

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
  isVegetarian: boolean;
  image?: string;
  preparationTime?: number;
  spiceLevel?: string;
};

type Category = {
  id: string;
  name: string;
};

const defaultFormData = {
  name: "",
  description: "",
  price: "",
  category: "",
  isVegetarian: true,
  available: true,
  spiceLevel: "",
};

const MenuManagement: React.FC = () => {
  // State declarations
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>(defaultFormData);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await menuAPI.getItems();
      const items = res.data?.data?.items;
      if (Array.isArray(items)) {
        setMenuItems(items);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await menuAPI.getCategories();
      const cats = res.data?.data;
      if (Array.isArray(cats)) {
        setCategories(cats);
      } else {
        throw new Error("Invalid categories format");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure to delete this item?")) return;
    try {
      await menuAPI.deleteItem(id);
      setMenuItems(menuItems.filter((item) => item.id !== id));
      toast.success("Item deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const updatedItem = { ...item, available: !item.available };
      await menuAPI.updateItem(item.id, updatedItem);
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? updatedItem : i))
      );
      toast.success("Availability updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update availability");
    }
  };

  const handleEdit = (item: MenuItem) => {
    setIsEditMode(true);
    setEditId(item.id);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVegetarian: item.isVegetarian,
      available: item.available,
      spiceLevel: item.spiceLevel || "",
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (isEditMode && editId !== null) {
        await menuAPI.updateItem(editId, formData);
        toast.success("Menu item updated");
      } else {
        await menuAPI.createItem(formData);
        toast.success("Menu item added");
      }
      setIsModalOpen(false);
      setFormData(defaultFormData);
      setIsEditMode(false);
      setEditId(null);
      fetchMenu();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save item");
    } finally {
      setFormLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const toggleCategory = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 5);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with gradient */}
      <div
        className="p-6 rounded-xl mb-4 text-white"
        style={{ backgroundColor: "#501608" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Menu Dashboard</h1>
            <p className="opacity-100">Manage your restaurant's offerings</p>
          </div>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setFormData(defaultFormData);
              setIsEditMode(false);
              setEditId(null);
            }}
            className="bg-white text-blue-600 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-blue-50 transition-all"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {/* Search bar below header */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full shadow-sm flex items-center gap-1 ${
            selectedCategory === null
              ? "bg-[#501608] text-white"
              : "bg-white hover:bg-[#501609]"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All{" "}
          <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
            {menuItems.length}
          </span>
        </button>

        {displayedCategories.map((cat) => (
          <button
            key={cat.id}
            className={`group px-4 py-2 rounded-full shadow-sm flex items-center gap-1 ${
              selectedCategory === cat.id
                ? "bg-[#501608] text-white"
                : "bg-white hover:bg-[#501609] hover:text-white"
            }`}
            onClick={() => toggleCategory(cat.id)}
          >
            {cat.name}
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                selectedCategory === cat.id
                  ? "bg-white bg-opacity-20 text-white"
                  : "bg-gray-100 group-hover:bg-white group-hover:text-black"
              }`}
            >
              {menuItems.filter((i) => i.category === cat.id).length}
            </span>
          </button>
        ))}

        {categories.length > 5 && (
          <button
            className="px-4 py-2 bg-white rounded-full shadow-sm flex items-center gap-1 hover:bg-gray-100"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            {showAllCategories ? "Show Less" : "More"}
            {showAllCategories ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="mx-auto h-40 mb-4 flex items-center justify-center text-gray-300">
            <Search size={60} />
          </div>
          <h3 className="text-lg font-medium text-gray-700">
            No menu items found
          </h3>
          <p className="text-gray-500 mt-1">
            Try adjusting your search or add a new item
          </p>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setFormData(defaultFormData);
              setIsEditMode(false);
              setEditId(null);
            }}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md border"
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      {item.isVegetarian && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Leaf size={12} /> Veg
                        </span>
                      )}
                    </div>
                    <span className="inline-block mt-1 bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                      {categories.find((c) => c.id === item.category)?.name ||
                        item.category}
                    </span>
                    <p className="mt-2 text-gray-600 text-sm">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-800">
                        ₹{item.price}
                      </span>
                      {item.spiceLevel && (
                        <span className="flex items-center gap-1 text-sm text-orange-600">
                          <Flame size={14} /> {item.spiceLevel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t">
                <button
                  // onClick={() => handleToggleAvailability(item)}
                  // className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  //   item.available
                  //     ? "bg-green-100 text-green-800"
                  //     : "bg-gray-200 text-gray-700"
                  // }`}
                >
                  {/* {item.available ? (
                    <>
                      <ToggleRight size={16} /> Available
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={16} /> Unavailable
                    </>
                  )} */}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-5 text-white" style={{ backgroundColor: "#501608" }}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  {isEditMode ? "Edit Menu Item" : "Create New Item"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData(defaultFormData);
                    setIsEditMode(false);
                    setEditId(null);
                  }}
                  className="text-white hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Margherita Pizza"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  placeholder="Describe the item..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={handleFormChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="text"
                    name="price"
                    placeholder="0.00"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-center ${
                        formData.isVegetarian
                          ? "bg-green-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, isVegetarian: true })
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Leaf size={16} /> Vegetarian
                      </div>
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-center ${
                        !formData.isVegetarian
                          ? "bg-red-500 text-white"
                          : "bg-gray-100"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, isVegetarian: false })
                      }
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spice Level
                  </label>
                  <select
                    name="spiceLevel"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.spiceLevel}
                    onChange={handleFormChange}
                  >
                    <option value="">Select Level</option>
                    <optgroup label="🌶️ Spice Levels">
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Hot">Hot</option>
                      <option value="Extreme">Extreme</option>
                    </optgroup>
                    <optgroup label="🍬 Sweetness Levels">
                      <option value="Light">Light</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Very Sweet">Very Sweet</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full  text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: "#501608" }}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditMode ? (
                    "Update Item"
                  ) : (
                    "Add Item"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
