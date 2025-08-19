import React from 'react';
import { ShoppingCartOutlined, CarOutlined, UserOutlined, DollarOutlined, EllipsisOutlined } from '@ant-design/icons';
import gtr from '../../assets/images/gtr.jpg';
import Top5CarChart from '../../components/charts/TopCars';
import RentalPerDayChart from '../../components/charts/RentPerDay';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#F6F7F9]">
      <div className="flex-1 flex flex-col px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1A202C]">Dashboard</h1>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <ShoppingCartOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C]">1,200</h3>
              <p className="text-gray-400">Total Purchases</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <CarOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C]">250</h3>
              <p className="text-gray-400">Cars Available</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <UserOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C]">1,080</h3>
              <p className="text-gray-400">Active Customers</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 rounded-full p-3">
              <DollarOutlined className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1A202C]">$92,000</h3>
              <p className="text-gray-400">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Recent Transactions */}
          <div className="flex-1 bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1A202C]">Recent Transaction</h3>
              <a href="#" className="text-blue-600 text-sm font-medium">View All</a>
            </div>
            <div>
              {/* Transaction Item */}
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-4">
                  <img src={gtr} alt="Nissan GT-R" className="w-14 h-10 rounded object-cover" />
                  <div>
                    <h3 className="font-semibold text-[#1A202C]">Nissan GT-R</h3>
                    <span className="text-xs text-gray-400">Sport Car</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">20 July</p>
                  <h3 className="font-semibold">$80.00</h3>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-4">
                  <img src={gtr} alt="Koenigsegg" className="w-14 h-10 rounded object-cover" />
                  <div>
                    <h3 className="font-semibold text-[#1A202C]">Koenigsegg</h3>
                    <span className="text-xs text-gray-400">Sport Car</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">19 July</p>
                  <h3 className="font-semibold">$99.00</h3>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-4">
                  <img src={gtr} alt="Rolls-Royce" className="w-14 h-10 rounded object-cover" />
                  <div>
                    <h3 className="font-semibold text-[#1A202C]">Rolls-Royce</h3>
                    <span className="text-xs text-gray-400">Sport Car</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">18 July</p>
                  <h3 className="font-semibold">$96.00</h3>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <img src={gtr} alt="CR-V" className="w-14 h-10 rounded object-cover" />
                  <div>
                    <h3 className="font-semibold text-[#1A202C]">CR-V</h3>
                    <span className="text-xs text-gray-400">SUV</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">17 July</p>
                  <h3 className="font-semibold">$80.00</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="flex flex-col gap-6 w-[420px]">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#1A202C]">Top 5 Car Selling</h3>
                <EllipsisOutlined className="text-gray-400" />
              </div>
              <div className="pie-chart flex justify-center items-center">
                <Top5CarChart />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold text-[#1A202C] mb-2">Rental per Day</h3>
              <div>
                <RentalPerDayChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;