
import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, BarChart3, LogOut } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import CustomerManagement from './CustomerManagement';
import OrderManagement from './OrderManagement';
import MenuManagement from './MenuManagement';
import Contactquotes from './Contactquotes';

const AdminDashboard: React.FC = () => {
  // Get token and user from localStorage
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('srimatha_user');
  let localUser = null;
  try {
    localUser = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    localUser = null;
  }

  // Redirect if not authenticated or not admin
  if (!token || !localUser || localUser.role !== 'admin') {
    return <Navigate to="/admin" />;
  }

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin stats state
  const [adminStats, setAdminStats] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');

  // Fetch admin stats directly from API
  useEffect(() => {
    setLoadingStats(true);
    axios.get('https://ggm4eesv2d.ap-south-1.awsapprunner.com/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        console.log('Admin stats response:', response.data);
        const overview = response.data.data?.overview || {};
        setAdminStats({
          totalCustomers: overview.totalCustomers || 0,
          totalOrders: overview.totalOrders || 0,
          totalRevenue: overview.totalRevenue || 0,
        });
        setLoadingStats(false);
      })
      .catch(error => {
        setStatsError('Failed to load admin stats');
        setLoadingStats(false);
      });
  }, [token]);

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'menu', name: 'Menu', icon: ShoppingBag },
    { id: 'contactquotes', name: 'Contact Quotes', icon: ShoppingBag }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('srimatha_user');
    navigate('/');
  };

  // StatCard component
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Fixed with non-scrolling logout button */}
      <div className={`bg-white shadow-lg fixed h-screen flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'} md:w-64 z-10`}>
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
              <h2 className="text-lg font-bold text-gray-800">Srimatha Admin</h2>
              <p className="text-sm text-gray-600">Welcome, {localUser.name}</p>
            </div>
          </div>
        </div>
        
        {/* Scrollable navigation area */}
        <nav className="mt-8 flex-1 overflow-y-auto">
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
        
        {/* Fixed logout button at bottom */}
        <div className="p-4 border-t border-gray-200">
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

      {/* Main Content - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col ml-16 md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-600 hover:text-gray-800 mr-4"
              >
                <BarChart3 size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {sidebarItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-IN', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </div>
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {localUser.name.charAt(0).toUpperCase()}
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
              {loadingStats ? (
                <div>Loading stats...</div>
              ) : statsError ? (
                <div className="text-red-600">{statsError}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Customers"
                    value={adminStats.totalCustomers?.toLocaleString?.() || adminStats.totalCustomers}
                    icon={<Users className="text-blue-600" size={24} />}
                    color="bg-blue-100"
                  />
                  <StatCard
                    title="Total Orders"
                    value={adminStats.totalOrders?.toLocaleString?.() || adminStats.totalOrders}
                    icon={<ShoppingBag className="text-green-600" size={24} />}
                    color="bg-green-100"
                  />
                  <StatCard
                    title="Total Revenue"
                    value={`₹${adminStats.totalRevenue?.toLocaleString?.() || adminStats.totalRevenue}`}
                    icon={<BarChart3 className="text-yellow-600" size={24} />}
                    color="bg-yellow-100"
                  />
                </div>
              )}
            </div>
          )}
          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'menu' && <MenuManagement />}
          {activeTab === 'contactquotes' && <Contactquotes />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;