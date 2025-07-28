import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CateringOrdering from './components/CateringOrdering';
import UserOrdering from './components/UserOrdering';
import AuthModal from './components/AuthModal';
import OrderConfirmation from './components/OrderConfirmation';
import CustomerManagement from './components/CustomerManagement';
import OrderManagement from './components/OrderManagement';
import MenuManagement from './components/MenuManagement';
import Contactquotes from './components/Contactquotes';
const HomePage: React.FC = () => (
  <div className="min-h-screen">
    <Header />
    <Hero />
    <About />
    <Services />
    <Menu />
    <Gallery />
    <Contact />
    <Footer />
  </div>
);

// Enhanced AdminRoute component with loading state
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    // Redirect to admin login with return location
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

// Route for admin login with redirect logic
const AdminLoginRoute = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user && isAdmin) {
    // Redirect to dashboard if already logged in
    const from = location.state?.from?.pathname || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  return <AdminLogin />;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catering" element={<CateringOrdering />} />
        <Route path="/order" element={<UserOrdering />} />
        <Route path="/admin" element={<AdminLoginRoute />} />
        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        {/* Add more admin routes as needed */}
        <Route path="/admin/customers" element={
          <AdminRoute>
            <CustomerManagement />
          </AdminRoute>
        } />
        <Route path="/admin/orders" element={
          <AdminRoute>
            <OrderManagement />
          </AdminRoute>
        } />
        <Route path="/admin/menu" element={
          <AdminRoute>
            <MenuManagement />
          </AdminRoute>
        } />
        <Route path="/admin/contact-quotes" element={
          <AdminRoute>
            <Contactquotes />
          </AdminRoute>
        } />
        <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 2000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;