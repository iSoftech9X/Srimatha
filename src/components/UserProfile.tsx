
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Edit, 
//   Save, 
//   X, 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Shield, 
//   Calendar, 
//   History,
//   ChevronUp,
//   ChevronDown 
// } from 'lucide-react';
// import { authAPI, ordersAPI } from '../services/api';
// import toast from 'react-hot-toast';

// interface UserProfile {
//   id?: number;
//   name: string;
//   email: string;
//   phone: string;
//   address_street?: string;
//   address_city?: string;
//   address_state?: string;
//   address_zipcode?: string;
//   address_country?: string;
//   role: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
//   data?: {
//     user: {
//       name: string;
//       email: string;
//       phone: string;
//       address_street: string;
//       address_city: string;
//       address_state: string;
//       address_zipcode: string;
//       address_country: string;
//       role: string;
//       created_at: string;
//       is_active: boolean;
//     };
//   };
// }

// interface OrderItem {
//   id: number;
//   order_id: number;
//   menu_item_id: number;
//   quantity: number;
//   price: string;
//   special_instructions: string | null;
//   name: string;
//   description: string;
// }

// interface ApiOrder {
//   id: number;
//   order_number: string;
//   customer_id: number;
//   status: string;
//   subtotal: string;
//   total: string;
//   payment_status: string;
//   order_type: string;
//   created_at: string;
//   updated_at: string;
//   items?: OrderItem[];
// }

// interface Props {
//   profile: UserProfile;
//   onClose: () => void;
//   onUpdateSuccess?: (updatedProfile: UserProfile) => void;
// }

// const UserProfileModal: React.FC<Props> = ({ profile, onClose, onUpdateSuccess }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState<Partial<UserProfile>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
//   const [orders, setOrders] = useState<ApiOrder[]>([]);
//   const [loadingOrders, setLoadingOrders] = useState(false);
//   const [orderError, setOrderError] = useState("");
//   const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
//   const [currentProfile, setCurrentProfile] = useState(getUserData());
//   const [showDropdown, setShowDropdown] = useState<number | null>(null);
//   const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
//   const [showCancelForm, setShowCancelForm] = useState<number | null>(null);
//   const [cancelReason, setCancelReason] = useState("");
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Safely get user data with fallbacks
//   function getUserData() {
//     return profile?.data?.user || profile || {
//       name: '',
//       email: '',
//       phone: '',
//       address_street: '',
//       address_city: '',
//       address_state: '',
//       address_zipcode: '',
//       address_country: '',
//       role: '',
//       is_active: false,
//       created_at: new Date().toISOString()
//     };
//   }

//   useEffect(() => {
//     const data = getUserData();
//     setCurrentProfile(data);
//     setFormData({
//       name: data.name || '',
//       email: data.email || '',
//       phone: data.phone || '',
//       address_street: data.address_street || '',
//       address_city: data.address_city || '',
//       address_state: data.address_state || '',
//       address_zipcode: data.address_zipcode || '',
//       address_country: data.address_country || ''
//     });
//   }, [profile]);

//   useEffect(() => {
//     if (activeTab === 'orders') {
//       fetchOrderHistory();
//     }
//   }, [activeTab]);

//   // Handle clicks outside dropdown
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (showDropdown !== null && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowDropdown(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [showDropdown]);

//   const fetchOrderHistory = async () => {
//     setLoadingOrders(true);
//     setOrderError("");
//     try {
//       const response = await ordersAPI.getMyOrders({
//         includeItems: true,
//         expand: "items.menu_item",
//       });
//       setOrders(response.data?.orders || response.data?.data?.orders || []);
//     } catch (err) {
//       setOrderError("Failed to load order history");
//       console.error("Error fetching orders:", err);
//     } finally {
//       setLoadingOrders(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const patchData = {
//         name: formData.name || '',
//         email: formData.email || '',
//         phone: formData.phone || '',
//         address: {
//           street: formData.address_street || '',
//           city: formData.address_city || '',
//           state: formData.address_state || '',
//           zipcode: formData.address_zipcode || '',
//           country: formData.address_country || ''
//         }
//       };

//       const response = await authAPI.patchProfile(patchData);
      
//       // Update local state with the new data
//       const updatedUser = {
//         ...currentProfile,
//         name: formData.name || currentProfile.name,
//         email: formData.email || currentProfile.email,
//         phone: formData.phone || currentProfile.phone,
//         address_street: formData.address_street || currentProfile.address_street,
//         address_city: formData.address_city || currentProfile.address_city,
//         address_state: formData.address_state || currentProfile.address_state,
//         address_zipcode: formData.address_zipcode || currentProfile.address_zipcode,
//         address_country: formData.address_country || currentProfile.address_country
//       };
      
//       setCurrentProfile(updatedUser);
//       setEditMode(false);
      
//       toast.success('Profile updated successfully!', {
//         duration: 3000,
//         position: 'top-right',
//       });
      
//       if (onUpdateSuccess) onUpdateSuccess(updatedUser);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       setError('Failed to update profile. Please try again.');
      
//       toast.error('Failed to update profile', {
//         duration: 3000,
//         position: 'top-right',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (editMode) {
//       setFormData({
//         name: currentProfile.name,
//         email: currentProfile.email,
//         phone: currentProfile.phone,
//         address_street: currentProfile.address_street,
//         address_city: currentProfile.address_city,
//         address_state: currentProfile.address_state,
//         address_zipcode: currentProfile.address_zipcode,
//         address_country: currentProfile.address_country
//       });
//       setEditMode(false);
//       setError(null);
//     } else {
//       onClose();
//     }
//   };

//   const formatDate = (dateString: string) => {
//     try {
//       const options: Intl.DateTimeFormatOptions = {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//       };
//       return new Date(dateString).toLocaleDateString('en-US', options);
//     } catch (e) {
//       console.error('Invalid date format:', dateString);
//       return 'Invalid date';
//     }
//   };

//   const getStatusColor = (status: string) => {
//     if (!status) return 'bg-gray-100 text-gray-800';
    
//     switch (status.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'confirmed':
//         return 'bg-blue-100 text-blue-800';
//       case 'preparing':
//         return 'bg-purple-100 text-purple-800';
//       case 'ready':
//         return 'bg-indigo-100 text-indigo-800';
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const toggleOrderExpand = (orderId: number) => {
//     setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
//   };

//   const toggleDropdown = (orderId: number) => {
//     setShowDropdown(showDropdown === orderId ? null : orderId);
//   };

//   const handleCancelClick = (orderId: number) => {
//     setShowCancelForm(orderId);
//     setCancelReason("");
//     setShowDropdown(null);
//   };

//   const handleCancelFormClose = () => {
//     setShowCancelForm(null);
//     setCancelReason("");
//   };

//   const cancelOrder = async (id: number) => {
//     if (!cancelReason.trim()) {
//       toast.error("Please provide a cancellation reason");
//       return;
//     }

//     setCancellingOrderId(id);
//     try {
//       await ordersAPI.cancelOrder(id, cancelReason.trim());
//       toast.success("Order cancelled successfully");
//       setOrders(
//         orders.map((order) =>
//           order.id === id ? { ...order, status: "cancelled" } : order
//         )
//       );
//       setShowCancelForm(null);
//       setCancelReason("");
//       setShowDropdown(null);
//     } catch (err) {
//       toast.error("Failed to cancel order. Please try again.");
//       console.error("Error cancelling order:", err);
//     } finally {
//       setCancellingOrderId(null);
//     }
//   };

//   const canCancelOrder = (status: string) => {
//     return status === "pending";
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto">
//       <div className="min-h-screen flex flex-col">
//         <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: '#501608' }}>
//           <div>
//             <h2 className="text-2xl font-bold">{currentProfile.name || 'User Profile'}</h2>
//             <p className="text-orange-100">{currentProfile.role || 'Customer'}</p>
//           </div>
//           <button
//             onClick={handleCancel}
//             className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition"
//             title="Close"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="flex-1 bg-gray-50 p-6">
//           <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
//             {/* Tabs */}
//             <div className="border-b border-gray-200">
//               <nav className="flex -mb-px">
//                 <button
//                   onClick={() => setActiveTab('profile')}
//                   className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
//                 >
//                   <User size={16} />
//                   Profile
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('orders')}
//                   className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${activeTab === 'orders' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
//                 >
//                   <History size={16} />
//                   My Orders
//                 </button>
//               </nav>
//             </div>

//             {error && (
//               <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
//                 <p>{error}</p>
//               </div>
//             )}

//             {activeTab === 'profile' ? (
//               editMode ? (
//                 <form onSubmit={handleSubmit} className="p-8 space-y-6" style={{ color: 'black' }}>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {[
//                       { label: 'Name', name: 'name', icon: User },
//                       { label: 'Email', name: 'email', icon: Mail, type: 'email' },
//                       { label: 'Phone', name: 'phone', icon: Phone, type: 'tel' },
//                       { label: 'Street', name: 'address_street', icon: MapPin },
//                       { label: 'City', name: 'address_city', icon: MapPin },
//                       { label: 'State', name: 'address_state', icon: MapPin },
//                       { label: 'Zipcode', name: 'address_zipcode', icon: MapPin },
//                       { label: 'Country', name: 'address_country', icon: MapPin },
//                     ].map(({ label, name, icon: Icon, type = 'text' }) => (
//                       <div key={name} className="">
//                         <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
//                           <Icon size={16} className="text-orange-600" />
//                           {label}
//                         </label>
//                         <input
//                           type={type}
//                           name={name}
//                           value={formData[name as keyof UserProfile] || ''}
//                           onChange={handleInputChange}
//                           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                           disabled={isLoading}
//                           required={['name', 'email'].includes(name)}
//                         />
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex justify-end gap-4 pt-4">
//                     <button
//                       type="button"
//                       onClick={handleCancel}
//                       disabled={isLoading}
//                       className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
//                     >
//                       <X size={16} />
//                       Cancel
//                     </button>
//                     <button
//                       type="submit"
//                       disabled={isLoading}
//                       className="px-6 py-3 bg-orange-600 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition disabled:bg-orange-400"
//                     >
//                       {isLoading ? (
//                         'Saving...'
//                       ) : (
//                         <>
//                           <Save size={16} />
//                           Save Changes
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 <div className="p-8">
//                   <div className="flex justify-between items-center mb-8">
//                     <div className="flex items-center gap-4">
//                       <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
//                         <User size={32} className="text-orange-600" />
//                       </div>
//                       <div>
//                         <p className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#501608' }}>
//                           {currentProfile.name?.toUpperCase() || 'USER'}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setEditMode(true)}
//                       className="px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition"
//                       style={{ backgroundColor: '#501608' }}
//                     >
//                       <Edit size={16} />
//                       Edit Profile
//                     </button>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="space-y-6">
//                       <div className="bg-orange-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
//                           <Mail size={20} />
//                           Contact Information
//                         </h4>
//                         <div className="space-y-4">
//                           <div>
//                             <p className="font-bold text-sm text-gray-500">Email</p>
//                             <p className="text-gray-900">{currentProfile.email || 'Not provided'}</p>
//                           </div>
//                           <div>
//                             <p className="font-bold text-sm text-gray-500">Phone</p>
//                             <p className="text-gray-900">{currentProfile.phone || 'Not provided'}</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="bg-orange-50 p-4 rounded-lg">
//                         <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
//                           <Calendar size={20} />
//                           Account Information
//                         </h4>
//                         <div>
//                           <p className="font-bold text-sm text-gray-500">Member Since</p>
//                           <p className="text-gray-900">
//                             {currentProfile.created_at ? new Date(currentProfile.created_at).toLocaleDateString('en-US', {
//                               year: 'numeric',
//                               month: 'long',
//                               day: 'numeric'
//                             }) : 'Unknown'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="bg-orange-50 p-4 rounded-lg">
//                       <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
//                         <MapPin size={20} />
//                         Address
//                       </h4>
//                       <div className="space-y-2">
//                         <div>
//                           <p className="font-bold text-sm text-gray-500">Street</p>
//                           <p className="text-gray-900">{currentProfile.address_street || 'Not provided'}</p>
//                         </div>
//                         <div>
//                           <p className="font-bold text-sm text-gray-500">City/State/Zip</p>
//                           <p className="text-gray-900">
//                             {[currentProfile.address_city, currentProfile.address_state, currentProfile.address_zipcode]
//                               .filter(Boolean)
//                               .join(', ') || 'Not provided'}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="font-bold text-sm text-gray-500">Country</p>
//                           <p className="text-gray-900">{currentProfile.address_country || 'Not provided'}</p>
//                         </div>
//                         <div>
//                           <p className="font-bold text-sm text-gray-500">Account Status</p>
//                           <p className="text-gray-900">{currentProfile.is_active ? 'Active' : 'Inactive'}</p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )
//             ) : (
//               <div className="p-8">
//                 <h2 className="text-2xl font-bold mb-6" style={{ color: '#501608' }}>
//                   Order History
//                 </h2>

//                 {loadingOrders ? (
//                   <div className="text-center py-8">
//                     <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent"></div>
//                     <p className="mt-2 text-gray-600">Loading your orders...</p>
//                   </div>
//                 ) : orderError ? (
//                   <div className="text-center py-8 text-red-500">{orderError}</div>
//                 ) : orders.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <History size={48} className="mx-auto mb-4 text-gray-300" />
//                     <p>No past orders found</p>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-gray-200">
//                     {orders.map((order) => (
//                       <div
//                         key={order.id}
//                         className="p-6 hover:bg-gray-50 transition-colors duration-200"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <h3 className="font-semibold text-lg text-gray-800">
//                               Order #{order.order_number || `ORD-${order.id}`}
//                             </h3>
//                             <p className="text-sm text-gray-500">
//                               {formatDate(order.created_at)}
//                             </p>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                                 order.status
//                               )}`}
//                             >
//                               {order.status.charAt(0).toUpperCase() +
//                                 order.status.slice(1)}
//                             </span>
//                             <div className="relative">
//                               <button
//                                 onClick={() => toggleDropdown(order.id)}
//                                 className="p-1 rounded-full hover:bg-gray-200 transition-colors"
//                               >
//                                 <svg
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   className="h-5 w-5 text-gray-500"
//                                   viewBox="0 0 20 20"
//                                   fill="currentColor"
//                                 >
//                                   <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
//                                 </svg>
//                               </button>
//                               {showDropdown === order.id && (
//                                 <div 
//                                   ref={dropdownRef}
//                                   className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
//                                 >
//                                   {canCancelOrder(order.status) && (
//                                     <button
//                                       onClick={() => handleCancelClick(order.id)}
//                                       className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                                     >
//                                       Cancel Order
//                                     </button>
//                                   )}
//                                   <button
//                                     onClick={() => {
//                                       toggleOrderExpand(order.id);
//                                       setShowDropdown(null);
//                                     }}
//                                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                   >
//                                     {expandedOrderId === order.id
//                                       ? "Hide Items"
//                                       : "View Items"}
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="mt-4 flex justify-between items-center">
//                           <div></div>
//                           <button
//                             onClick={() => toggleOrderExpand(order.id)}
//                             className="text-sm text-[#501608] hover:underline flex items-center gap-1"
//                           >
//                             {expandedOrderId === order.id ? (
//                               <>
//                                 <span>Hide Items</span>
//                                 <ChevronUp size={16} />
//                               </>
//                             ) : (
//                               <>
//                                 <span>View Items</span>
//                                 <ChevronDown size={16} />
//                               </>
//                             )}
//                           </button>
//                         </div>

//                         {expandedOrderId === order.id && (
//                           <div className="mt-4 bg-gray-50 p-4 rounded-lg">
//                             <h4 className="font-medium text-gray-700 mb-3">
//                               Order Items:
//                             </h4>
//                             <div className="flex flex-wrap gap-2">
//                               {order.items && order.items.length > 0 ? (
//                                 order.items.map((item) => (
//                                   <div
//                                     key={item.id}
//                                     className="bg-white px-3 py-2 rounded-md shadow-sm text-sm"
//                                   >
//                                     <span className="font-medium">
//                                       {item.quantity}x {item.name}
//                                     </span>
//                                     {item.special_instructions && (
//                                       <span className="text-orange-600 ml-2">
//                                         ({item.special_instructions})
//                                       </span>
//                                     )}
//                                   </div>
//                                 ))
//                               ) : (
//                                 <p className="text-sm text-gray-500">
//                                   No item details available
//                                 </p>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {showCancelForm === order.id && (
//                           <div className="mt-4 bg-gray-50 p-4 rounded-lg">
//                             <h4 className="font-medium text-gray-700 mb-2">
//                               Cancel Order
//                             </h4>
//                             <textarea
//                               value={cancelReason}
//                               onChange={(e) => setCancelReason(e.target.value)}
//                               placeholder="Please provide a reason for cancellation..."
//                               className="w-full p-2 border border-gray-300 rounded-md mb-2"
//                               rows={3}
//                             />
//                             <div className="flex justify-end gap-2">
//                               <button
//                                 onClick={handleCancelFormClose}
//                                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
//                               >
//                                 Back
//                               </button>
//                               <button
//                                 onClick={() => cancelOrder(order.id)}
//                                 disabled={
//                                   !cancelReason.trim() ||
//                                   cancellingOrderId === order.id
//                                 }
//                                 className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300 disabled:opacity-50"
//                               >
//                                 {cancellingOrderId === order.id
//                                   ? "Cancelling..."
//                                   : "Confirm Cancellation"}
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfileModal;
import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Calendar, 
  History,
  ChevronUp,
  ChevronDown,
  Users,
  Clock,
  Gift
} from 'lucide-react';
import { authAPI, ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  address_zipcode?: string;
  address_country?: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  data?: {
    user: {
      name: string;
      email: string;
      phone: string;
      address_street: string;
      address_city: string;
      address_state: string;
      address_zipcode: string;
      address_country: string;
      role: string;
      created_at: string;
      is_active: boolean;
    };
  };
}

interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: string;
  special_instructions: string | null;
  name: string;
  description: string;
}

interface ApiOrder {
  id: number;
  order_number: string;
  customer_id: number;
  status: string;
  subtotal: string;
  total: string;
  payment_status: string;
  order_type: string;
  created_at: string;
  updated_at: string;
  cancellation_reason: string | null;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address_street: string;
  user_address_city: string;
  user_address_state: string;
  user_address_zipcode: string;
  user_address_country: string;
  event_number_of_persons: number;
  event_date: string;
  event_type: string;
  items?: OrderItem[];
}

interface Props {
  profile: UserProfile;
  onClose: () => void;
  onUpdateSuccess?: (updatedProfile: UserProfile) => void;
}

const UserProfileModal: React.FC<Props> = ({ profile, onClose, onUpdateSuccess }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [currentProfile, setCurrentProfile] = useState(getUserData());
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  const [showCancelForm, setShowCancelForm] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Safely get user data with fallbacks
  function getUserData() {
    return profile?.data?.user || profile || {
      name: '',
      email: '',
      phone: '',
      address_street: '',
      address_city: '',
      address_state: '',
      address_zipcode: '',
      address_country: '',
      role: '',
      is_active: false,
      created_at: new Date().toISOString()
    };
  }

  useEffect(() => {
    const data = getUserData();
    setCurrentProfile(data);
    setFormData({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      address_street: data.address_street || '',
      address_city: data.address_city || '',
      address_state: data.address_state || '',
      address_zipcode: data.address_zipcode || '',
      address_country: data.address_country || ''
    });
  }, [profile]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrderHistory();
    }
  }, [activeTab]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown !== null && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // const fetchOrderHistory = async () => {
  //   setLoadingOrders(true);
  //   setOrderError("");
  //   try {
  //     const response = await ordersAPI.getMyOrders({
  //       includeItems: true,
  //       expand: "items.menu_item",
  //     });
  //     setOrders(response.data?.orders || response.data?.data?.orders || []);
  //   } catch (err) {
  //     setOrderError("Failed to load order history");
  //     console.error("Error fetching orders:", err);
  //   } finally {
  //     setLoadingOrders(false);
  //   }
  // };
const fetchOrderHistory = async () => {
  setLoadingOrders(true);
  setOrderError("");
  try {
    const response = await ordersAPI.getMyOrders({
      includeItems: true,
      expand: "items.menu_item",
      limit: 10000000, // Request a very large limit to get all orders
    });
    setOrders(response.data?.orders || response.data?.data?.orders || []);
  } catch (err) {
    setOrderError("Failed to load order history");
    console.error("Error fetching orders:", err);
  } finally {
    setLoadingOrders(false);
  }
};
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const patchData = {
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: {
          street: formData.address_street || '',
          city: formData.address_city || '',
          state: formData.address_state || '',
          zipcode: formData.address_zipcode || '',
          country: formData.address_country || ''
        }
      };

      const response = await authAPI.patchProfile(patchData);
      
      // Update local state with the new data
      const updatedUser = {
        ...currentProfile,
        name: formData.name || currentProfile.name,
        email: formData.email || currentProfile.email,
        phone: formData.phone || currentProfile.phone,
        address_street: formData.address_street || currentProfile.address_street,
        address_city: formData.address_city || currentProfile.address_city,
        address_state: formData.address_state || currentProfile.address_state,
        address_zipcode: formData.address_zipcode || currentProfile.address_zipcode,
        address_country: formData.address_country || currentProfile.address_country
      };
      
      setCurrentProfile(updatedUser);
      setEditMode(false);
      
      toast.success('Profile updated successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      
      if (onUpdateSuccess) onUpdateSuccess(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      
      toast.error('Failed to update profile', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (editMode) {
      setFormData({
        name: currentProfile.name,
        email: currentProfile.email,
        phone: currentProfile.phone,
        address_street: currentProfile.address_street,
        address_city: currentProfile.address_city,
        address_state: currentProfile.address_state,
        address_zipcode: currentProfile.address_zipcode,
        address_country: currentProfile.address_country
      });
      setEditMode(false);
      setError(null);
    } else {
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return 'Invalid date';
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (e) {
      console.error('Invalid date format:', dateString);
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800';
      case 'ready':
        return 'bg-indigo-100 text-indigo-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const toggleDropdown = (orderId: number) => {
    setShowDropdown(showDropdown === orderId ? null : orderId);
  };

  const handleCancelClick = (orderId: number) => {
    setShowCancelForm(orderId);
    setCancelReason("");
    setShowDropdown(null);
  };

  const handleCancelFormClose = () => {
    setShowCancelForm(null);
    setCancelReason("");
  };

  const cancelOrder = async (id: number) => {
    if (!cancelReason.trim()) {
      toast.error("Please provide a cancellation reason");
      return;
    }

    setCancellingOrderId(id);
    try {
      await ordersAPI.cancelOrder(id, cancelReason.trim());
      toast.success("Order cancelled successfully");
      setOrders(
        orders.map((order) =>
          order.id === id ? { ...order, status: "cancelled" } : order
        )
      );
      setShowCancelForm(null);
      setCancelReason("");
      setShowDropdown(null);
    } catch (err) {
      toast.error("Failed to cancel order. Please try again.");
      console.error("Error cancelling order:", err);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const canCancelOrder = (status: string) => {
    return status === "pending";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        <div className="p-6 text-white flex justify-between items-center" style={{ backgroundColor: '#501608' }}>
          <div>
            <h2 className="text-2xl font-bold">{currentProfile.name || 'User Profile'}</h2>
            <p className="text-orange-100">{currentProfile.role || 'Customer'}</p>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${activeTab === 'orders' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <History size={16} />
                  My Orders
                </button>
              </nav>
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p>{error}</p>
              </div>
            )}

            {activeTab === 'profile' ? (
              editMode ? (
                <form onSubmit={handleSubmit} className="p-8 space-y-6" style={{ color: 'black' }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Name', name: 'name', icon: User },
                      { label: 'Email', name: 'email', icon: Mail, type: 'email' },
                      { label: 'Phone', name: 'phone', icon: Phone, type: 'tel' },
                      { label: 'Street', name: 'address_street', icon: MapPin },
                      { label: 'City', name: 'address_city', icon: MapPin },
                      { label: 'State', name: 'address_state', icon: MapPin },
                      { label: 'Zipcode', name: 'address_zipcode', icon: MapPin },
                      { label: 'Country', name: 'address_country', icon: MapPin },
                    ].map(({ label, name, icon: Icon, type = 'text' }) => (
                      <div key={name} className="">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Icon size={16} className="text-orange-600" />
                          {label}
                        </label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name as keyof UserProfile] || ''}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={isLoading}
                          required={['name', 'email'].includes(name)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition disabled:bg-orange-400"
                    >
                      {isLoading ? (
                        'Saving...'
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                        <User size={32} className="text-orange-600" />
                      </div>
                      <div>
                        <p className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#501608' }}>
                          {currentProfile.name?.toUpperCase() || 'USER'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 text-white rounded-lg flex items-center gap-2 hover:bg-orange-700 transition"
                      style={{ backgroundColor: '#501608' }}
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
                          <Mail size={20} />
                          Contact Information
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <p className="font-bold text-sm text-gray-500">Email</p>
                            <p className="text-gray-900">{currentProfile.email || 'Not provided'}</p>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-500">Phone</p>
                            <p className="text-gray-900">{currentProfile.phone || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
                          <Calendar size={20} />
                          Account Information
                        </h4>
                        <div>
                          <p className="font-bold text-sm text-gray-500">Member Since</p>
                          <p className="text-gray-900">
                            {currentProfile.created_at ? new Date(currentProfile.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-4 flex items-center gap-2 text-orange-700">
                        <MapPin size={20} />
                        Address
                      </h4>
                      <div className="space-y-2">
                        <div>
                          <p className="font-bold text-sm text-gray-500">Street</p>
                          <p className="text-gray-900">{currentProfile.address_street || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-500">City/State/Zip</p>
                          <p className="text-gray-900">
                            {[currentProfile.address_city, currentProfile.address_state, currentProfile.address_zipcode]
                              .filter(Boolean)
                              .join(', ') || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-500">Country</p>
                          <p className="text-gray-900">{currentProfile.address_country || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-500">Account Status</p>
                          <p className="text-gray-900">{currentProfile.is_active ? 'Active' : 'Inactive'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#501608' }}>
                  Order History
                </h2>

                {loadingOrders ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-600 border-t-transparent"></div>
                    <p className="mt-2 text-gray-600">Loading your orders...</p>
                  </div>
                ) : orderError ? (
                  <div className="text-center py-8 text-red-500">{orderError}</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No past orders found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-6 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                              Order #{order.order_number || `ORD-${order.id}`}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                            <div className="relative">
                              <button
                                onClick={() => toggleDropdown(order.id)}
                                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-gray-500"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                              {showDropdown === order.id && (
                                <div 
                                  ref={dropdownRef}
                                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                                >
                                  {canCancelOrder(order.status) && (
                                    <button
                                      onClick={() => handleCancelClick(order.id)}
                                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      Cancel Order
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      toggleOrderExpand(order.id);
                                      setShowDropdown(null);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    {expandedOrderId === order.id
                                      ? "Hide Details"
                                      : "View Details"}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            {/* <span className="font-medium">Total: </span>
                            ${order.total || '0.00'} */}
                          </div>
                          <button
                            onClick={() => toggleOrderExpand(order.id)}
                            className="text-sm text-[#501608] hover:underline flex items-center gap-1"
                          >
                            {expandedOrderId === order.id ? (
                              <>
                                <span>Hide Details</span>
                                <ChevronUp size={16} />
                              </>
                            ) : (
                              <>
                                <span>View Details</span>
                                <ChevronDown size={16} />
                              </>
                            )}
                          </button>
                        </div>

                        {expandedOrderId === order.id && (
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-4">
                            {/* Order Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-700 mb-3">
                                  Order Summary
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Order Type:</span>
                                    <span className="font-medium">{order.order_type || 'N/A'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                   
                                  </div>
                                  <div className="flex justify-between">
                                    {/* <span className="text-gray-600">Total:</span>
                                    <span className="font-medium">${order.total || '0.00'}</span> */}
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className="font-medium capitalize">{order.payment_status || 'N/A'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Event Details */}
                              {order.order_type === 'catering' && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <Gift size={18} />
                                    Event Details
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 flex items-center gap-1">
                                        <Clock size={14} />
                                        Event Date:
                                      </span>
                                      <span className="font-medium">
                                        {order.event_date ? formatEventDate(order.event_date) : 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600 flex items-center gap-1">
                                        <Users size={14} />
                                        Number of Persons:
                                      </span>
                                      <span className="font-medium">
                                        {order.event_number_of_persons || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-gray-600 flex items-center gap-1">
                                        <Calendar size={14} />
                                        Event Type:
                                      </span>
                                     
                                      <span className="font-medium capitalize">
                                        {order.event_type || 'N/A'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Order Items */}
                            <div>
                              <h4 className="font-medium text-gray-700 mb-3">
                                Order Items:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {order.items && order.items.length > 0 ? (
                                  order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="bg-white px-3 py-2 rounded-md shadow-sm text-sm"
                                    >
                                      <span className="font-medium">
                                        {item.quantity}x {item.name}
                                      </span>
                                      {item.special_instructions && (
                                        <span className="text-orange-600 ml-2">
                                          ({item.special_instructions})
                                        </span>
                                      )}
                                      
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    No item details available
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Cancellation Reason (if cancelled) */}
                            {order.status === 'cancelled' && order.cancellation_reason && (
                              <div className="mt-4 p-3 bg-red-50 rounded-md">
                                <h5 className="font-medium text-red-700">Cancellation Reason:</h5>
                                <p className="text-red-600">{order.cancellation_reason}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {showCancelForm === order.id && (
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Cancel Order
                            </h4>
                            <textarea
                              value={cancelReason}
                              onChange={(e) => setCancelReason(e.target.value)}
                              placeholder="Please provide a reason for cancellation..."
                              className="w-full p-2 border border-gray-300 rounded-md mb-2"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={handleCancelFormClose}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-300"
                              >
                                Back
                              </button>
                              <button
                                onClick={() => cancelOrder(order.id)}
                                disabled={
                                  !cancelReason.trim() ||
                                  cancellingOrderId === order.id
                                }
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors duration-300 disabled:opacity-50"
                              >
                                {cancellingOrderId === order.id
                                  ? "Cancelling..."
                                  : "Confirm Cancellation"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;