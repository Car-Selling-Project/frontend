import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
// Customer Authentication routes
import Login from "../pages/user-authentication-pages/Login";
import Register from "../pages/user-authentication-pages/Register";
import ForgotPWCustomer from "../pages/user-authentication-pages/ForgotPasswordCustomer";
import ResetPWCustomer from "../pages/user-authentication-pages/ResetPasswordCustomer";

// Admin Authentication routes
import AdminLogin from "../pages/user-authentication-pages/AdminLogin";
import AdminRegister from "../pages/user-authentication-pages/AdminRegister";
import ForgotPWAdmin from "../pages/user-authentication-pages/ForgotPasswordAdmin";
import ResetPWAdmin from "../pages/user-authentication-pages/ResetPasswordAdmin";

//Car Browsing routes
import Homepage from "../pages/car-browsing-pages/Homepage";
import Category from "../pages/car-browsing-pages/Category";
import Details from "../pages/car-browsing-pages/Details";
import Comparison from "../pages/car-browsing-pages/Comparison";
import Favorites from "../pages/car-browsing-pages/Favorites";
import TestDrive from "../pages/car-checkout-pages/test-drive-page/TestDrive";

import Payment from "../pages/car-checkout-pages/payment-pages/Payment";
import CostEstimate from "../pages/car-checkout-pages/payment-pages/CostEstimate";
import OrderTracking from "../pages/order-tracking/Order Tracking";
import PaymentSuccess from "../pages/car-checkout-pages/payment-pages/PaymentSuccess";
import PaymentFailed from "../pages/car-checkout-pages/payment-pages/PaymentFailed";

//Admin pages
import Dashboard from "../pages/admin-pages/Dashboard";
import ListCars from "../pages/admin-pages/ListCars";
import Orders from "../pages/admin-pages/Orders";
import MainLayout from "/src/MainLayout";
import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {

  return (
    <MainLayout>
      <Routes>
        <Route path="/customers/login" element={<Login />} />
        <Route path="/customers/register" element={<Register />} />
        <Route path="/customers/forgot-password" element={<ForgotPWCustomer />} />
        <Route path="/customers/reset-password" element={<ResetPWCustomer />} />

        <Route path="/admins/login" element={<AdminLogin />} />
        <Route path="/admins/register" element={<AdminRegister />} />
        <Route path="/admins/forgot-password" element={<ForgotPWAdmin />} />
        <Route path="/admins/reset-password" element={<ResetPWAdmin />} />

        <Route path="/customers" element={<Homepage />} />
        <Route path="/customers/cars" element={<Category />} />
        <Route path="/customers/cars/:id" element={<Details />} />
        <Route path="/customers/comparison" element={<Comparison />} />
        
        <Route path="/checkout" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/customers/favourites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/customers/cost-estimate" element={<CostEstimate /> }/>
        <Route path="/customers/test-drive" element={<TestDrive />} />

        <Route path="/orders" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />    
        {/* Admin routes */}
        <Route path="/admins/dashboard" element={<Dashboard />} />
        <Route path="/admins/cars" element={<ListCars />} />
        <Route path="/admins/orders" element={<Orders />} />
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
