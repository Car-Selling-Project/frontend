import React, { useState, useEffect, useRef } from "react";
import { Input } from "antd";
import { HeartFilled, BellFilled, SettingFilled, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useCarData from "../hooks/useCarData";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null); // Ref for dropdown

  // Search Function
  const { cars } = useCarData();
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setFilteredCars([]);
      return;
    }

    const results = cars.filter((car) =>
      car.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCars(results);
  };

  // Navigate
  const handleSelectCar = (car) => {
    setSearchQuery("");
    setFilteredCars([]);
    navigate(`/car/${car._id}`);
  };

  // Toggle Dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle Dropdown Options
  const handleOrderTracking = () => {
    setIsDropdownOpen(false);
    navigate("/orders");
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setTimeout(() => navigate("/customers/login"), 0);
  };

  // Close Dropdown on Outside Click
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
        onClick={() => navigate("/")}
      >
        CAR HUNT
      </h1>

      {/* Search Box */}
      <div className="relative w-1/3">
        <Input
          placeholder="Search something here"
          prefix={
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="#596780"
                strokeWidth="1.5"
              />
              <path
                d="M22 22L20 20"
                stroke="#596780"
                strokeWidth="1.5"
              />
            </svg>
          }
          className="w-80 h-10 gap-2 !rounded-full shadow-sm"
          onChange={handleSearch}
          value={searchQuery}
        />
        {filteredCars.length > 0 && (
          <ul className="absolute top-full mt-1 w-80 bg-white shadow-lg rounded-md border border-gray-200 z-10">
            {filteredCars.map((car) => (
              <li
                key={car._id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectCar(car)}
              >
                {car.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Navigation Icons */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />

        {/* Favorites */}
        <span className="w-10 h-10 rounded-full border flex items-center justify-center hover:text-red-500 dark:text-gray-400">
          <HeartFilled
            className="text-xl cursor-pointer"
            onClick={() => navigate("/favorites")}
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
              <span className="text-sm">Welcome, {user.fullName}</span>
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