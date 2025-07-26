import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    
    alert("You need to log in to access this page!");
    return <Navigate to="/login" state={{ from: useLocation() }} replace />;
  }

  return children;
};

export default ProtectedRoute;
