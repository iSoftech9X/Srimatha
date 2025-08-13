
import React, { useState } from 'react';
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(credentials.email, credentials.password);
      console.log('Login result:', result);
      if (result.success && result.user?.token) {
        localStorage.setItem('token', result.user.token); 
      }
      if (result.success && result.user?.role === 'admin') {
        navigate('/admin/dashboard');  
      } else if (result.success && result.user?.role === 'customer') {
        setError('Access denied. Admin privileges required.');
      } else {
        setError(result.error || 'Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setCredentials({
      email: 'admin@srimatha.com',
      password: 'admin123'
    });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl w-full max-w-md mx-2 sm:mx-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Lock className="text-white" size={30} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Admin Portal</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Access the restaurant management dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm sm:text-base text-gray-700 font-medium mb-1 sm:mb-2">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter admin email"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base text-gray-700 font-medium mb-1 sm:mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-sm sm:text-base text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg flex items-start sm:items-center">
              <AlertCircle size={16} className="mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 sm:py-3 rounded-lg font-medium sm:font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 disabled:scale-100 active:scale-95"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Access Admin Dashboard'
            )}
          </button>
        </form>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600 text-center mb-2 sm:mb-3">
            <strong>Demo Admin Credentials:</strong>
          </p>
          <div className="text-xs text-gray-500 text-center space-y-1 mb-2 sm:mb-3">
            <p>Email: admin@srimatha.com</p>
            <p>Password: admin123</p>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 active:bg-gray-400"
          >
            Use Demo Credentials
          </button>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-orange-600 hover:text-orange-700 font-medium text-xs sm:text-sm transition-colors duration-200"
          >
            ← Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;