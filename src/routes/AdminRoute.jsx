
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user?.role !== "admin") {
    return <Navigate to="/customers/login" />;
  }
  return children;
};

export default AdminRoute;
