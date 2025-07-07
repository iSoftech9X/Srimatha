import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
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
        console.log('Restored user session:', parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('srimatha_user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      console.log('Login attempt:', { email, password });
      
      // Demo credentials - exact match required
      const adminCredentials = { 
        email: 'admin@srimatha.com', 
        password: 'admin123' 
      };
      const demoUserCredentials = { 
        email: 'user@example.com', 
        password: 'user123' 
      };

      // Trim whitespace and convert to lowercase for email comparison
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      console.log('Checking credentials:', { trimmedEmail, trimmedPassword });

      if (trimmedEmail === adminCredentials.email.toLowerCase() && trimmedPassword === adminCredentials.password) {
        const adminUser: User = {
          id: 'admin_1',
          name: 'Srimatha Admin',
          email: adminCredentials.email,
          role: 'admin',
          phone: '+91 98765 43210'
        };
        
        setUser(adminUser);
        localStorage.setItem('srimatha_user', JSON.stringify(adminUser));
        localStorage.setItem('token', 'demo_admin_token_' + Date.now());
        
        console.log('Admin login successful:', adminUser);
        return { success: true, user: adminUser };
      } 
      else if (trimmedEmail === demoUserCredentials.email.toLowerCase() && trimmedPassword === demoUserCredentials.password) {
        const regularUser: User = {
          id: 'user_1',
          name: 'Demo User',
          email: demoUserCredentials.email,
          role: 'customer',
          phone: '+91 87654 32109'
        };
        
        setUser(regularUser);
        localStorage.setItem('srimatha_user', JSON.stringify(regularUser));
        localStorage.setItem('token', 'demo_user_token_' + Date.now());
        
        console.log('User login successful:', regularUser);
        return { success: true, user: regularUser };
      } 
      else {
        console.log('Invalid credentials provided');
        return { 
          success: false, 
          error: 'Invalid email or password. Please check your credentials.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (userData: any): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      console.log('Registration attempt:', userData);
      
      // Check if user already exists (simple check for demo)
      const existingUser = localStorage.getItem('srimatha_user');
      if (existingUser) {
        const parsed = JSON.parse(existingUser);
        if (parsed.email.toLowerCase() === userData.email.trim().toLowerCase()) {
          return { 
            success: false, 
            error: 'User with this email already exists.' 
          };
        }
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        role: 'customer',
        phone: userData.phone?.trim()
      };
      
      setUser(newUser);
      localStorage.setItem('srimatha_user', JSON.stringify(newUser));
      localStorage.setItem('token', 'demo_token_' + Date.now());
      
      console.log('Registration successful:', newUser);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    console.log('Logging out user:', user);
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
    isAdmin: user?.role === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};