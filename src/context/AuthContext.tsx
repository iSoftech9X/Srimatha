import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'guest';
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
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
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('srimatha_user');
    const storedToken = localStorage.getItem('token');
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

  
  // const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  //   try {
  //     const response = await authAPI.login({ email, password });
  //     if (response.data && response.data.success && response.data.data) {
  //       const { user, token } = response.data.data;
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
  //       const { user, token } = response.data.data;
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

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const response = await authAPI.login({ email, password });
    
    console.log('Login response:', response);

    if (response.data && response.data.success && response.data.data) {
      let { user, token } = response.data.data;
      // Normalize user object to always have 'id'
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
      // Normalize user object to always have 'id'
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

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};