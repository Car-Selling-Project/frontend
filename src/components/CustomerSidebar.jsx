import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  UserOutlined,
  CarOutlined,
  SolutionOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const CustomerSidebar = () => {
  const { user } = useAuth();

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
              <Link
                to="/customers/portal"
                className="flex -ml-10 font-bold items-center gap-3 px-4 py-4 rounded-lg text-gray-700 text-base hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <UserOutlined className="text-xl" />
                Customer Info
              </Link>
            </li>
            <li>
              {user ? (
                <Link
                  to="/customers/orders"
                  className="flex -ml-10 font-bold items-center gap-3 px-4 py-4 rounded-lg text-gray-700 text-base hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <CarOutlined className="text-xl" />
                  Order Tracking
                </Link>
              ) : (
                <span className="flex -ml-10 font-bold items-center gap-3 px-4 py-4 rounded-lg text-gray-400 text-base cursor-not-allowed opacity-50">
                  <CarOutlined className="text-xl" />
                  Order Tracking
                </span>
              )}
            </li>
            <li>
              <Link
                to="/customers/contracts"
                className="flex -ml-10 font-bold items-center gap-3 px-4 py-4 rounded-lg text-gray-700 text-base hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <SolutionOutlined className="text-xl" />
                Contract
              </Link>
            </li>
            <li>
              <Link
                to="/customers/payment"
                className="flex -ml-10 font-bold items-center gap-3 px-4 py-4 rounded-lg text-gray-700 text-base hover:bg-blue-50 hover:text-blue-600 transition"
              >
                <ShoppingCartOutlined className="text-xl" />
                Payment
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;