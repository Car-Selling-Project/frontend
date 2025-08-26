import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  CarOutlined,
  ShoppingCartOutlined,
  BankOutlined
} from "@ant-design/icons";

const AdminSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, don't render sidebar
  if (!user) return null;

  return (
    <aside className="w-72 h-auto bg-white dark:bg-gray-800 flex flex-col -mb-10">
      <nav className="flex-1 pl-10 py-10 flex flex-col gap-10">
        {/* Top Section */}
        <div>
          <p className="text-base font-semibold text-gray-400 mb-4 ml-2 tracking-wider">
            MAIN MENU
          </p>
          <ul className="space-y-2">
            <li>
              <a
                href="/admins/dashboard"
                className="flex -ml-10 font-bold items-center gap-3 px-4 py-4 rounded-lg text-gray-700 text-base hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <DashboardOutlined className="text-xl" />
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/admins/cars"
                className="flex -ml-10 font-bold items-center gap-3 px-4 py-4 rounded-lg text-gray-700 text-base hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <CarOutlined className="text-xl" />
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
            <li>
              <a
                href="/admins/test-drives"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <CarOutlined />
                Test Drive Management
              </a>
            </li>
            <li>
              <a
                href="/admins/payments"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <BankOutlined />
                Payment Management
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;