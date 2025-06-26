import React, { useState } from 'react';
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
import { useApp } from '../context/AppContext';
import CustomerManagement from './CustomerManagement';
import OrderManagement from './OrderManagement';
import MenuManagement from './MenuManagement';

const AdminDashboard: React.FC = () => {
  const { adminStats, setIsAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      } md:w-64`}>
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div className={`ml-3 ${sidebarOpen ? 'block' : 'hidden'} md:block`}>
              <h2 className="text-lg font-bold text-gray-800">Srimath Admin</h2>
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
                className="md:hidden text-gray-600 hover:text-gray-800"
              >
                <MenuIcon size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800 ml-4 md:ml-0">
                {sidebarItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Customers"
                  value={adminStats.totalCustomers}
                  icon={<Users className="text-blue-600" size={24} />}
                  color="bg-blue-100"
                />
                <StatCard
                  title="Total Orders"
                  value={adminStats.totalOrders}
                  icon={<ShoppingBag className="text-green-600" size={24} />}
                  color="bg-green-100"
                />
                <StatCard
                  title="Total Revenue"
                  value={`₹${adminStats.totalRevenue.toLocaleString()}`}
                  icon={<DollarSign className="text-yellow-600" size={24} />}
                  color="bg-yellow-100"
                />
                <StatCard
                  title="Today's Orders"
                  value={adminStats.todayOrders}
                  icon={<TrendingUp className="text-purple-600" size={24} />}
                  color="bg-purple-100"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Items</h3>
                  <div className="space-y-3">
                    {adminStats.popularItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center">
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

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="text-orange-600 mr-2" size={20} />
                        <span className="text-gray-700">Pending Orders</span>
                      </div>
                      <span className="font-semibold text-orange-600">
                        {adminStats.pendingOrders}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="text-blue-600 mr-2" size={20} />
                        <span className="text-gray-700">Active Customers</span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {adminStats.totalCustomers}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && <CustomerManagement />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'menu' && <MenuManagement />}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;