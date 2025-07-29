// import React, { useState } from 'react';
// import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin, Download, Filter, UserPlus, Star } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import { Customer } from '../types';
// import toast from 'react-hot-toast';

// const CustomerManagement: React.FC = () => {
//   const { customers, addCustomer, updateCustomer, deleteCustomer } = useApp();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     status: 'active' as 'active' | 'inactive',
//     customerType: 'regular' as 'regular' | 'vip' | 'premium',
//     notes: ''
//   });

//   const filteredCustomers = customers.filter(customer => {
//     const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          customer.phone.includes(searchTerm);
//     const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (editingCustomer) {
//       updateCustomer(editingCustomer.id, formData);
//       setEditingCustomer(null);
//       toast.success('Customer updated successfully!');
//     } else {
//       addCustomer({
//         ...formData,
//         joinDate: new Date().toISOString().split('T')[0],
//         totalOrders: 0,
//         totalSpent: 0,
//         lastOrderDate: null,
//         loyaltyPoints: 0
//       });
//       toast.success('Customer added successfully!');
//     }
    
//     resetForm();
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       address: '',
//       status: 'active',
//       customerType: 'regular',
//       notes: ''
//     });
//     setShowAddModal(false);
//     setEditingCustomer(null);
//   };

//   const handleEdit = (customer: Customer) => {
//     setEditingCustomer(customer);
//     setFormData({
//       name: customer.name,
//       email: customer.email,    
//       phone: customer.phone,
//       address: customer.address,
//       status: customer.status,
//       customerType: customer.customerType || 'regular',
//       notes: customer.notes || ''
//     });
//     setShowAddModal(true);
//   };

//   const handleDelete = (id: string, name: string) => {
//     if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
//       deleteCustomer(id);
//       toast.success('Customer deleted successfully!');
//     }
//   };

//   const handleBulkAction = (action: string) => {
//     if (selectedCustomers.length === 0) {
//       toast.error('Please select customers first');
//       return;
//     }

//     switch (action) {
//       case 'activate':
//         selectedCustomers.forEach(id => updateCustomer(id, { status: 'active' }));
//         toast.success(`${selectedCustomers.length} customers activated`);
//         break;
//       case 'deactivate':
//         selectedCustomers.forEach(id => updateCustomer(id, { status: 'inactive' }));
//         toast.success(`${selectedCustomers.length} customers deactivated`);
//         break;
//       case 'delete':
//         if (window.confirm(`Delete ${selectedCustomers.length} selected customers?`)) {
//           selectedCustomers.forEach(id => deleteCustomer(id));
//           toast.success(`${selectedCustomers.length} customers deleted`);
//         }
//         break;
//       case 'export':
//         exportCustomers();
//         break;
//     }
//     setSelectedCustomers([]);
//   };

//   const exportCustomers = () => {
//     const csvContent = [
//       ['Name', 'Email', 'Phone', 'Address', 'Status', 'Join Date', 'Total Orders', 'Total Spent'].join(','),
//       ...filteredCustomers.map(customer => [
//         customer.name,
//         customer.email,
//         customer.phone,
//         customer.address,
//         customer.status,
//         customer.created_at,
//         customer.totalOrders,
//         customer.totalSpent
//       ].join(','))
//     ].join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//     toast.success('Customers exported successfully!');
//   };

//   const getCustomerStats = () => {
//     const total = customers.length;
//     const active = customers.filter(c => c.status === 'active').length;
//     const vip = customers.filter(c => c.customerType === 'vip').length;
//     const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
//     const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0;
    
//     return { total, active, vip, totalRevenue, avgOrderValue };
//   };

//   const stats = getCustomerStats();

//   const toggleCustomerSelection = (customerId: string) => {
//     setSelectedCustomers(prev => 
//       prev.includes(customerId) 
//         ? prev.filter(id => id !== customerId)
//         : [...prev, customerId]
//     );
//   };

//   const selectAllCustomers = () => {
//     if (selectedCustomers.length === filteredCustomers.length) {
//       setSelectedCustomers([]);
//     } else {
//       setSelectedCustomers(filteredCustomers.map(c => c.id));
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
//           <p className="text-gray-600">Manage your customer database and relationships</p>
//         </div>
//         <div className="flex gap-2">
//           {/* <button
//             onClick={() => setShowAddModal(true)}
//             className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
//           >
//             <UserPlus size={20} />
//             Add Customer
//           </button> */}
//           <button
//             onClick={exportCustomers}
//             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
//           >
//             <Download size={20} />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
//           <div className="text-sm text-gray-600">Total Customers</div>
//         </div>
//         {/* <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-green-600">{stats.active}</div>
//           <div className="text-sm text-gray-600">Active</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-purple-600">{stats.vip}</div>
//           <div className="text-sm text-gray-600">VIP Customers</div>
//         </div> */}
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-orange-600">₹{stats.totalRevenue.toLocaleString()}</div>
//           <div className="text-sm text-gray-600">Total Revenue</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow-md">
//           <div className="text-2xl font-bold text-red-600">₹{Math.round(stats.avgOrderValue)}</div>
//           <div className="text-sm text-gray-600">Avg Order Value</div>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="grid md:grid-cols-3 gap-4 mb-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search customers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//             />
//           </div>
//           {/* <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//           >
//             <option value="all">All Status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select> */}
//           <div className="flex gap-2">
//             {/* <select
//               onChange={(e) => handleBulkAction(e.target.value)}
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//               value=""
//             >
//               <option value="">Bulk Actions ({selectedCustomers.length})</option>
//               <option value="activate">Activate Selected</option>
//               <option value="deactivate">Deactivate Selected</option>
//               <option value="export">Export Selected</option>
//               <option value="delete">Delete Selected</option>
//             </select> */}
//           </div>
//         </div>
//       </div>

//       {/* Customer List */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left">
//                   <input
//                     type="checkbox"
//                     checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
//                     onChange={selectAllCustomers}
//                     className="text-orange-600 focus:ring-orange-500"
//                   />
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Orders & Spending
//                 </th>
//                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status & Type
//                 </th> */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCustomers.map((customer) => (
//                 <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-200">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <input
//                       type="checkbox"
//                       checked={selectedCustomers.includes(customer.id)}
//                       onChange={() => toggleCustomerSelection(customer.id)}
//                       className="text-orange-600 focus:ring-orange-500"
//                     />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
//                         <span className="text-orange-600 font-semibold">
//                           {customer.name.charAt(0).toUpperCase()}
//                         </span>
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
//                           {customer.name}
//                           {customer.customerType === 'vip' && (
//                             <Star size={14} className="text-yellow-500 fill-current" />
//                           )}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           Joined: {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="space-y-1">
//                       <div className="flex items-center text-sm text-gray-900">
//                         <Phone size={14} className="mr-2 text-gray-400" />
//                         {customer.phone}
//                       </div>
//                       <div className="flex items-center text-sm text-gray-900">
//                         <Mail size={14} className="mr-2 text-gray-400" />
//                         {customer.email}
//                       </div>
//                       {customer.address && (
//                         <div className="flex items-start text-sm text-gray-500">
//                           <MapPin size={14} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
//                           <span className="line-clamp-2">{customer.address}</span>
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm">
//                       <div className="font-medium text-gray-900">
//                         {customer.totalOrders} orders
//                       </div>
//                       <div className="text-gray-600">
//                         ₹{typeof customer.totalSpent === 'number' ? customer.totalSpent.toLocaleString() : '0'} spent
//                       </div>
//                       {customer.loyaltyPoints && (
//                         <div className="text-orange-600 text-xs">
//                           {customer.loyaltyPoints} points
//                         </div>
//                       )}
//                     </div>
//                   </td>
//                   {/* <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="space-y-1">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                         customer.status === 'active' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {customer.status}
//                       </span>
//                       <div className={`text-xs px-2 py-1 rounded-full inline-block ${
//                         customer.customerType === 'vip' ? 'bg-yellow-100 text-yellow-800' :
//                         customer.customerType === 'premium' ? 'bg-purple-100 text-purple-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {customer.customerType || 'regular'}
//                       </div>
//                     </div>
//                   </td> */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => handleEdit(customer)}
//                         className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                         title="Edit customer"
//                       >
//                         <Edit size={16} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(customer.id, customer.name)}
//                         className="text-red-600 hover:text-red-900 p-1 rounded"
//                         title="Delete customer"
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

//         {filteredCustomers.length === 0 && (
//           <div className="text-center py-12">
//             <div className="text-gray-500 text-lg">No customers found</div>
//             <div className="text-gray-400 text-sm">Try adjusting your search or filters</div>
//           </div>
//         )}
//       </div>

//       {/* Add/Edit Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                 {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
//               </h3>
              
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Full Name *</label>
//                     <input
//                       type="text"
//                       value={formData.name}
//                       onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Email *</label>
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                     />
//                   </div>
//                 </div>
                
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Phone *</label>
//                     <input
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       required
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Customer Type</label>
//                     <select
//                       value={formData.customerType}
//                       onChange={(e) => setFormData(prev => ({ ...prev, customerType: e.target.value as any }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="regular">Regular</option>
//                       <option value="vip">VIP</option>
//                       <option value="premium">Premium</option>
//                     </select>
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Address</label>
//                   <textarea
//                     value={formData.address}
//                     onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     rows={3}
//                     required
//                   />
//                 </div>
                
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-gray-700 font-medium mb-2">Status</label>
//                     <select
//                       value={formData.status}
//                       onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     >
//                       <option value="active">Active</option>
//                       <option value="inactive">Inactive</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Notes</label>
//                   <textarea
//                     value={formData.notes}
//                     onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     rows={2}
//                     placeholder="Additional notes about the customer..."
//                   />
//                 </div>
                
//                 <div className="flex space-x-4 pt-4">
//                   <button
//                     type="submit"
//                     className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
//                   >
//                     {editingCustomer ? 'Update' : 'Add'} Customer
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

// export default CustomerManagement;


import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Phone, Mail, MapPin, X, Users, UserCheck, UserX, Activity, Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
  address_country: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  role: string;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.success) setCustomers(result.data.customers);
    } catch (err) {
      toast.error('Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleUpdate = async () => {
    if (!editingCustomer) return;

    try {
      const res = await fetch(
        `https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/customers/${editingCustomer.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();

      if (result.success) {
        toast.success('Customer updated successfully');
        setCustomers((prev) =>
          prev.map((c) => (c.id === result.data.id ? result.data : c))
        );
        setEditingCustomer(null);
      } else {
        toast.error(result.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this customer?');
    if (!confirm) return;

    try {
      const res = await fetch(
        `https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/customers/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (result.success) {
        toast.success('Customer deleted successfully');
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error(result.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.is_active).length;
  const inactiveCustomers = totalCustomers - activeCustomers;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Customer Management</h2>
            <p className="text-gray-600 mt-2">Manage your customer accounts and information</p>
          </div>
       
        </div> 
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-gray-800">{activeCustomers}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Inactive</p>
              <p className="text-2xl font-bold text-gray-800">{inactiveCustomers}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Rate</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-96 mb-4 md:mb-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search customers by name, email or phone"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
           
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">Customer List</h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No customers match your search' : 'No customers found'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredCustomers.map((cust) => (
                <div key={cust.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-800">{cust.name}</h3>
                        {cust.is_active ? (
                          <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            Active
                          </span>
                        ) : (
                          <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" /> 
                          <span className="truncate">{cust.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" /> 
                          <span>{cust.phone}</span>
                        </div>
                        <div className="flex items-start col-span-2">
                          <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" /> 
                          <span>
                            {cust.address_street}, {cust.address_city}, {cust.address_state} - {cust.address_zipcode}, {cust.address_country}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(cust)}
                        className="px-4 py-2 bg-white text-indigo-600 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors flex items-center shadow-sm"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cust.id)}
                        className="px-4 py-2 bg-white text-red-600 rounded-lg border border-red-100 hover:bg-red-50 transition-colors flex items-center shadow-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Customer</h2>
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input
                    name="address_street"
                    value={formData.address_street || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    name="address_city"
                    value={formData.address_city || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    name="address_state"
                    value={formData.address_state || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
                  <input
                    name="address_zipcode"
                    value={formData.address_zipcode || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    name="address_country"
                    value={formData.address_country || ''}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={formData.is_active || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Active Customer
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;