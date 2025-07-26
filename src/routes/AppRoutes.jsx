import { Routes, Route, Navigate } from "react-router-dom";
// Customer Authentication routes
import Login from "../pages/user-authentication-pages/Login";
import Register from "../pages/user-authentication-pages/Register";
import ResetPWCustomer from "../pages/user-authentication-pages/ResetPasswordCustomer";
// Admin Authentication routes
import AdminLogin from "../pages/user-authentication-pages/AdminLogin";
import AdminRegister from "../pages/user-authentication-pages/AdminRegister";
import ResetPWAdmin from "../pages/user-authentication-pages/ResetPasswordAdmin";

import Homepage from "../pages/car-browsing-pages/Homepage";
import Category from "../pages/car-browsing-pages/Category";
import Details from "../pages/car-browsing-pages/Details";
import MainLayout from "/src/MainLayout";
import Payment from "../pages/car-checkout-pages/payment-pages/Payment";
import Favorites from "../pages/car-browsing-pages/Favorites";

import AdminDashboard from "../pages/admin-dashboard-pages/AdminDashboard";
import OrderTracking from "../pages/order-tracking/Order Tracking";
import PaymentSuccess from "../pages/car-checkout-pages/payment-pages/PaymentSuccess";
import PaymentFailed from "../pages/car-checkout-pages/payment-pages/PaymentFailed";

import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {

  return (
    <MainLayout>
      <Routes>
        <Route path="/customers/login" element={<Login />} />
        <Route path="/customers/register" element={<Register />} />
        <Route path="/customers/reset-password" element={<ResetPWCustomer />} />

        <Route path="/admins/login" element={<AdminLogin />} />
        <Route path="/admins/register" element={<AdminRegister />} />
        <Route path="/admins/reset-password" element={<ResetPWAdmin />} />

        <Route path="/" element={<Homepage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/car/:id" element={<Details />} />
        
        <Route path="/checkout" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />    
      </Routes>
    </MainLayout>
  );
};

export default AppRoutes;
