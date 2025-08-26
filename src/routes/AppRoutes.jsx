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
import UserProfile from "../pages/UserProfile";
import ContractList from '../pages/ContractList';
import Category from "../pages/car-browsing-pages/Category";
import Details from "../pages/car-browsing-pages/Details";
import Comparison from "../pages/car-browsing-pages/Comparison";
import Favorites from "../pages/car-browsing-pages/Favorites";
import TestDrive from "../pages/car-checkout-pages/test-drive-page/TestDrive";
import CostEstimate from "../pages/car-checkout-pages/payment-pages/CostEstimate";

import InfoFilling from "../pages/car-checkout-pages/payment-pages/InfoFilling";


//Admin pages
import Dashboard from "../pages/admin-pages/Dashboard";
import ListCars from "../pages/admin-pages/ListCars";
import Orders from "../pages/admin-pages/Orders";
import MainLayout from "/src/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

//Customers Portal
import CustomerPortal from "../pages/customer-portal-pages/CustomerPortal"
import OrderTracking from "../pages/customer-portal-pages/OrderTracking";
import OrderDetail from "../pages/customer-portal-pages/OrderDetail";
import CreateReview from "../pages/CreateReview";
import Contract from "../pages/customer-portal-pages/Contract";
import Payment from "../pages/customer-portal-pages/Payment";
// import PaymentSuccess from "../pages/customer-portal-pages/PaymentSuccess";
// import PaymentFailed from "../pages/customer-portal-pages/PaymentFailed";

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
        <Route path="/customers/profile" element={<UserProfile />} />
        <Route path="/customers/contracts" element={<ContractList />} />
        <Route path="/customers/cars" element={<Category />} />
        <Route path="/customers/cars/:id" element={<Details />} />
        <Route path="/customers/comparison" element={<Comparison />} />
        
        <Route path="/customers/favourites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/customers/cost-estimate/" element={<CostEstimate />} />        
        <Route path="/customers/cost-estimate/:id" element={<CostEstimate />} />        
        <Route path="/customers/test-drive" element={<TestDrive />} />
        <Route path="/customers/info-filling" element={<InfoFilling />} />


        <Route path="/customers/portal" element={<ProtectedRoute><CustomerPortal /></ProtectedRoute>} />
        <Route path="/customers/orders" element={<OrderTracking />} />
        <Route path="/customers/orders/:id" element={<OrderDetail />} />
        <Route path="/customers/contract" element={<Contract />} />
        <Route path="/customers/payment" element={<Payment />} />
        <Route path="/customers/create-review" element={<CreateReview />} />
        {/* <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />     */}
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
