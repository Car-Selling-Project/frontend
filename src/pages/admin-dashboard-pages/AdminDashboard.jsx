import React, { useEffect, useState } from "react";
import { Table, Button, Input, Popconfirm, message } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "../../api/axiosInstance";
import "@fortawesome/fontawesome-free/css/all.min.css";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/admin/dashboard");
      console.log("Dashboard data:", res.data);
      setDashboardData(res.data);
    } catch (err) {
      message.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/cars/${id}`);
      message.success("Car deleted successfully");
      setDashboardData((prev) => prev.filter((car) => car.carName !== id));
    } catch (err) {
      message.error("Failed to delete car");
    }
  };

  const filteredData = dashboardData.filter((car) =>
    car.carName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Car Name",
      dataIndex: "carName",
      key: "carName",
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: "Renter Name",
      dataIndex: "renterName",
      key: "renterName",
      render: (text) => <span>{text || "—"}</span>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            record.status === "on delivery"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {record.status}
        </span>
      ),
    },
    {
      title: "Rental Count",
      dataIndex: "rentalCount",
      key: "rentalCount",
      render: (text) => <span>{text || 0}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <span>{date ? new Date(date).toLocaleDateString() : "N/A"}</span>
      ),
    },
    {
      title: "Pick-up Location",
      dataIndex: "pickUpLocation",
      key: "pickUpLocation",
      render: (text) => <span>{text || "—"}</span>,
    },
    {
      title: "Drop-off Location",
      dataIndex: "dropOffLocation",
      key: "dropOffLocation",
      render: (text) => <span>{text || "—"}</span>,
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer">
            <i className="fas fa-phone-alt text-sm"></i>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer">
            <i className="fas fa-envelope text-sm"></i>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Admin Dashboard</h1>
      </div>

      <div className="mb-4 w-1/3">
        <Input
          placeholder="Search something here"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="carName" 
        scroll={{ x: 1000 }}
        className="bg-white dark:bg-gray-800 rounded-lg"
      />
    </div>
  );
};

export default AdminDashboard;