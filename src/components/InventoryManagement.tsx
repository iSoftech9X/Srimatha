// import React, { useState } from 'react';
// import { Plus, Search, Edit, Trash2, AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
// import { Inventory } from '../types';
// import toast from 'react-hot-toast';

// const InventoryManagement: React.FC = () => {
//   const [inventory, setInventory] = useState<Inventory[]>([
//     {
//       id: '1',
//       itemName: 'Chicken Breast',
//       category: 'meat',
//       quantity: 25,
//       unit: 'kg',
//       minimumStock: 10,
//       supplier: 'Fresh Meat Co.',
//       costPerUnit: 250,
//       expiryDate: '2024-01-15',
//       lastUpdated: '2024-01-10',
//       status: 'in-stock'
//     },
//     {
//       id: '2',
//       itemName: 'Basmati Rice',
//       category: 'grains',
//       quantity: 5,
//       unit: 'kg',
//       minimumStock: 20,
//       supplier: 'Grain Suppliers Ltd.',
//       costPerUnit: 80,
//       lastUpdated: '2024-01-09',
//       status: 'low-stock'
//     },
//     {
//       id: '3',
//       itemName: 'Tomatoes',
//       category: 'vegetables',
//       quantity: 0,
//       unit: 'kg',
//       minimumStock: 15,
//       supplier: 'Fresh Vegetables Inc.',
//       costPerUnit: 40,
//       lastUpdated: '2024-01-08',
//       status: 'out-of-stock'
//     }
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingItem, setEditingItem] = useState<Inventory | null>(null);
//   const [formData, setFormData] = useState({
//     itemName: '',
//     category: 'vegetables' as Inventory['category'],
//     quantity: '',
//     unit: 'kg' as Inventory['unit'],
//     minimumStock: '',
//     supplier: '',
//     costPerUnit: '',
//     expiryDate: ''
//   });

//   const categories = [
//     { value: 'all', label: 'All Categories' },
//     { value: 'vegetables', label: 'Vegetables' },
//     { value: 'meat', label: 'Meat' },
//     { value: 'dairy', label: 'Dairy' },
//     { value: 'spices', label: 'Spices' },
//     { value: 'grains', label: 'Grains' },
//     { value: 'beverages', label: 'Beverages' },
//     { value: 'other', label: 'Other' }
//   ];

//   const units = [
//     { value: 'kg', label: 'Kilograms' },
//     { value: 'liters', label: 'Liters' },
//     { value: 'pieces', label: 'Pieces' },
//     { value: 'packets', label: 'Packets' }
//   ];

//   const filteredInventory = inventory.filter(item => {
//     const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
//     const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   const getStatusColor = (status: Inventory['status']) => {
//     switch (status) {
//       case 'in-stock': return 'bg-green-100 text-green-800 border-green-200';
//       case 'low-stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'out-of-stock': return 'bg-red-100 text-red-800 border-red-200';
//       case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusIcon = (status: Inventory['status']) => {
//     switch (status) {
//       case 'in-stock': return <Package className="text-green-600" size={16} />;
//       case 'low-stock': return <AlertTriangle className="text-yellow-600" size={16} />;
//       case 'out-of-stock': return <TrendingDown className="text-red-600" size={16} />;
//       case 'expired': return <AlertTriangle className="text-gray-600" size={16} />;
//       default: return <Package className="text-gray-600" size={16} />;
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const itemData: Inventory = {
//       id: editingItem?.id || Date.now().toString(),
//       itemName: formData.itemName,
//       category: formData.category,
//       quantity: parseFloat(formData.quantity),
//       unit: formData.unit,
//       minimumStock: parseFloat(formData.minimumStock),
//       supplier: formData.supplier,
//       costPerUnit: parseFloat(formData.costPerUnit),
//       expiryDate: formData.expiryDate || undefined,
//       lastUpdated: new Date().toISOString().split('T')[0],
//       status: parseFloat(formData.quantity) === 0 ? 'out-of-stock' :
//               parseFloat(formData.quantity) <= parseFloat(formData.minimumStock) ? 'low-stock' : 'in-stock'
//     };

//     if (editingItem) {
//       setInventory(prev => prev.map(item => item.id === editingItem.id ? itemData : item));
//       toast.success('Inventory item updated successfully!');
//     } else {
//       setInventory(prev => [...prev, itemData]);
//       toast.success('Inventory item added successfully!');
//     }
    
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       itemName: '',
//       category: 'vegetables',
//       quantity: '',
//       unit: 'kg',
//       minimumStock: '',
//       supplier: '',
//       costPerUnit: '',
//       expiryDate: ''
//     });
//     setEditingItem(null);
//     setShowAddModal(false);
//   };

//   const handleEdit = (item: Inventory) => {
//     setEditingItem(item);
//     setFormData({
//       itemName: item.itemName,
//       category: item.category,
//       quantity: item.quantity.toString(),
//       unit: item.unit,
//       minimumStock: item.minimumStock.toString(),
//       supplier: item.supplier,
//       costPerUnit: item.costPerUnit.toString(),
//       expiryDate: item.expiryDate || ''
//     });
//     setShowAddModal(true);
//   };

//   const handleDelete = (id: string, name: string) => {
//     if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
//       setInventory(prev => prev.filter(item => item.id !== id));
//       toast.success('Inventory item deleted successfully!');
//     }
//   };

//   const getInventoryStats = () => {
//     const total = inventory.length;
//     const inStock = inventory.filter(item => item.status === 'in-stock').length;
//     const lowStock = inventory.filter(item => item.status === 'low-stock').length;
//     const outOfStock = inventory.filter(item => item.status === 'out-of-stock').length;
//     const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);
    
//     return { total, inStock, lowStock, outOfStock, totalValue };
//   };

//   const stats = getInventoryStats();

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
//           <p className="text-gray-600">Track and manage your restaurant inventory</p>
//         </div>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
//         >
//           <Plus size={20} />
//           Add Item
//         </button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
//           <div className="text-sm text-gray-600">Total Items</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
//           <div className="text-sm text-gray-600">In Stock</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
//           <div className="text-sm text-gray-600">Low Stock</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
//           <div className="text-sm text-gray-600">Out of Stock</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-purple-600">₹{stats.totalValue.toLocaleString()}</div>
//           <div className="text-sm text-gray-600">Total Value</div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="grid md:grid-cols-4 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search inventory..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>
//           <select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//           >
//             {categories.map(category => (
//               <option key={category.value} value={category.value}>{category.label}</option>
//             ))}
//           </select>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//           >
//             <option value="all">All Status</option>
//             <option value="in-stock">In Stock</option>
//             <option value="low-stock">Low Stock</option>
//             <option value="out-of-stock">Out of Stock</option>
//             <option value="expired">Expired</option>
//           </select>
//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300">
//             Generate Report
//           </button>
//         </div>
//       </div>

//       {/* Inventory List */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Item Details
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Quantity & Stock
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Supplier & Cost
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredInventory.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
//                       <div className="text-sm text-gray-500 capitalize">{item.category}</div>
//                       {item.expiryDate && (
//                         <div className="text-xs text-orange-600">
//                           Expires: {new Date(item.expiryDate).toLocaleDateString()}
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {item.quantity} {item.unit}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Min: {item.minimumStock} {item.unit}
//                       </div>
//                       <div className="text-xs text-gray-400">
//                         Updated: {new Date(item.lastUpdated).toLocaleDateString()}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div>
//                       <div className="text-sm text-gray-900">{item.supplier}</div>
//                       <div className="text-sm font-medium text-gray-900">
//                         ₹{item.costPerUnit}/{item.unit}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         Total: ₹{(item.quantity * item.costPerUnit).toLocaleString()}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
//                       {getStatusIcon(item.status)}
//                       <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(item)}
//                         className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                         title="Edit item"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(item.id, item.itemName)}
//                         className="text-red-600 hover:text-red-900 p-1 rounded"
//                         title="Delete item"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredInventory.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-500 text-lg">No inventory items found</div>
//             <div className="text-gray-400 text-sm">Try adjusting your filters</div>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
//               </h3>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Item Name *</label>
//                     <input
//                       type="text"
//                       value={formData.itemName}
//                       onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Category *</label>
//                     <select
//                       value={formData.category}
//                       onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Inventory['category'] }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                     >
//                       {categories.slice(1).map(category => (
//                         <option key={category.value} value={category.value}>{category.label}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
                
//                 <div className="grid md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Quantity *</label>
//                     <input
//                       type="number"
//                       value={formData.quantity}
//                       onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Unit *</label>
//                     <select
//                       value={formData.unit}
//                       onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value as Inventory['unit'] }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                     >
//                       {units.map(unit => (
//                         <option key={unit.value} value={unit.value}>{unit.label}</option>
//                       ))}
//                     </select>
//                   </div>
                  
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Minimum Stock *</label>
//                     <input
//                       type="number"
//                       value={formData.minimumStock}
//                       onChange={(e) => setFormData(prev => ({ ...prev, minimumStock: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
//                 </div>
                
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Supplier *</label>
//                     <input
//                       type="text"
//                       value={formData.supplier}
//                       onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Cost per Unit (₹) *</label>
//                     <input
//                       type="number"
//                       value={formData.costPerUnit}
//                       onChange={(e) => setFormData(prev => ({ ...prev, costPerUnit: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                       min="0"
//                       step="0.01"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Expiry Date (Optional)</label>
//                   <input
//                     type="date"
//                     value={formData.expiryDate}
//                     onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                   />
//                 </div>
                
//                 <div className="flex space-x-4 pt-4">
//                   <button
//                     type="submit"
//                     className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
//                   >
//                     {editingItem ? 'Update' : 'Add'} Item
//                   </button>
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition-colors duration-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InventoryManagement;