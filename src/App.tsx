
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Admin protected route component
// const AdminRoute = ({ children }) => {
//   const { user, isAdmin } = useAuth();
//   if (!user || !isAdmin) {
//     return <Navigate to="/admin" replace />;
//   }
//   return children;
// };

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // If you have a loading state, use it here. Otherwise, remove the loading check.
  // if (!user || user.role !== 'admin') {
  //   return <Navigate to="/admin" />;
  // }
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catering" element={<CateringOrdering />} />
        <Route path="/order" element={<UserOrdering />} />
        <Route path="/admin" element={<AdminLogin />} />
        {/* <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } /> */}
        {/* <Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <AdminDashboard />
  </ProtectedRoute>
} /> */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
