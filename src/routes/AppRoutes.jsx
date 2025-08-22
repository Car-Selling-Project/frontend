import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// Admin Authentication routes
import AdminLogin from '../pages/admin-authentication/AdminLogin'
import AdminRegister from '../pages/admin-authentication/AdminRegister';
import ResetPasswordAdmin from '../pages/admin-authentication/ResetPasswordAdmin';
import ForgotPasswordAdmin from "../pages/admin-authentication/ForgotPasswordAdmin";
//Admin pages
import Dashboard from "../pages/admin-pages/Dashboard";
import ListCars from "../pages/admin-pages/ListCars";
import Orders from "../pages/admin-pages/Orders";
import ListTestDrive from "../pages/admin-pages/ListTestDrive";
//Layout and Protect Routes
import MainLayout from "/src/MainLayout";
// import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {

  return (
    <MainLayout>
      <Routes>
        {/* Admin Authentication routes */}
        <Route path="/admins/login" element={<AdminLogin />} />
        <Route path="/admins/register" element={<AdminRegister />} />
        <Route path="/admins/forgot-password" element={<ForgotPasswordAdmin />} />
        <Route path="/admins/reset-password" element={<ResetPasswordAdmin />} />
        {/* Admin routes */}
        <Route path="/admins/dashboard" element={<Dashboard />} />
        <Route path="/admins/cars" element={<ListCars />} />
        <Route path="/admins/orders" element={<Orders />} />
        <Route path="/admins/test-drives" element={<ListTestDrive />} />
      </Routes>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
    </MainLayout>
  );
};

export default AppRoutes;
