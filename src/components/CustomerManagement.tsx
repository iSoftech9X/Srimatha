


// import React, { useEffect, useState } from 'react';
// import { Edit, Trash2, Phone, Mail, MapPin, X, Users, UserCheck, UserX, Activity, Search, Plus } from 'lucide-react';
// import toast from 'react-hot-toast';

// interface Customer {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   address_street: string;
//   address_city: string;
//   address_state: string;
//   address_zipcode: string;
//   address_country: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
//   role: string;
// }

// const CustomerManagement: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
//   const [formData, setFormData] = useState<Partial<Customer>>({});
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   const token = localStorage.getItem('token');

//   const fetchCustomers = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch('https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/customers', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const result = await res.json();
//       if (result.success) setCustomers(result.data.customers);
//     } catch (err) {
//       toast.error('Failed to load customers');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const openEditModal = (customer: Customer) => {
//     setEditingCustomer(customer);
//     setFormData(customer);
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({ 
//       ...formData, 
//       [name]: type === 'checkbox' ? checked : value 
//     });
//   };

//   const handleUpdate = async () => {
//     if (!editingCustomer) return;

//     try {
//       const res = await fetch(
//         `https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/customers/${editingCustomer.id}`,
//         {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       const result = await res.json();

//       if (result.success) {
//         toast.success('Customer updated successfully');
//         setCustomers((prev) =>
//           prev.map((c) => (c.id === result.data.id ? result.data : c))
//         );
//         setEditingCustomer(null);
//       } else {
//         toast.error(result.message || 'Update failed');
//       }
//     } catch (err) {
//       toast.error('Something went wrong');
//     }
//   };

//   const handleDelete = async (id: number) => {
//     const confirm = window.confirm('Are you sure you want to delete this customer?');
//     if (!confirm) return;

//     try {
//       const res = await fetch(
//         `https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/customers/${id}`,
//         {
//           method: 'DELETE',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const result = await res.json();

//       if (result.success) {
//         toast.success('Customer deleted successfully');
//         setCustomers((prev) => prev.filter((c) => c.id !== id));
//       } else {
//         toast.error(result.message || 'Delete failed');
//       }
//     } catch (err) {
//       toast.error('Something went wrong');
//     }
//   };

//   // Filter customers based on search term
//   const filteredCustomers = customers.filter(customer =>
//     customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Calculate stats
//   const totalCustomers = customers.length;
//   const activeCustomers = customers.filter(c => c.is_active).length;
//   const inactiveCustomers = totalCustomers - activeCustomers;

//   return (
//     <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800">Customer Management</h2>
//             <p className="text-gray-600 mt-2">Manage your customer accounts and information</p>
//           </div>
       
//         </div> 
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
//               <Users className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm font-medium">Total Customers</p>
//               <p className="text-2xl font-bold text-gray-800">{totalCustomers}</p>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
//               <UserCheck className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm font-medium">Active</p>
//               <p className="text-2xl font-bold text-gray-800">{activeCustomers}</p>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
//               <UserX className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm font-medium">Inactive</p>
//               <p className="text-2xl font-bold text-gray-800">{inactiveCustomers}</p>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
//             <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
//               <Activity className="w-6 h-6" />
//             </div>
//             <div>
//               <p className="text-gray-500 text-sm font-medium">Active Rate</p>
//               <p className="text-2xl font-bold text-gray-800">
//                 {totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}%
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//             <div className="relative w-full md:w-96 mb-4 md:mb-0">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search customers by name, email or phone"
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
           
//           </div>
//         </div>

//         {/* Customer List */}
//         <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//           <div className="p-4 border-b border-gray-200 bg-gray-50">
//             <h3 className="text-lg font-semibold text-gray-800">Customer List</h3>
//           </div>
          
//           {isLoading ? (
//             <div className="p-8 flex justify-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//           ) : filteredCustomers.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               {searchTerm ? 'No customers match your search' : 'No customers found'}
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {filteredCustomers.map((cust) => (
//                 <div key={cust.id} className="p-6 hover:bg-gray-50 transition-colors">
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                     <div className="mb-4 md:mb-0">
//                       <div className="flex items-center">
//                         <h3 className="text-lg font-semibold text-gray-800">{cust.name}</h3>
//                         {cust.is_active ? (
//                           <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center">
//                             <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
//                             Active
//                           </span>
//                         ) : (
//                           <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full flex items-center">
//                             <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
//                             Inactive
//                           </span>
//                         )}
//                       </div>
//                       <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
//                         <div className="flex items-center">
//                           <Mail className="w-4 h-4 mr-2 text-gray-400" /> 
//                           <span className="truncate">{cust.email}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <Phone className="w-4 h-4 mr-2 text-gray-400" /> 
//                           <span>{cust.phone}</span>
//                         </div>
//                         <div className="flex items-start col-span-2">
//                           <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" /> 
//                           <span>
//                             {cust.address_street}, {cust.address_city}, {cust.address_state} - {cust.address_zipcode}, {cust.address_country}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex space-x-2">
//                       <button
//                         onClick={() => openEditModal(cust)}
//                         className="px-4 py-2 bg-white text-indigo-600 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors flex items-center shadow-sm"
//                       >
//                         <Edit className="w-4 h-4 mr-1" /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(cust.id)}
//                         className="px-4 py-2 bg-white text-red-600 rounded-lg border border-red-100 hover:bg-red-50 transition-colors flex items-center shadow-sm"
//                       >
//                         <Trash2 className="w-4 h-4 mr-1" /> Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editingCustomer && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold text-gray-800">Edit Customer</h2>
//                 <button
//                   onClick={() => setEditingCustomer(null)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                   <input
//                     name="name"
//                     value={formData.name || ''}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     name="email"
//                     value={formData.email || ''}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                   <input
//                     name="phone"
//                     value={formData.phone || ''}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
//                   <input
//                     name="address_street"
//                     value={formData.address_street || ''}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                   <input
//                     name="address_city"
//                     value={formData.address_city || ''}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
//                   <input
//                     name="address_state"
//                     value={formData.address_state || ''}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
//                   <input
//                     name="address_zipcode"
//                     value={formData.address_zipcode || ''}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                   <input
//                     name="address_country"
//                     value={formData.address_country || ''}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div className="flex items-center mt-2">
//                   <input
//                     type="checkbox"
//                     name="is_active"
//                     id="is_active"
//                     checked={formData.is_active || false}
//                     onChange={handleChange}
//                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                   />
//                   <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
//                     Active Customer
//                   </label>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                 <button
//                   onClick={() => setEditingCustomer(null)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdate}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerManagement;
import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Phone, Mail, MapPin, X, Users, UserCheck, UserX, Activity, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
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

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
}

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1
  });

  const token = localStorage.getItem('token');

  const fetchCustomers = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await fetch('https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (result.success) {
        setCustomers(result.data.customers);
        setPagination({
          total: result.data.total,
          page: result.data.page,
          totalPages: result.data.totalPages
        });
      }
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
        // Refetch current page to maintain pagination state
        fetchCustomers(pagination.page);
      } else {
        toast.error(result.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  // Filter customers based on search term (client-side filtering)
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats based on all customers (not just current page)
  const totalCustomers = pagination.total;
  const activeCustomers = customers.filter(c => c.is_active).length;
  // Note: This is just for the current page, not all customers
  // For accurate stats, you might need an API endpoint that provides these counts

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCustomers(newPage);
    }
  };

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
              <p className="text-gray-500 text-sm font-medium">Active (Page)</p>
              <p className="text-2xl font-bold text-gray-800">{activeCustomers}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Inactive (Page)</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length - activeCustomers}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-3 rounded-full bg-purple-50 text-purple-600 mr-4">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Rate (Page)</p>
              <p className="text-2xl font-bold text-gray-800">
                {customers.length > 0 ? Math.round((activeCustomers / customers.length) * 100) : 0}%
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
                placeholder="Search current page by name, email or phone"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Customer List</h3>
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * 10 + 1}-
              {Math.min(pagination.page * 10, pagination.total)} of {pagination.total} customers
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'No customers on this page match your search' : 'No customers found on this page'}
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

          {/* Pagination */}
          {!isLoading && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.page - 1) * 10 + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(pagination.page * 10, pagination.total)}</span> of{' '}
                    <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">First</span>
                      <ChevronsLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      disabled={pagination.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Last</span>
                      <ChevronsRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
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