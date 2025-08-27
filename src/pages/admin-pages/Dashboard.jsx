import { useEffect, useState } from 'react';
import { ShoppingCartOutlined, CarOutlined, UserOutlined, DollarOutlined, EllipsisOutlined } from '@ant-design/icons';
import gtr from '../../assets/images/gtr.jpg';
import Top5CarChart from '../../components/charts/TopCars';
import RentalPerDayChart from '../../components/charts/PurchasePerDay';
import api from '../../api/axiosInstance';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orders: [],
    soldCars: [],
    totalCarsSold: 0,
    totalByBrand: [],
    totalByCarType: [],
    topAdmins: [],
    activeCustomers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch revenue and orders
        const revenueRes = await api.get('/admins/dashboard-stat/revenue');
        // Fetch sold cars
        const soldCarsRes = await api.get('/admins/dashboard-stat/sold-cars');
        // Fetch top sales admins
        const topAdminsRes = await api.get('/admins/dashboard-stat/top-sales');
        // Fetch active customers
        const activeCustomersRes = await api.get('/admins/dashboard-stat/active-customers');

        console.log('revenueRes:', revenueRes.data);
        console.log('soldCarsRes:', soldCarsRes.data);
        console.log('topAdminsRes:', topAdminsRes.data);
        console.log('activeCustomersRes:', activeCustomersRes.data);

        setStats({
          totalRevenue: revenueRes.data.totalRevenue,
          orders: revenueRes.data.orders,
          soldCars: soldCarsRes.data.soldCars,
          totalCarsSold: soldCarsRes.data.totalCarsSold,
          totalByBrand: soldCarsRes.data.totalByBrand,
          totalByCarType: soldCarsRes.data.totalByCarType,
          topAdmins: topAdminsRes.data,
          activeCustomers: activeCustomersRes.data.count,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F6F7F9] dark:bg-gray-800">
      <div className="flex-1 flex flex-col px-6 py-6 bg-[#F6F7F9] dark:bg-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1A202C] dark:text-white">Dashboard</h1>
        </div>

        {/* Performance Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <ShoppingCartOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C] dark:text-white">{stats.orders.length}</h3>
              <p className="text-gray-400 ">Total Purchases</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <CarOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C] dark:text-white">{stats.totalCarsSold}</h3>
              <p className="text-gray-400 ">Cars Sold</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <UserOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C] dark:text-white">{stats.activeCustomers}</h3>
              <p className="text-gray-400 ">Active Customers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <DollarOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C] dark:text-white">${stats.totalRevenue.toLocaleString()}</h3>
              <p className="text-gray-400">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6 bg-white dark:bg-gray-700 rounded-xl shadow p-6 flex-1">
          <div className='w-full'>
            {/* Recent Transactions */}
            <div className="flex-1 h-[435px] flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1A202C] dark:text-white">Recent Transaction</h3>
                <a href="/admins/orders" className="text-blue-600 text-sm font-medium">View All</a>
              </div>
              <div>
                {stats.orders.slice(0, 4).map((order, idx) => (
                  <div key={order._id || idx} className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center gap-4">
                      <img src={order.carInfo?.images?.[0] || gtr} alt={order.carInfo?.title || "Car"} className="w-14 h-10 rounded object-cover" />
                      <div>
                        <h3 className="font-semibold text-[#1A202C] dark:text-white">{order.carInfo?.title || "Car"}</h3>
                        <span className="text-sm text-gray-400">{order.carInfo?.carType || "Type"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <h3 className="font-semibold text-black dark:text-white">${order.totalPrice}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Top Seller (Top Sales Admins) */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6 h-[435px] flex flex-col mt-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#1A202C] dark:text-white">Top Admins Sales</h3>
              </div>
              <div className="flex-1">
                {stats.topAdmins && stats.topAdmins.length > 0 ? (
                  stats.topAdmins.map((admin, idx) => (
                    <div key={admin.name || idx} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-blue-600 text-lg">
                          {admin.name ? admin.name[0].toUpperCase() : "A"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#1A202C] dark:text-white">{admin.name || "Admin"}</h3>
                          <span className="text-sm text-gray-400">Orders: {admin.count}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <h3 className="font-semibold text-[#1A202C] dark:text-white">${admin.totalRevenue?.toLocaleString() || 0}</h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-center py-8">No sales data</div>
                )}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="flex flex-col gap-6 w-[420px]">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#1A202C] dark:text-white">Top 5 Car Selling</h3>
                <EllipsisOutlined className="text-gray-400 dark:text-gray-100" />
              </div>
              <div className="pie-chart flex justify-center items-center">
                <Top5CarChart soldCars={stats.soldCars} totalByCarType={stats.totalByCarType} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-[#1A202C] dark:text-white mb-2">Purchase per Day</h3>
              <div>
                <RentalPerDayChart orders={stats.orders} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;