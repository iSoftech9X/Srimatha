// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { authAPI } from '../services/api';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role:  'customer' | 'guest'; 
//   token?: string;
//   phone?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
//   register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   // isAdmin: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
// // const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     // Check for stored user data on mount
    
//     const storedUser = localStorage.getItem('srimatha_user');
//     const storedToken = localStorage.getItem('token');
//       console.log('AuthProvider init:', storedUser, storedToken);
//     if (storedUser && storedToken) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (error) {
//         localStorage.removeItem('srimatha_user');
//         localStorage.removeItem('token');
//       }
//     }
//     // setLoading(false);
//   }, []);

  

//   const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
//   try {
//     const response = await authAPI.login({ email, password });
    
//     console.log('Login response:', response);

//     if (response.data && response.data.success && response.data.data) {
//       let { user, token } = response.data.data;
//       // Normalize user object to always have 'id'
//       user = {
//         ...user,
//         id: user.id || user._id || user.user_id,
//       };
//       console.log('Login successful:', user);
//       setUser(user);
//       localStorage.setItem('srimatha_user', JSON.stringify(user));
//       localStorage.setItem('token', token);
//       return { success: true, user };
//     } else {
//       return { success: false, error: response.data?.message || 'Login failed' };
//     }
//   } catch (error: any) {
//     return { success: false, error: error.response?.data?.message || 'Login failed' };
//   }
// };

// const register = async (userData: any): Promise<{ success: boolean; user?: User; error?: string }> => {
//   try {
//     const response = await authAPI.register(userData);
//     if (response.data && response.data.success && response.data.data) {
//       let { user, token } = response.data.data;
//       // Normalize user object to always have 'id'
//       user = {
//         ...user,
//         id: user.id || user._id || user.user_id,
//       };
//       setUser(user);
//       localStorage.setItem('srimatha_user', JSON.stringify(user));
//       localStorage.setItem('token', token);
//       return { success: true, user };
//     } else {
//       return { success: false, error: response.data?.message || 'Registration failed' };
//     }
//   } catch (error: any) {
//     return { success: false, error: error.response?.data?.message || 'Registration failed' };
//   }
// };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('srimatha_user');
//     localStorage.removeItem('token');
//   };

//   const value: AuthContextType = {
//     user,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//     // isAdmin: user?.role === 'admin',
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'guest'; 
  token?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  // Password reset methods
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; userId?: string; email?: string; error?: string }>;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('srimatha_user');
    const storedToken = localStorage.getItem('token');
    console.log('AuthProvider init:', storedUser, storedToken);
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('srimatha_user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await authAPI.login({ email, password });
      console.log('Login response:', response);

      if (response.data && response.data.success && response.data.data) {
        let { user, token } = response.data.data;
        user = {
          ...user,
          id: user.id || user._id || user.user_id,
        };
        console.log('Login successful:', user);
        setUser(user);
        localStorage.setItem('srimatha_user', JSON.stringify(user));
        localStorage.setItem('token', token);
        return { success: true, user };
      } else {
        return { success: false, error: response.data?.message || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await authAPI.register(userData);
      if (response.data && response.data.success && response.data.data) {
        let { user, token } = response.data.data;
        user = {
          ...user,
          id: user.id || user._id || user.user_id,
        };
        setUser(user);
        localStorage.setItem('srimatha_user', JSON.stringify(user));
        localStorage.setItem('token', token);
        return { success: true, user };
      } else {
        return { success: false, error: response.data?.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('srimatha_user');
    localStorage.removeItem('token');
  };

  // Password reset methods
  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await authAPI.forgotPassword(email);
      if (response.data && response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data?.message || 'Failed to send OTP' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Failed to send OTP' };
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<{ success: boolean; userId?: string; email?: string; error?: string }> => {
    try {
      const response = await authAPI.verifyOtp(email, otp);
      if (response.data && response.data.success) {
        return { 
          success: true, 
          userId: response.data.data?.userId, 
          email: response.data.data?.email 
        };
      }
      return { success: false, error: response.data?.message || 'Invalid OTP' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Invalid OTP' };
    }
  };

  const resetPassword = async (email: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await authAPI.resetPassword(email, newPassword);
      if (response.data && response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, error: response.data?.message || 'Password reset failed' };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || 'Password reset failed' };
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    // Add password reset methods
    forgotPassword,
    verifyOtp,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};