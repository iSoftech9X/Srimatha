// import React, { useState, useEffect } from 'react';
// import { Search, Eye, Clock, CheckCircle, XCircle, Truck, Download, RefreshCw, Phone, MapPin } from 'lucide-react';
// import { useApp } from '../context/AppContext';
// import { Order } from '../types';
// import toast from 'react-hot-toast';
// import { ordersAPI } from '../services/api';

// interface OrderItem {
//   id: number;
//   name: string;
//   quantity: number;
// }

// interface Customer {
//   id?: number;
//   name?: string;
//   phone?: string;
// }

// interface ExtendedOrder extends Order {
//   order_number: string;
//   user?: Customer;
//   customer?: Customer;
//   user_name?: string;
//   customer_name?: string;
//   user_phone?: string;
//   customer_phone?: string;
//   user_address_street?: string;
//   user_address_city?: string;
//   user_address_state?: string;
//   user_address_zipcode?: string;
//   user_address_country?: string;
//   order_type: 'dine-in' | 'takeaway' | 'delivery' | 'catering' | string;
//   status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | string;
//   created_at: string;
//   payment_status?: string;
//   items?: OrderItem[];
// }

// const OrderManagement: React.FC = () => {
//   const { updateOrderStatus } = useApp();
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [typeFilter, setTypeFilter] = useState<string>('all');
//   const [dateFilter, setDateFilter] = useState<string>('all');
//   const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
//   const [orders, setOrders] = useState<ExtendedOrder[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth < 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setIsLoading(true);
//     try {
//       const response = await ordersAPI.getAllOrders({ limit: "1000000" });
//       setOrders(response.data?.data?.orders || []);
//     } catch (error) {
//       console.error('Failed to fetch orders:', error);
//       toast.error('Failed to load orders');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (orderId: number, newStatus: string) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
//         },
//         body: JSON.stringify({ status: newStatus })
//       });

//       if (!response.ok) throw new Error('Failed to update order status');
      
//       setOrders(prevOrders => 
//         prevOrders.map(order => 
//           order.id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
      
//       toast.success(`Order status updated to ${newStatus}`);
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       toast.error('Failed to update order status');
//       fetchOrders();
//     }
//   };

//   const filteredOrders = orders.filter(order => {
//     if (!order) return false;

//     const matchesSearch = 
//       (order.order_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       (order.user_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       (order.user_phone || '').toString().includes(searchTerm) ||
//       (order.user_address_street?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       (order.user_address_city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       (order.user_address_state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
//       (order.user_address_zipcode?.toString() || '').includes(searchTerm);

//     const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
//     const matchesType = typeFilter === 'all' || order.order_type === typeFilter;

//     const orderDate = new Date(order.created_at);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);
//     const weekAgo = new Date(today);
//     weekAgo.setDate(weekAgo.getDate() - 7);

//     let matchesDate = true;
//     switch (dateFilter) {
//       case 'today': matchesDate = orderDate.toDateString() === today.toDateString(); break;
//       case 'yesterday': matchesDate = orderDate.toDateString() === yesterday.toDateString(); break;
//       case 'week': matchesDate = orderDate >= weekAgo; break;
//       default: matchesDate = true;
//     }

//     return matchesSearch && matchesStatus && matchesType && matchesDate;
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
//       case 'ready': return 'bg-green-100 text-green-800 border-green-200';
//       case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
//       case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending': return <Clock size={16} />;
//       case 'confirmed': return <CheckCircle size={16} />;
//       case 'preparing': return <Clock size={16} className="animate-pulse" />;
//       case 'ready': return <CheckCircle size={16} />;
//       case 'delivered': return <Truck size={16} />;
//       case 'cancelled': return <XCircle size={16} />;
//       default: return <Clock size={16} />;
//     }
//   };

//   const getOrderStats = () => {
//     const total = filteredOrders.length;
//     const pending = filteredOrders.filter(o => o.status === 'pending').length;
//     const confirmed = filteredOrders.filter(o => o.status === 'confirmed').length;
//     const preparing = filteredOrders.filter(o => o.status === 'preparing').length;
//     const ready = filteredOrders.filter(o => o.status === 'ready').length;
//     const delivered = filteredOrders.filter(o => o.status === 'delivered').length;
//     const cancelled = filteredOrders.filter(o => o.status === 'cancelled').length;
    
//     return { total, pending, confirmed, preparing, ready, delivered, cancelled };
//   };

//   const stats = getOrderStats();

//   const exportOrders = () => {
//     const csvContent = [
//       ['Order Number', 'Customer', 'Phone', 'Street', 'City', 'State', 'Zipcode', 'Country', 'Type', 'Status', 'Date'].join(','),
//       ...filteredOrders.map(order => [
//         order.order_number,
//         order.user_name || 'N/A',
//         order.user_phone || 'N/A',
//         order.user_address_street || '',
//         order.user_address_city || '',
//         order.user_address_state || '',
//         order.user_address_zipcode || '',
//         order.user_address_country || '',
//         order.order_type,
//         order.status,
//         new Date(order.created_at).toLocaleDateString()
//       ].join(','))
//     ].join('\n');
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//     toast.success('Orders exported successfully!');
//   };

//   const formatAddress = (order: ExtendedOrder) => {
//     const parts = [
//       order.user_address_street,
//       order.user_address_city,
//       order.user_address_state,
//       order.user_address_zipcode,
//       order.user_address_country
//     ].filter(Boolean);
    
//     return parts.join(', ');
//   };

//   return (
//     <div className="space-y-6 p-2 sm:p-4 md:p-6">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Management</h2>
//           <p className="text-sm sm:text-base text-gray-600 mt-1">Track and manage customer orders</p>
//         </div>
//         <div className="flex gap-2 w-full sm:w-auto">
//           <button
//             onClick={exportOrders}
//             className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition-colors duration-300 text-sm sm:text-base"
//           >
//             <Download size={16} className="sm:size-5" />
//             <span className="hidden sm:inline">Export</span>
//           </button>
//           <button
//             onClick={fetchOrders}
//             disabled={isLoading}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base"
//           >
//             <RefreshCw size={16} className={`sm:size-5 ${isLoading ? 'animate-spin' : ''}`} />
//             <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
//         <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
//           <div className="text-lg sm:text-2xl font-bold text-gray-800">{stats.total}</div>
//           <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
//         </div>
//         <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
//           <div className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
//           <div className="text-xs sm:text-sm text-gray-600">Pending</div>
//         </div>
//         <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
//           <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.confirmed}</div>
//           <div className="text-xs sm:text-sm text-gray-600">Confirmed</div>
//         </div>
//         <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
//           <div className="text-lg sm:text-2xl font-bold text-orange-600">{stats.preparing}</div>
//           <div className="text-xs sm:text-sm text-gray-600">Preparing</div>
//         </div>
//         <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
//           <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.ready}</div>
//           <div className="text-xs sm:text-sm text-gray-600">Ready</div>
//         </div>
//         <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
//           <div className="text-lg sm:text-2xl font-bold text-purple-600">{stats.delivered}</div>
//           <div className="text-xs sm:text-sm text-gray-600">Delivered</div>
//         </div>
//         <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
//           <div className="text-lg sm:text-2xl font-bold text-red-600">{stats.cancelled}</div>
//           <div className="text-xs sm:text-sm text-gray-600">Cancelled</div>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
//           <div className="relative">
//             <Search className="absolute left-3 top-3 text-gray-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search orders..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
//             />
//           </div>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="confirmed">Confirmed</option>
//             <option value="preparing">Preparing</option>
//             <option value="ready">Ready</option>
//             <option value="delivered">Delivered</option>
//             <option value="cancelled">Cancelled</option>
//           </select>
//           <select
//             value={typeFilter}
//             onChange={(e) => setTypeFilter(e.target.value)}
//             className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
//           >
//             <option value="all">All Types</option>
//             <option value="dine-in">Dine In</option>
//             <option value="takeaway">Takeaway</option>
//             <option value="delivery">Delivery</option>
//             <option value="catering">Catering</option>
//           </select>
//           <select
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//             className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
//           >
//             <option value="today">Today</option>
//             <option value="yesterday">Yesterday</option>
//             <option value="week">This Week</option>
//             <option value="all">All Time</option>
//           </select>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {isMobileView ? (
//           /* Mobile View - Cards */
//           <div className="space-y-2 p-2">
//             {filteredOrders.length > 0 ? (
//               filteredOrders.map((order) => (
//                 <div key={order.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <div className="font-semibold text-gray-800 flex items-center gap-1">
//                         #{order.order_number}
//                         {order.order_type === 'catering' && (
//                           <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs">
//                             CATERING
//                           </span>
//                         )}
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {new Date(order.created_at).toLocaleDateString()}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <button
//                         onClick={() => setSelectedOrder(order)}
//                         className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                         title="View details"
//                       >
//                         <Eye size={16} />
//                       </button>
//                     </div>
//                   </div>
                  
//                   <div className="mt-2">
//                     <div className="text-xs text-gray-500">Customer</div>
//                     <div className="text-sm font-medium">{order.user_name || 'N/A'}</div>
//                   </div>
                  
//                   <div className="mt-2">
//                     <div className="flex items-center gap-1 text-xs text-gray-500">
//                       <Phone size={12} />
//                       {order.user_phone || 'N/A'}
//                     </div>
//                   </div>
                  
//                   <div className="mt-2 flex items-center justify-between">
//                     <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${getStatusColor(order.status)}`}>
//                       {getStatusIcon(order.status)}
//                       <span className="ml-1 capitalize">{order.status}</span>
//                     </span>
                    
//                     <select
//                       value={order.status}
//                       onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
//                       className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="confirmed">Confirmed</option>
//                       <option value="preparing">Preparing</option>
//                       <option value="ready">Ready</option>
//                       <option value="delivered">Delivered</option>
//                       <option value="cancelled">Cancelled</option>
//                     </select>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-4 text-center text-gray-500">
//                 No orders found matching your criteria
//               </div>
//             )}
//           </div>
//         ) : (
//           /* Desktop View - Table */
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Type</th>
//                   <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredOrders.length > 0 ? (
//                   filteredOrders.map((order) => (
//                     <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
//                             {order.order_number}
//                             {order.order_type === 'catering' && (
//                               <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
//                                 CATERING
//                               </span>
//                             )}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {new Date(order.created_at).toLocaleString()}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {order.user_name || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm text-gray-500 flex items-center gap-2">
//                           <Phone size={12} />
//                           {order.user_phone || 'N/A'}
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
//                         <div className="space-y-2">
//                           <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
//                             {getStatusIcon(order.status)}
//                             <span className="ml-1 capitalize">{order.status}</span>
//                           </span>
//                           <div className={`text-xs capitalize ${order.order_type === 'catering' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
//                             {order.order_type}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             onClick={() => setSelectedOrder(order)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded"
//                             title="View details"
//                           >
//                             <Eye size={16} />
//                           </button>
//                           <select
//                             value={order.status}
//                             onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
//                             className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
//                           >
//                             <option value="pending">Pending</option>
//                             <option value="confirmed">Confirmed</option>
//                             <option value="preparing">Preparing</option>
//                             <option value="ready">Ready</option>
//                             <option value="delivered">Delivered</option>
//                             <option value="cancelled">Cancelled</option>
//                           </select>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
//                       No orders found matching your criteria
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
//           <div className="absolute inset-0 bg-black opacity-30"></div>
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl z-10 max-h-[90vh] overflow-y-auto">
//             <div className="p-4 sm:p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Order Details</h3>
//                 <button
//                   onClick={() => setSelectedOrder(null)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   <XCircle size={20} />
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <span className="text-sm text-gray-500">Order Number:</span>
//                     <p className="text-gray-800 font-semibold"> {selectedOrder.order_number}</p>
//                   </div>
//                   <div>
//                     <span className="text-sm text-gray-500">Order Date:</span>
//                     <p className="text-gray-800 font-semibold">
//                       {new Date(selectedOrder.created_at).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="border-t border-gray-200 pt-4">
//                   <h4 className="text-md font-semibold text-gray-800 mb-2">Customer Information</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-sm text-gray-500">Name:</span>
//                       <p className="text-gray-800 font-semibold">
//                         {selectedOrder.user_name || 'N/A'}
//                       </p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Phone:</span>
//                       <p className="text-gray-800 font-semibold">
//                         {selectedOrder.user_phone || 'N/A'}
//                       </p>
//                     </div>
//                     <div className="md:col-span-2">
//                       <span className="text-sm text-gray-500">Address:</span>
//                       <div className="text-gray-800 font-semibold">
//                         {selectedOrder.user_address_street && (
//                           <div>{selectedOrder.user_address_street}</div>
//                         )}
//                         {selectedOrder.user_address_city && selectedOrder.user_address_state && (
//                           <div>{selectedOrder.user_address_city}, {selectedOrder.user_address_state}</div>
//                         )}
//                         {selectedOrder.user_address_zipcode && (
//                           <div>{selectedOrder.user_address_zipcode}</div>
//                         )}
//                         {selectedOrder.user_address_country && (
//                           <div>{selectedOrder.user_address_country}</div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="border-t border-gray-200 pt-4">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <span className="text-sm text-gray-500">Order Type:</span>
//                       <p className="text-gray-800 font-semibold capitalize"> {selectedOrder.order_type}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Status:</span>
//                       <p className="text-gray-800 font-semibold capitalize"> {selectedOrder.status}</p>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Payment Status:</span>
//                       <p className="text-gray-800 font-semibold capitalize">
//                         {selectedOrder.payment_status === 'paid' ? '✓ Paid' : '⏳ Pending'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {selectedOrder.items && selectedOrder.items.length > 0 && (
//                   <div className="border-t border-gray-200 pt-4">
//                     <h4 className="text-md font-semibold text-gray-800 mb-2">Ordered Items</h4>
//                     <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
//                       {selectedOrder.items.map((item, idx) => (
//                         <li key={idx} className="flex justify-between text-sm text-gray-700">
//                           <span>{item.name} x {item.quantity}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded-b-lg flex justify-end gap-2">
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-300 text-sm sm:text-base"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderManagement;

import React, { useState, useEffect } from 'react';
import { Search, Eye, Clock, CheckCircle, XCircle, Truck, Download, RefreshCw, Phone, MapPin, Users, Calendar, Gift } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import toast from 'react-hot-toast';
import { ordersAPI } from '../services/api';

interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  quantity: number;
  price: string;
}

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
}

interface EventDetails {
  numberOfPersons?: number;
  eventDate?: string;
  eventType?: string;
}

interface Customer {
  id?: number;
  name?: string;
  phone?: string;
  email?: string;
  address?: Address;
}

interface ExtendedOrder extends Order {
  id: number;
  order_number: string;
  user?: Customer;
  customer?: Customer;
  user_name?: string;
  customer_name?: string;
  user_phone?: string;
  customer_phone?: string;
  user_email?: string;
  user_address?: Address;
  order_type: 'dine-in' | 'takeaway' | 'delivery' | 'catering' | string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled' | string;
  created_at: string;
  payment_status?: string;
  paymentStatus?: string;
  items?: OrderItem[];
  subtotal?: string;
  total?: string;
  eventDetails?: EventDetails;
}

const OrderManagement: React.FC = () => {
  const { updateOrderStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await ordersAPI.getAllOrders({ limit: "1000000" });
      setOrders(response.data?.data?.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update order status');
      
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;

    const userAddress = order.user_address || {};
    const customerAddress = order.customer?.address || {};
    
    const matchesSearch = 
      (order.order_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.user_name?.toLowerCase() || order.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.user_phone || order.customer_phone || '').toString().includes(searchTerm) ||
      (userAddress.street?.toLowerCase() || customerAddress.street?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (userAddress.city?.toLowerCase() || customerAddress.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (userAddress.state?.toLowerCase() || customerAddress.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (userAddress.zipcode?.toString() || customerAddress.zipcode?.toString() || '').includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.order_type === typeFilter;

    const orderDate = new Date(order.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let matchesDate = true;
    switch (dateFilter) {
      case 'today': matchesDate = orderDate.toDateString() === today.toDateString(); break;
      case 'yesterday': matchesDate = orderDate.toDateString() === yesterday.toDateString(); break;
      case 'week': matchesDate = orderDate >= weekAgo; break;
      default: matchesDate = true;
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'preparing': return <Clock size={16} className="animate-pulse" />;
      case 'ready': return <CheckCircle size={16} />;
      case 'delivered': return <Truck size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getOrderStats = () => {
    const total = filteredOrders.length;
    const pending = filteredOrders.filter(o => o.status === 'pending').length;
    const confirmed = filteredOrders.filter(o => o.status === 'confirmed').length;
    const preparing = filteredOrders.filter(o => o.status === 'preparing').length;
    const ready = filteredOrders.filter(o => o.status === 'ready').length;
    const delivered = filteredOrders.filter(o => o.status === 'delivered').length;
    const cancelled = filteredOrders.filter(o => o.status === 'cancelled').length;
    
    return { total, pending, confirmed, preparing, ready, delivered, cancelled };
  };

  const stats = getOrderStats();

  const exportOrders = () => {
    const csvContent = [
      ['Order Number', 'Customer', 'Phone', 'Email', 'Street', 'City', 'State', 'Zipcode', 'Country', 'Type', 'Status', 'Date', 'Subtotal', 'Total'].join(','),
      ...filteredOrders.map(order => {
        const address = order.user_address || {};
        return [
          order.order_number,
          order.user_name || order.customer_name || 'N/A',
          order.user_phone || order.customer_phone || 'N/A',
          order.user_email || 'N/A',
          address.street || '',
          address.city || '',
          address.state || '',
          address.zipcode || '',
          address.country || '',
          order.order_type,
          order.status,
          new Date(order.created_at).toLocaleDateString(),
          order.subtotal || '0.00',
          order.total || '0.00'
        ].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Orders exported successfully!');
  };

  const formatAddress = (order: ExtendedOrder) => {
    const address = order.user_address || {};
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipcode,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const formatEventDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6 p-2 sm:p-4 md:p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Order Management</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={exportOrders}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition-colors duration-300 text-sm sm:text-base"
          >
            <Download size={16} className="sm:size-5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={fetchOrders}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold flex items-center gap-1 sm:gap-2 transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw size={16} className={`sm:size-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div className="text-lg sm:text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-xs sm:text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div className="text-lg sm:text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs sm:text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div className="text-lg sm:text-2xl font-bold text-blue-600">{stats.confirmed}</div>
          <div className="text-xs sm:text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div className="text-lg sm:text-2xl font-bold text-orange-600">{stats.preparing}</div>
          <div className="text-xs sm:text-sm text-gray-600">Preparing</div>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div className="text-lg sm:text-2xl font-bold text-green-600">{stats.ready}</div>
          <div className="text-xs sm:text-sm text-gray-600">Ready</div>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div className="text-lg sm:text-2xl font-bold text-purple-600">{stats.delivered}</div>
          <div className="text-xs sm:text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md">
          <div className="text-lg sm:text-2xl font-bold text-red-600">{stats.cancelled}</div>
          <div className="text-xs sm:text-sm text-gray-600">Cancelled</div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
          >
            <option value="all">All Types</option>
            <option value="dine-in">Dine In</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
            <option value="catering">Catering</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isMobileView ? (
          /* Mobile View - Cards */
          <div className="space-y-2 p-2">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-800 flex items-center gap-1">
                        #{order.order_number}
                        {order.order_type === 'catering' && (
                          <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs">
                            CATERING
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Customer</div>
                    <div className="text-sm font-medium">{order.user_name || order.customer_name || 'N/A'}</div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Phone size={12} />
                      {order.user_phone || order.customer_phone || 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                    
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No orders found matching your criteria
              </div>
            )}
          </div>
        ) : (
          /* Desktop View - Table */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Type</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {order.order_number}
                            {order.order_type === 'catering' && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                CATERING
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user_name || order.customer_name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone size={12} />
                          {order.user_phone || order.customer_phone || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </span>
                          <div className={`text-xs capitalize ${order.order_type === 'catering' ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                            {order.order_type}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="View details"
                          >
                            <Eye size={16} />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Order Number:</span>
                    <p className="text-gray-800 font-semibold"> {selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Order Date:</span>
                    <p className="text-gray-800 font-semibold">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="text-gray-800 font-semibold">
                        {selectedOrder.user_name || selectedOrder.customer_name || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <p className="text-gray-800 font-semibold">
                        {selectedOrder.user_phone || selectedOrder.customer_phone || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="text-gray-800 font-semibold">
                        {selectedOrder.user_email || 'N/A'}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-sm text-gray-500">Address:</span>
                      <div className="text-gray-800 font-semibold">
                        {selectedOrder.user_address?.street && (
                          <div>{selectedOrder.user_address.street}</div>
                        )}
                        {selectedOrder.user_address?.city && selectedOrder.user_address?.state && (
                          <div>{selectedOrder.user_address.city}, {selectedOrder.user_address.state}</div>
                        )}
                        {selectedOrder.user_address?.zipcode && (
                          <div>{selectedOrder.user_address.zipcode}</div>
                        )}
                        {selectedOrder.user_address?.country && (
                          <div>{selectedOrder.user_address.country}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Order Type:</span>
                      <p className="text-gray-800 font-semibold capitalize"> {selectedOrder.order_type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <p className="text-gray-800 font-semibold capitalize"> {selectedOrder.status}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Payment Status:</span>
                      <p className="text-gray-800 font-semibold capitalize">
                        {selectedOrder.payment_status === 'paid' || selectedOrder.paymentStatus === 'paid' 
                          ? '✓ Paid' 
                          : '⏳ Pending'}
                      </p>
                    </div>
                    {/* <div>
                      <span className="text-sm text-gray-500">Total Amount:</span>
                      <p className="text-gray-800 font-semibold">
                        ₹{selectedOrder.total || '0.00'}
                      </p>
                    </div> */}
                  </div>
                </div>

                {/* Event Details Section - Only for catering orders */}
                {selectedOrder.order_type === 'catering' && selectedOrder.eventDetails && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Event Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Gift size={16} className="text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500">Event Type:</span>
                          <p className="text-gray-800 font-semibold">
                            {selectedOrder.eventDetails.eventType || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500">Event Date:</span>
                          <p className="text-gray-800 font-semibold">
                            {formatEventDate(selectedOrder.eventDetails.eventDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500">Number of Persons:</span>
                          <p className="text-gray-800 font-semibold">
                            {selectedOrder.eventDetails.numberOfPersons || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOrder.items && selectedOrder.items.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-md font-semibold text-gray-800 mb-2">Ordered Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-semibold">₹{item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Total:</span>
                      <span className="text-sm font-semibold">₹{selectedOrder.total || '0.00'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 rounded-b-lg flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors duration-300 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;