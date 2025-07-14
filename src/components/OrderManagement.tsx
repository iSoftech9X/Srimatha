import React, { useState, useEffect } from 'react';
import { Search, Eye, Clock, CheckCircle, XCircle, Truck, Filter, Download, RefreshCw, Phone, Mail, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import toast from 'react-hot-toast';


const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [realTimeOrders, setRealTimeOrders] = useState<any[]>([]);
  const [realTimeQuotes, setRealTimeQuotes] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Set up real-time connection for catering orders
  useEffect(() => {
    
    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`http://localhost:5000/api/orders?token=${token}`);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('Real-time catering updates connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_catering_order') {
          setRealTimeOrders(prev => [data.order, ...prev]);
          toast.success(`New catering order received: ${data.order.id}`);
        } else if (data.type === 'catering_order_updated') {
          setRealTimeOrders(prev => 
            prev.map(order => 
              order.id === data.order.id ? data.order : order
            )
          );
          toast.success(`Catering order ${data.order.id} updated`);
        } else if (data.type === 'new_quote_request') {
          setRealTimeQuotes(prev => [data.quote, ...prev]);
          toast.success(`New quote request received: ${data.quote.id}`);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  // Combine regular orders with real-time catering orders
  const allOrders = [...orders, ...realTimeOrders];

  const filteredOrders = allOrders.filter(order => {
    if (!order || typeof order.id !== 'string') {
      return false;
    }
    const matchesSearch = (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (order.customerPhone || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.orderType === typeFilter;
    
    // Date filtering logic
    const orderDate = new Date(order.orderDate || order.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    let matchesDate = true;
    switch (dateFilter) {
      case 'today':
        matchesDate = orderDate.toDateString() === today.toDateString();
        break;
      case 'yesterday':
        matchesDate = orderDate.toDateString() === yesterday.toDateString();
        break;
      case 'week':
        matchesDate = orderDate >= weekAgo;
        break;
      case 'all':
        matchesDate = true;
        break;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getStatusColor = (status: Order['status']) => {
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

  const getStatusIcon = (status: Order['status']) => {
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

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Check if it's a catering order
      if (orderId.startsWith('CATERING-')) {
        const response = await fetch(`/api/catering/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
          toast.success(`Catering order status updated to ${newStatus}`);
        } else {
          throw new Error('Failed to update catering order status');
        }
      } else {
        // Regular order
        updateOrderStatus(orderId, newStatus);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getOrderStats = () => {
    const total = filteredOrders.length;
    const pending = filteredOrders.filter(o => o.status === 'pending').length;
    const preparing = filteredOrders.filter(o => o.status === 'preparing').length;
    const ready = filteredOrders.filter(o => o.status === 'ready').length;
    const delivered = filteredOrders.filter(o => o.status === 'delivered').length;
    const catering = filteredOrders.filter(o => o.orderType === 'catering').length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const quotes = realTimeQuotes.length;
    
    return { total, pending, preparing, ready, delivered, catering, totalRevenue, quotes };
  };

  const stats = getOrderStats();

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Phone', 'Type', 'Status', 'Amount', 'Date'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.customerName,
        order.customerPhone,
        order.orderType,
        order.status,
        order.totalAmount,
        new Date(order.orderDate || order.createdAt).toLocaleDateString()
      ].join(','))
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-gray-600">Track and manage customer orders</p>
            <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isConnected ? 'Real-time Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
          >
            <Filter size={20} />
            Filters
          </button>
          <button
            onClick={exportOrders}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
          >
            <Download size={20} />
            Export
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-300"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-orange-600">{stats.preparing}</div>
          <div className="text-sm text-gray-600">Preparing</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
          <div className="text-sm text-gray-600">Ready</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-blue-600">{stats.delivered}</div>
          <div className="text-sm text-gray-600">Delivered</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-purple-600">{stats.catering}</div>
          <div className="text-sm text-gray-600">Catering</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-pink-600">{stats.quotes}</div>
          <div className="text-sm text-gray-600">Quotes</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-indigo-600">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Quote Requests Section */}
      {realTimeQuotes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Quote Requests</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {realTimeQuotes.slice(0, 6).map((quote) => (
              <div key={quote.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{quote.id}</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                    Quote Request
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Event:</strong> {quote.eventType}</p>
                  <p><strong>Guests:</strong> {quote.guestCount}</p>
                  <p><strong>Date:</strong> {new Date(quote.eventDate).toLocaleDateString()}</p>
                  <p><strong>Contact:</strong> {quote.contactName}</p>
                  <p><strong>Phone:</strong> {quote.contactPhone}</p>
                  <p><strong>Estimated Cost:</strong> ₹{quote.estimatedCost?.toLocaleString()}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-xs font-medium transition-colors duration-200">
                    Send Quote
                  </button>
                  <button className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-3 rounded text-xs font-medium transition-colors duration-200">
                    Call Customer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items & Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`hover:bg-gray-50 transition-colors duration-200 ${
                  order.orderType === 'catering' ? 'bg-green-50' : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {order.id}
                        {order.orderType === 'catering' && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            CATERING
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(order.orderDate || order.createdAt) ? new Date((order.orderDate || order.createdAt) as string).toLocaleString() : 'N/A'}
                      </div>
                      {order.orderType === 'catering' && order.eventDetails && (
                        <div className="text-xs text-green-600 mt-1">
                          Event: {order.eventDetails.eventType} | {order.eventDetails.guestCount} guests
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Phone size={12} />
                        {order.customerPhone}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <Mail size={12} />
                        {order.customerEmail}
                      </div>
                      {order.orderType === 'catering' && order.eventDetails?.eventDate && (
                        <div className="text-sm text-green-600 flex items-center gap-2 mt-1">
                          <Calendar size={12} />
                          {order.eventDetails.eventDate}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 1} item{(order.items?.length || 1) > 1 ? 's' : ''}
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending Payment'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                      <div className={`text-xs capitalize ${
                        order.orderType === 'catering' ? 'text-green-600 font-semibold' : 'text-gray-500'
                      }`}>
                        {order.orderType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full z-10">
            <div className="p-6">
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
                <div>
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="text-gray-800 font-semibold"> {selectedOrder.id}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Customer:</span>
                  <span className="text-gray-800 font-semibold"> {selectedOrder.customerName}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone:</span>
                  <span className="text-gray-800 font-semibold"> {selectedOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <span className="text-gray-800 font-semibold"> {selectedOrder.customerEmail}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Order Date:</span>
                  <span className="text-gray-800 font-semibold"> {new Date(selectedOrder.orderDate || selectedOrder.createdAt).toLocaleString()}</span>
                </div>
                {selectedOrder.orderType === 'catering' && selectedOrder.eventDetails && (
                  <div>
                    <span className="text-sm text-gray-500">Event Details:</span>
                    <div className="text-gray-800 font-semibold text-sm mt-1">
                      <p><strong>Type:</strong> {selectedOrder.eventDetails.eventType}</p>
                      <p><strong>Guests:</strong> {selectedOrder.eventDetails.guestCount}</p>
                      <p><strong>Date:</strong> {new Date(selectedOrder.eventDetails.eventDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1 capitalize">{selectedOrder.status}</span>
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Items:</span>
                  <div className="mt-1">
                    {selectedOrder.items?.map(item => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-700 py-1">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between text-sm font-semibold text-gray-800">
                    <span>Total Amount:</span>
                    <span>₹{selectedOrder.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Payment Status:</span>
                    <span>{selectedOrder.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending Payment'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
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
