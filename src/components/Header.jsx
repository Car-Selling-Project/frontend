import React, { useState, useEffect, useRef } from "react";
import { HeartFilled, BellFilled, SettingFilled, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";
// import SearchInput from "./SearchInput";

const { TabPane } = Tabs;

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOrderTracking = () => {
    setIsDropdownOpen(false);
    navigate("/orders");
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setTimeout(() => navigate("/customers/login"), 0);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle tab click to navigate
  const handleTabClick = (key) => {
    const routes = {
      "1": "/customers/cars",
      "2": "/customers/comparison",
      "3": "/customers/cost-estimate",
      "4": "/customers/test-drive",
    };
    if (routes[key]) {
      navigate(routes[key]);
      setActiveTab(key); 
    }
  };

  return (
    <header className="p-4 shadow-md flex items-center justify-between dark:bg-gray-800">
      {/* Logo */}
      <h1
        className="pl-8 text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => {navigate("/customers");  setActiveTab(null)}}
      >
        CAR HUNT
      </h1>

      {/* Search Box */}
      {/* <SearchInput onSelectCar={handleSelectCar} /> */}

      {/* Navigation Tabs */}
      <Tabs
        onTabClick={handleTabClick}
        activeKey={activeTab}
        className="custom-tabs"
      >
        <TabPane tab={<span className="cursor-pointer text-base font-medium dark:text-gray-200">Product</span>} key="1" />
        <TabPane tab={<span className="cursor-pointer text-base font-medium dark:text-gray-200">Compare Cars</span>} key="2" />
        <TabPane tab={<span className="cursor-pointer text-base font-medium dark:text-gray-200">Cost Estimation</span>} key="3" />
        <TabPane tab={<span className="cursor-pointer text-base font-medium dark:text-gray-200">Book Test Drive</span>} key="4" />
      </Tabs>

      {/* Navigation Icons */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />

        {/* Favorites */}
        <span className="w-10 h-10 rounded-full border flex items-center justify-center hover:text-red-500 dark:text-gray-400">
          <HeartFilled
            className="text-xl cursor-pointer"
            onClick={() => navigate("/customers/favourites")}
          />
        </span>

        {/* Notifications */}
        <div className="relative">
          <span className="w-10 h-10 rounded-full border flex items-center justify-center dark:text-gray-400">
            <BellFilled className="text-xl cursor-pointer" />
          </span>
          <span className="absolute top-0 right-1 bg-red-500 text-xs w-2 h-2 rounded-full"></span>
        </div>

        {/* Settings */}
        <span className="w-10 h-10 rounded-full border flex items-center justify-center dark:text-gray-400">
          <SettingFilled className="text-xl cursor-pointer" />
        </span>

        {/* User Section */}
        <div className="relative" ref={dropdownRef}>
          {user ? (
            <div
              className="dark:text-white flex items-center cursor-pointer hover:text-blue-600"
              onClick={toggleDropdown}
            >
              <UserOutlined className="text-xl mr-1" />
              <span className="text-sm">Welcome, {user.name}</span>
            </div>
          ) : (
            <div
              className="dark:text-white flex items-center cursor-pointer hover:text-blue-600"
              onClick={() => navigate("/customers/login")}
            >
              <UserOutlined className="text-xl mr-1" />
              <span className="text-sm">Log In/Sign Up</span>
            </div>
          )}

          {/* Dropdown Menu */}
          {user && isDropdownOpen && (
            <ul className="absolute right-0 mt-4 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md border border-gray-200 dark:border-gray-600 z-10">
              <li
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm dark:text-white"
                onClick={handleOrderTracking}
              >
                Order Tracking
              </li>
              <li
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm dark:text-white"
                onClick={handleLogout}
              >
                Log Out
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;