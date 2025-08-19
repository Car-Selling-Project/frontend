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

  return (
    <header className="p-4 shadow-md flex items-center justify-between dark:bg-gray-800">
      {/* Logo */}
      <h1
        className="pl-8 text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => { navigate("/customers"); setActiveTab(null) }}
      >
        CAR HUNT
      </h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search something here..."
          className="w-96 px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {/* Add icons/user avatar here if needed */}
      </div>

      {/* Navigation Icons */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />

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
              onClick={() => navigate("/admins/login")}
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