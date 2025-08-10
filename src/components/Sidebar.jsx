import React from "react";
import {
  DashboardOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const Sidebar = () => {
  return (
    <aside className="w-72 min-h-screen bg-white border-r flex flex-col">
      {/* Main Menu */}
      <nav className="flex-1 px-4 py-6">
        <div>
          <p className="text-xs text-gray-400 mb-3 ml-2">MAIN MENU</p>
          <ul className="space-y-2">
            <li>
              <a
                href="/admins/dashboard"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <DashboardOutlined />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/admins/cars"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <CarOutlined />
                Car Management
              </a>
            </li>
            <li>
              <a
                href="/admins/orders"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <ShoppingCartOutlined />
                Order Management
              </a>
            </li>
          </ul>
        </div>
        {/* Preferences */}
        <div className="mt-10">
          <p className="text-xs text-gray-400 mb-3 ml-2">PREFERENCES</p>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <SettingOutlined />
                Settings
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <QuestionCircleOutlined />
                Help &amp; Center
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;