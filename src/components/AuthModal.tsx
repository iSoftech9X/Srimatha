
// import React, { useState, useEffect } from 'react';
// import { X, User, Mail, Phone, MapPin, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   initialMode?: 'login' | 'register';
// }

// const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
//   const [mode, setMode] = useState<'login' | 'register'>(initialMode);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: ''
//     }
//   });
//   const [formErrors, setFormErrors] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: ''
//     }
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const { login, register } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !error && mode === 'login') {
//       const storedUser = localStorage.getItem('srimatha_user');
//       console.log('Checking stored user:', storedUser);
//       if (storedUser) {
//         try {
//           const user = JSON.parse(storedUser);
//           if (user.role === 'admin') {
//             navigate('/admin/dashboard');
//           }
//         } catch {}
//       }
//     }
//     // eslint-disable-next-line
//   }, [loading, error, mode]);

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = {
//       name: '',
//       email: '',
//       password: '',
//       phone: '',
//       address: {
//         street: '',
//         city: '',
//         state: '',
//         zipCode: ''
//       }
//     };

//     // Email validation - any valid email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//       isValid = false;
//     }

//     // Password validation - at least 6 characters
//     if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//       isValid = false;
//     }

//     if (mode === 'register') {
//       // Name validation
//       if (!formData.name.trim()) {
//         newErrors.name = 'Name is required';
//         isValid = false;
//       }

//       // Phone validation - only numbers
//       const phoneRegex = /^[0-9]+$/;
//       if (!phoneRegex.test(formData.phone)) {
//         newErrors.phone = 'Phone number must contain only digits';
//         isValid = false;
//       } else if (formData.phone.length < 10) {
//         newErrors.phone = 'Phone number must be at least 10 digits';
//         isValid = false;
//       }

//       // Address validations
//       // Street - no numbers allowed
//       const streetRegex = /^[a-zA-Z0-9\s\-,.,/']+$/;
//       if (!formData.address.street.trim()) {
//         newErrors.address.street = 'Street address is required';
//         isValid = false;
//       } else if (!streetRegex.test(formData.address.street)) {
//         newErrors.address.street = 'Street address contains invalid characters';
//         isValid = false;
//       }

//       if (!formData.address.city.trim()) {
//         newErrors.address.city = 'City is required';
//         isValid = false;
//       }

//       if (!formData.address.state.trim()) {
//         newErrors.address.state = 'State is required';
//         isValid = false;
//       }

//       // ZIP code validation - only numbers
//       const zipRegex = /^[0-9]+$/;
//       if (!zipRegex.test(formData.address.zipCode)) {
//         newErrors.address.zipCode = 'ZIP code must contain only numbers';
//         isValid = false;
//       } else if (formData.address.zipCode.length < 5) {
//         newErrors.address.zipCode = 'ZIP code must be at least 5 digits';
//         isValid = false;
//       }
//     }

//     setFormErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);

//     try {
//       if (mode === 'login') {
//         console.log('Attempting login with:', { email: formData.email, password: formData.password });
//         const result = await login(formData.email, formData.password);
        
//         if (result.success) {
//           toast.success(`Welcome back, ${result.user?.name}!`);
//           onClose();
//           setFormData({
//             name: '',
//             email: '',
//             password: '',
//             phone: '',
//             address: { street: '', city: '', state: '', zipCode: '' }
//           });
//         } else {
//           setError(result.error || 'Login failed');
//           toast.error(result.error || 'Login failed');
//         }
//       } else {
//         console.log('Attempting registration with:', formData);
//         const result = await register(formData);
        
//         if (result.success) {
//           toast.success(`Welcome to Srimatha, ${result.user?.name}!`);
//           onClose();
//           setFormData({
//             name: '',
//             email: '',
//             password: '',
//             phone: '',
//             address: { street: '', city: '', state: '', zipCode: '' }
//           });
//         } else {
//           setError(result.error || 'Registration failed');
//           toast.error(result.error || 'Registration failed');
//         }
//       }
//     } catch (error) {
//       console.error('Auth error:', error);
//       const errorMessage = 'An unexpected error occurred. Please try again.';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
    
//     // Clear error when user starts typing
//     if (name.startsWith('address.')) {
//       const addressField = name.split('.')[1];
//       setFormErrors(prev => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           [addressField]: ''
//         }
//       }));
//       setFormData(prev => ({
//         ...prev,
//         address: {
//           ...prev.address,
//           [addressField]: value
//         }
//       }));
//     } else {
//       setFormErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   const switchMode = () => {
//     setMode(mode === 'login' ? 'register' : 'login');
//     setError('');
//     setFormErrors({
//       name: '',
//       email: '',
//       password: '',
//       phone: '',
//       address: { street: '', city: '', state: '', zipCode: '' }
//     });
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//       phone: '',
//       address: { street: '', city: '', state: '', zipCode: '' }
//     });
//   };

//   const fillDemoCredentials = (type: 'admin' | 'user') => {
//     if (type === 'admin') {
//       setFormData(prev => ({
//         ...prev,
//         email: 'admin@srimatha.com',
//         password: 'admin123'
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         email: 'user@example.com',
//         password: 'user123'
//       }));
//     }
//     setError('');
//     setFormErrors({
//       name: '',
//       email: '',
//       password: '',
//       phone: '',
//       address: { street: '', city: '', state: '', zipCode: '' }
//     });
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">
//               {mode === 'login' ? 'Login' : 'Create Account'}
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
//               <AlertCircle size={20} className="mr-2 flex-shrink-0" />
//               <span className="text-sm">{error}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {mode === 'register' && (
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">Full Name</label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-3 text-gray-400" size={20} />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className={`w-full pl-10 pr-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
//                     placeholder="Enter your full name"
//                     disabled={loading}
//                   />
//                 </div>
//                 {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
//               </div>
//             )}

//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Email Address</label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
//                   placeholder="Enter your email"
//                   disabled={loading}
//                 />
//               </div>
//               {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-2">Password</label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   className={`w-full pl-10 pr-12 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
//                   placeholder="Enter your password"
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//                   disabled={loading}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
//               {mode === 'register' && (
//                 <p className="text-gray-500 text-xs mt-1">
//                   Password must be at least 6 characters long.
//                 </p>
//               )}
//             </div>

//             {mode === 'register' && (
//               <>
//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
//                     <input
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleInputChange}
//                       className={`w-full pl-10 pr-4 py-3 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
//                       placeholder="9876543210"
//                       disabled={loading}
//                     />
//                   </div>
//                   {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-gray-700 font-medium mb-2">Address</label>
//                   <div className="space-y-3">
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
//                       <input
//                         type="text"
//                         name="address.street"
//                         value={formData.address.street}
//                         onChange={handleInputChange}
//                         className={`w-full pl-10 pr-4 py-3 border ${formErrors.address.street ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
//                         placeholder="Street address "
//                         disabled={loading}
//                       />
//                     </div>
//                     {formErrors.address.street && <p className="text-red-500 text-sm -mt-2">{formErrors.address.street}</p>}
                    
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <input
//                           type="text"
//                           name="address.city"
//                           value={formData.address.city}
//                           onChange={handleInputChange}
//                           className={`w-full px-4 py-3 border ${formErrors.address.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
//                           placeholder="City"
//                           disabled={loading}
//                         />
//                         {formErrors.address.city && <p className="text-red-500 text-sm mt-1">{formErrors.address.city}</p>}
//                       </div>
//                       <div>
//                         <input
//                           type="text"
//                           name="address.state"
//                           value={formData.address.state}
//                           onChange={handleInputChange}
//                           className={`w-full px-4 py-3 border ${formErrors.address.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
//                           placeholder="State"
//                           disabled={loading}
//                         />
//                         {formErrors.address.state && <p className="text-red-500 text-sm mt-1">{formErrors.address.state}</p>}
//                       </div>
//                     </div>
                    
//                     <div>
//                       <input
//                         type="text"
//                         name="address.zipCode"
//                         value={formData.address.zipCode}
//                         onChange={handleInputChange}
//                         className={`w-full px-4 py-3 border ${formErrors.address.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
//                         placeholder="ZIP Code (numbers only)"
//                         disabled={loading}
//                       />
//                       {formErrors.address.zipCode && <p className="text-red-500 text-sm mt-1">{formErrors.address.zipCode}</p>}
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
//                 </div>
//               ) : (
//                 mode === 'login' ? 'Login' : 'Create Account'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
//               <button
//                 onClick={switchMode}
//                 className="text-orange-600 hover:text-orange-700 font-semibold"
//                 disabled={loading}
//               >
//                 {mode === 'login' ? 'Sign up' : 'Login'}
//               </button>
//             </p>
//           </div>

//           {mode === 'login' && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <p className="text-sm text-gray-600 text-center mb-3">
//                 <strong>Demo Credentials:</strong>
//               </p>
//               <div className="space-y-2">
//                 <button
//                   type="button"
//                   onClick={() => fillDemoCredentials('admin')}
//                   className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
//                   disabled={loading}
//                 >
//                   Use Admin Login (admin@srimatha.com)
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => fillDemoCredentials('user')}
//                   className="w-full bg-green-100 hover:bg-green-200 text-green-800 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
//                   disabled={loading}
//                 >
//                   Use Customer Login (user@example.com)
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const GlobalAuthModal: React.FC = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [mode, setMode] = useState<'login' | 'register'>('login');

//   React.useEffect(() => {
//     (window as any).openAuthModal = (initialMode: 'login' | 'register' = 'login') => {
//       setMode(initialMode);
//       setIsOpen(true);
//     };
//   }, []);

//   return (
//     <AuthModal
//       isOpen={isOpen}
//       onClose={() => setIsOpen(false)}
//       initialMode={mode}
//     />
//   );
// };

// export default GlobalAuthModal;
import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Lock, AlertCircle, Eye, EyeOff, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, forgotPassword, verifyOtp, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !error && mode === 'login') {
      const storedUser = localStorage.getItem('srimatha_user');
      console.log('Checking stored user:', storedUser);
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.role === 'admin') {
            navigate('/admin/dashboard');
          }
        } catch {}
      }
    }
  }, [loading, error, mode, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      phone: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (mode !== 'verify-otp' && mode !== 'reset-password' && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if ((mode === 'login' || mode === 'register') && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (mode === 'register') {
      // Name validation
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      }

      // Phone validation
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Phone number must contain only digits';
        isValid = false;
      } else if (formData.phone.length < 10) {
        newErrors.phone = 'Phone number must be at least 10 digits';
        isValid = false;
      }

      // Address validations
      const streetRegex = /^[a-zA-Z0-9\s\-,.,/']+$/;
      if (!formData.address.street.trim()) {
        newErrors.address.street = 'Street address is required';
        isValid = false;
      } else if (!streetRegex.test(formData.address.street)) {
        newErrors.address.street = 'Street address contains invalid characters';
        isValid = false;
      }

      if (!formData.address.city.trim()) {
        newErrors.address.city = 'City is required';
        isValid = false;
      }

      if (!formData.address.state.trim()) {
        newErrors.address.state = 'State is required';
        isValid = false;
      }

      const zipRegex = /^[0-9]+$/;
      if (!zipRegex.test(formData.address.zipCode)) {
        newErrors.address.zipCode = 'ZIP code must contain only numbers';
        isValid = false;
      } else if (formData.address.zipCode.length < 5) {
        newErrors.address.zipCode = 'ZIP code must be at least 5 digits';
        isValid = false;
      }
    }

    // OTP validation
    if (mode === 'verify-otp' && !formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
      isValid = false;
    }

    // New password validation
    if (mode === 'reset-password') {
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
        isValid = false;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success(`Welcome back, ${result.user?.name}!`);
          onClose();
          resetForm();
        } else {
          setError(result.error || 'Login failed');
          toast.error(result.error || 'Login failed');
        }
      } else if (mode === 'register') {
        const result = await register(formData);
        if (result.success) {
          toast.success(`Welcome to Srimatha, ${result.user?.name}!`);
          onClose();
          resetForm();
        } else {
          setError(result.error || 'Registration failed');
          toast.error(result.error || 'Registration failed');
        }
      } else if (mode === 'forgot') {
        const result = await forgotPassword(formData.email);
        if (result.success) {
          toast.success('OTP sent to your email');
          setMode('verify-otp');
        } else {
          setError(result.error || 'Failed to send OTP');
          toast.error(result.error || 'Failed to send OTP');
        }
      } else if (mode === 'verify-otp') {
        const result = await verifyOtp(formData.email, formData.otp);
        if (result.success) {
          toast.success('OTP verified successfully');
          setMode('reset-password');
        } else {
          setError(result.error || 'Invalid OTP');
          toast.error(result.error || 'Invalid OTP');
        }
      } else if (mode === 'reset-password') {
        const result = await resetPassword(formData.email, formData.newPassword);
        if (result.success) {
          toast.success('Password reset successfully');
          setMode('login');
          resetForm();
        } else {
          setError(result.error || 'Password reset failed');
          toast.error(result.error || 'Password reset failed');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
      address: { street: '', city: '', state: '', zipCode: '' }
    });
    setFormErrors({
      name: '',
      email: '',
      password: '',
      phone: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
      address: { street: '', city: '', state: '', zipCode: '' }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormErrors(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: ''
        }
      }));
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password') => {
    setMode(newMode);
    setError('');
    setFormErrors({
      name: '',
      email: '',
      password: '',
      phone: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
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
    setFormErrors({
      name: '',
      email: '',
      password: '',
      phone: '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
      address: { street: '', city: '', state: '', zipCode: '' }
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  if (!isOpen) return null;

  const renderHeader = () => {
    switch (mode) {
      case 'login': return 'Login';
      case 'register': return 'Create Account';
      case 'forgot': return 'Forgot Password';
      case 'verify-otp': return 'Verify OTP';
      case 'reset-password': return 'Reset Password';
      default: return 'Login';
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div>
          </>
        );

      case 'register':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>
              {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
              <p className="text-gray-500 text-xs mt-1">
                Password must be at least 6 characters long.
              </p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="9876543210"
                  disabled={loading}
                />
              </div>
              {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
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
                    className={`w-full pl-10 pr-4 py-3 border ${formErrors.address.street ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="Street address"
                    disabled={loading}
                  />
                </div>
                {formErrors.address.street && <p className="text-red-500 text-sm -mt-2">{formErrors.address.street}</p>}
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${formErrors.address.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="City"
                      disabled={loading}
                    />
                    {formErrors.address.city && <p className="text-red-500 text-sm mt-1">{formErrors.address.city}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border ${formErrors.address.state ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                      placeholder="State"
                      disabled={loading}
                    />
                    {formErrors.address.state && <p className="text-red-500 text-sm mt-1">{formErrors.address.state}</p>}
                  </div>
                </div>
                
                <div>
                  <input
                    type="text"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${formErrors.address.zipCode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    placeholder="ZIP Code (numbers only)"
                    disabled={loading}
                  />
                  {formErrors.address.zipCode && <p className="text-red-500 text-sm mt-1">{formErrors.address.zipCode}</p>}
                </div>
              </div>
            </div>
          </>
        );

      case 'forgot':
        return (
          <>
            <div className="mb-4 text-gray-600">
              Enter your email address and we'll send you an OTP to reset your password.
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
            </div>
          </>
        );

      case 'verify-otp':
        return (
          <>
            <div className="mb-4 text-gray-600">
              We've sent an OTP to your email. Please enter it below to verify.
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">OTP Code</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${formErrors.otp ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter 6-digit OTP"
                  disabled={loading}
                />
              </div>
              {formErrors.otp && <p className="text-red-500 text-sm mt-1">{formErrors.otp}</p>}
            </div>
          </>
        );

      case 'reset-password':
        return (
          <>
            <div className="mb-4 text-gray-600">
              Please enter your new password.
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border ${formErrors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={toggleNewPasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.newPassword && <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500`}
                  placeholder="Confirm new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (mode) {
      case 'login':
        return (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => switchMode('register')}
                className="text-orange-600 hover:text-orange-700 font-semibold"
                disabled={loading}
              >
                Sign up
              </button>
            </p>
          </div>
        );

      case 'register':
        return (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-orange-600 hover:text-orange-700 font-semibold"
                disabled={loading}
              >
                Login
              </button>
            </p>
          </div>
        );

      case 'forgot':
        return (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-orange-600 hover:text-orange-700 font-semibold"
                disabled={loading}
              >
                Login
              </button>
            </p>
          </div>
        );

      case 'verify-otp':
        return (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Didn't receive OTP?{' '}
              <button
                onClick={() => switchMode('forgot')}
                className="text-orange-600 hover:text-orange-700 font-semibold"
                disabled={loading}
              >
                Resend
              </button>
            </p>
          </div>
        );

      case 'reset-password':
        return (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-orange-600 hover:text-orange-700 font-semibold"
                disabled={loading}
              >
                Login
              </button>
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {renderHeader()}
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
            {renderForm()}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {mode === 'login' ? 'Signing In...' : 
                   mode === 'register' ? 'Creating Account...' : 
                   mode === 'forgot' ? 'Sending OTP...' : 
                   mode === 'verify-otp' ? 'Verifying...' : 
                   'Resetting Password...'}
                </div>
              ) : (
                mode === 'login' ? 'Login' : 
                mode === 'register' ? 'Create Account' : 
                mode === 'forgot' ? 'Send OTP' : 
                mode === 'verify-otp' ? 'Verify OTP' : 
                'Reset Password'
              )}
            </button>
          </form>

          {renderFooter()}

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

const GlobalAuthModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password'>('login');

  React.useEffect(() => {
    (window as any).openAuthModal = (initialMode: 'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password' = 'login') => {
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