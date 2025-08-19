import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    
    alert("You need to log in to access this page!");
    return <Navigate to="/admins/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
