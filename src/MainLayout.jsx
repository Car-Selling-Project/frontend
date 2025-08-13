import React from "react";
import { useTheme } from "./hooks/useTheme";
import Header from "./components/Header";
// import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

const MainLayout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div data-theme={theme} className="min-h-screen w-full bg-[#F6F7F9] dark:bg-gray-900">
      <Header />
      <div className="flex">
        <main className="w-full py-4 px-16">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;