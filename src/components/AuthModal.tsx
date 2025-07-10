import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If just logged in and user is admin, redirect to /admin
    if (!loading && !error && mode === 'login') {
      const storedUser = localStorage.getItem('srimatha_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.role === 'admin') {
            navigate('/admin');
          }
        } catch {}
      }
    }
    // eslint-disable-next-line
  }, [loading, error, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        console.log('Attempting login with:', { email: formData.email, password: formData.password });
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          toast.success(`Welcome back, ${result.user?.name}!`);
          onClose();
          // Reset form
          setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            address: { street: '', city: '', state: '', zipCode: '' }
          });
        } else {
          setError(result.error || 'Login failed');
          toast.error(result.error || 'Login failed');
        }
      } else {
        console.log('Attempting registration with:', formData);
        const result = await register(formData);
        
        if (result.success) {
          toast.success(`Welcome to Srimatha, ${result.user?.name}!`);
          onClose();
          // Reset form
          setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            address: { street: '', city: '', state: '', zipCode: '' }
          });
        } else {
          setError(result.error || 'Registration failed');
          toast.error(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: { street: '', city: '', state: '', zipCode: '' }
    });
  };

  const fillDemoCredentials = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setFormData(prev => ({
        ...prev,
        email: 'admin@srimatha.com',
        password: 'admin123'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        email: 'user@example.com',
        password: 'user123'
      }));
    }
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="+91 98765 43210"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Street address"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="City"
                        required
                        disabled={loading}
                      />
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="State"
                        required
                        disabled={loading}
                      />
                    </div>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="ZIP Code"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                mode === 'login' ? 'Login' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={switchMode}
                className="text-orange-600 hover:text-orange-700 font-semibold"
                disabled={loading}
              >
                {mode === 'login' ? 'Sign up' : 'Login'}
              </button>
            </p>
          </div>

          {mode === 'login' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center mb-3">
                <strong>Demo Credentials:</strong>
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  disabled={loading}
                >
                  Use Admin Login (admin@srimatha.com)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('user')}
                  className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  disabled={loading}
                >
                  Use Customer Login (user@example.com)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create a global auth modal component
const GlobalAuthModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Expose functions globally
  React.useEffect(() => {
    (window as any).openAuthModal = (initialMode: 'login' | 'register' = 'login') => {
      setMode(initialMode);
      setIsOpen(true);
    };
  }, []);

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      initialMode={mode}
    />
  );
};

export default GlobalAuthModal;