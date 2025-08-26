import React, { useContext } from "react";
import { useTheme } from "./hooks/useTheme";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminSidebar from "./components/AdminSidebar";
import CustomerSidebar from "./components/CustomerSidebar";
import { AuthContext } from "./context/AuthContext";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const { theme } = useTheme();
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // Danh sách route cần sidebar
  const sidebarRoutes = ["/admins/dashboard","/admins/payments" ,"/admins/test-drives","/customers/portal", "/admins/cars", "/admins/orders", "/customers/orders", "/customers/orders/:id","/customers/contract", "/customers/payment" ];

  // Kiểm tra route hiện tại có nằm trong danh sách không
  const showSidebar = sidebarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div
      data-theme={theme}
      className="flex flex-col min-h-screen w-full bg-[#F6F7F9] dark:bg-gray-900"
    >
      <Header />

      <div className="flex flex-1 ">
        {showSidebar && user?.role === "admin" && <AdminSidebar />}
        {showSidebar && user?.role === "customer" && <CustomerSidebar />}

        <main className="flex-1 overflow-y-auto px-8 py-4">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;