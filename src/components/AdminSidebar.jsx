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

  // Optionally, you can use <Link> instead of <a> for SPA navigation
  return (
    <aside className="w-72 min-h-screen bg-white border-r flex flex-col">
      <nav className="flex-1 px-4 flex justify-center py-16">
        <div>
          <p className="text-xs text-gray-400 mb-3 ml-2">ADMIN MENU</p>
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