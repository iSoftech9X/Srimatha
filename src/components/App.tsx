import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Admin protected route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

export default AdminRoute;