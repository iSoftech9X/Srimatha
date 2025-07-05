import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  LogOut,
  BarChart3,
  Settings,
  Menu as MenuIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CustomerManagement from './CustomerManagement';
import OrderManagement from './OrderManagement';
import MenuManagement from './MenuManagement';

const AdminDashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalCustomers: 150,
    totalOrders: 1250,
    totalRevenue: 125000,
    todayOrders: 45,
    pendingOrders: 12,
    popularItems: [
      {
        id: '1',
        name: 'Butter Chicken',
        price: 650,
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      },
      {
        id: '2',
        name: 'Paneer Tikka',
        price: 420,
        image: 'https://images.pexels.com/photos/5864474/pexels-photo-5864474.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      },
      {
        id: '3',
        name: 'Biryani',
        price: 480,
        image: 'https://images.pexels.com/photos/15953175/pexels-photo-15953175.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      }
    ]
  });

  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!user) {
      navigate('/admin');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [user, isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">↗ {trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'menu', name: 'Menu', icon: MenuIcon },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  // Don't render if not admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } md:w-64 relative`}>
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
              <h2 className="text-lg font-bold text-gray-800">Srimatha Admin</h2>
              <p className="text-sm text-gray-600">Welcome, {user.name}</p>
            </div>
          </div>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-orange-50 transition-colors duration-200 ${
                activeTab === item.id ? 'bg-orange-100 border-r-4 border-orange-600 text-orange-600' : 'text-gray-700'
              }`}
            >
              <item.icon size={20} />
              <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-600 hover:text-gray-800 mr-4"
              >
                <MenuIcon size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {sidebarItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Customers"
                  value={dashboardStats.totalCustomers.toLocaleString()}
                  icon={<Users className="text-blue-600" size={24} />}
                  color="bg-blue-100"
                  trend="+12%"
                />
                <StatCard
                  title="Total Orders"
                  value={dashboardStats.totalOrders.toLocaleString()}
                  icon={<ShoppingBag className="text-green-600" size={24} />}
                  color="bg-green-100"
                  trend="+8%"
                />
                <StatCard
                  title="Total Revenue"
                  value={`₹${dashboardStats.totalRevenue.toLocaleString()}`}
                  icon={<DollarSign className="text-yellow-600" size={24} />}
                  color="bg-yellow-100"
                  trend="+15%"
                />
                <StatCard
                  title="Today's Orders"
                  value={dashboardStats.todayOrders}
                  icon={<TrendingUp className="text-purple-600" size={24} />}
                  color="bg-purple-100"
                  trend="+5%"
                />
              </div>

              {/* Charts and Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Popular Items */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Items</h3>
                  <div className="space-y-4">
                    {dashboardStats.popularItems.map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-orange-600 font-semibold text-sm">#{index + 1}</span>
                          </div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">₹{item.price}</p>
                          </div>
                        </div>
                        <span className="text-green-600 font-semibold">Popular</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="text-orange-600 mr-3" size={20} />
                        <span className="text-gray-700 font-medium">Pending Orders</span>
                      </div>
                      <span className="font-bold text-orange-600 text-xl">
                        {dashboardStats.pendingOrders}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="text-blue-600 mr-3" size={20} />
                        <span className="text-gray-700 font-medium">Active Customers</span>
                      </div>
                      <span className="font-bold text-blue-600 text-xl">
                        {Math.floor(dashboardStats.totalCustomers * 0.85)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="text-green-600 mr-3" size={20} />
                        <span className="text-gray-700 font-medium">Monthly Growth</span>
                      </div>
                      <span className="font-bold text-green-600 text-xl">+12%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Order ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Customer</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Amount</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { id: 'ORD001', customer: 'John Doe', amount: 850, status: 'preparing', time: '10 mins ago' },
                        { id: 'ORD002', customer: 'Jane Smith', amount: 650, status: 'ready', time: '15 mins ago' },
                        { id: 'ORD003', customer: 'Mike Johnson', amount: 1200, status: 'delivered', time: '25 mins ago' },
                        { id: 'ORD004', customer: 'Sarah Wilson', amount: 450, status: 'pending', time: '30 mins ago' },
                      ].map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{order.customer}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">₹{order.amount}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'preparing' ? 'bg-orange-100 text-orange-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{order.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'menu' && <MenuManagement />}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Restaurant Settings</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Restaurant Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                      <input 
                        type="text" 
                        defaultValue="Srimatha Restaurant"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        defaultValue="+91 98765 43210"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        defaultValue="info@srimatha.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Operating Hours</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Monday - Thursday</span>
                      <span className="text-sm font-medium">11:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Friday - Saturday</span>
                      <span className="text-sm font-medium">11:00 AM - 11:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Sunday</span>
                      <span className="text-sm font-medium">12:00 PM - 10:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;