import {
  UserOutlined,
  CarOutlined,
  SolutionOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const UserSidebar = () => {
  return (
    <aside className="w-72 min-h-screen bg-white border-r flex flex-col">
      {/* Main Menu */}
      <nav className="flex-1 px-4 flex justify-center py-16">
        <div>
          <p className="text-xs text-gray-400 mb-3 ml-2">USER MENU</p>
          <ul className="space-y-2">
            <li>
              <a
                href="/customers/profile"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <UserOutlined />
                User Profile
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <CarOutlined />
                Order Tracking
              </a>
            </li>
            <li>
              <a
                href="/customers/contracts"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <SolutionOutlined />
                Contract
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50"
              >
                <ShoppingCartOutlined />
                Payment
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default UserSidebar;