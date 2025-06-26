import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo credentials - in production, this would connect to your backend
    const adminCredentials = { email: 'admin@srimatha.com', password: 'admin123' };
    const demoUser = { email: 'user@example.com', password: 'user123' };

    if (email === adminCredentials.email && password === adminCredentials.password) {
      const adminUser: User = {
        id: '1',
        name: 'Srimatha Admin',
        email: adminCredentials.email,
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('srimatha_user', JSON.stringify(adminUser));
      return true;
    } else if (email === demoUser.email && password === demoUser.password) {
      const regularUser: User = {
        id: '2',
        name: 'Demo User',
        email: demoUser.email,
        role: 'user'
      };
      setUser(regularUser);
      localStorage.setItem('srimatha_user', JSON.stringify(regularUser));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Demo registration - in production, this would connect to your backend
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user'
    };
    setUser(newUser);
    localStorage.setItem('srimatha_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('srimatha_user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};