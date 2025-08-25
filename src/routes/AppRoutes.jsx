import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
// Customer Authentication routes
import Login from "../pages/user-authentication-pages/Login";
import Register from "../pages/user-authentication-pages/Register";
import ForgotPWCustomer from "../pages/user-authentication-pages/ForgotPasswordCustomer";
import ResetPWCustomer from "../pages/user-authentication-pages/ResetPasswordCustomer";

import Homepage from "../pages/car-browsing-pages/Homepage";
import UserProfile from "../pages/UserProfile";
import ContractList from '../pages/ContractList';
import Category from "../pages/car-browsing-pages/Category";
import Details from "../pages/car-browsing-pages/Details";
import Comparison from "../pages/car-browsing-pages/Comparison";
import MainLayout from "/src/MainLayout";
import Favorites from "../pages/car-browsing-pages/Favorites";
import TestDrive from "../pages/car-browsing-pages/TestDrive";

import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {

  return (
    <MainLayout>
      <Routes>
        <Route path="/customers/login" element={<Login />} />
        <Route path="/customers/register" element={<Register />} />
        <Route path="/customers/forgot-password" element={<ForgotPWCustomer />} />
        <Route path="/customers/reset-password" element={<ResetPWCustomer />} />

        <Route path="/customers" element={<Homepage />} />
        <Route path="/customers/profile" element={<UserProfile />} />
        <Route path="/customers/contracts" element={<ContractList />} />
        <Route path="/customers/cars" element={<Category />} />
        <Route path="/customers/cars/:id" element={<Details />} />
        <Route path="/customers/comparison" element={<Comparison />} />

        <Route path="/customers/favourites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/customers/test-drive" element={<TestDrive />} />
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
