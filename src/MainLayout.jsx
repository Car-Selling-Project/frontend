import { useTheme } from "./hooks/useTheme";
import Header from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import AdminSidebar from "./components/AdminSidebar";

const MainLayout = ({ children }) => {
  const { theme } = useTheme();
  const { token, user } = useAuth();

  return (
    <div data-theme={theme} className="min-h-screen w-full bg-[#F6F7F9] dark:bg-gray-900">
      <Header />
      <div className="flex">
        { token && user && <AdminSidebar />}
        <main className="w-full py-4 px-16">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;