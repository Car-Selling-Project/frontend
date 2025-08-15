import { useState, useEffect } from "react";
import {
  DeleteOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Pagination, Spin } from "antd";
import useOrderData from "../../hooks/useOrderData";

const Status = ({ status }) => {
  if (status === "confirmed") {
    return (
      <span className="bg-green-100 border-2 text-green-600 px-4 py-1 rounded-full font-medium text-sm">
        Confirmed
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="bg-red-100 border-2 text-red-600 px-4 py-1 rounded-full font-medium text-sm">
        Cancelled
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="bg-yellow-100 border-2 text-yellow-600 px-4 py-1 rounded-full font-medium text-sm">
        Pending
      </span>
    );
  }
  return (
    <span className="bg-gray-100 border-2 text-gray-600 px-4 py-1 rounded-full font-medium text-sm">
      {status}
    </span>
  );
};

const Orders = () => {
  const { orders, loading } = useOrderData();
  console.log("orders from hook:", orders);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const total = orders?.length || 0;

  // Checkbox state
  const [checkedIds, setCheckedIds] = useState([]);
  const [modalOrders, setModalOrders] = useState(null)

  // Reset checkedIds if orders change
  useEffect(() => {
    setCheckedIds([]);
  }, [orders]);

  // Slice data for current page
  const pagedData = orders ? orders.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  const handleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleCheckAll = () => {
    if (checkedIds.length === pagedData.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(pagedData.map((order) => order._id || order.id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCheckedIds([]);
  };

  return (
    <div className="flex min-h-screen items-center bg-[#F6F7F9]">
      <div className="flex-1 flex flex-col px-8 py-6">
        <div className="w-full bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Order List</h1>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            ) : (
              <table className="w-full text-left bg-white rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-[#222] text-sm font-semibold border-b">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          pagedData.length > 0 &&
                          checkedIds.length === pagedData.length
                        }
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              checkedIds.length > 0 &&
                              checkedIds.length < pagedData.length;
                        }}
                        onChange={handleCheckAll}
                        className="accent-blue-600 w-5 h-5 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3">Car</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Total Price</th>
                    <th className="px-4 py-3">Deposit</th>
                    <th className="px-4 py-3">Contract</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((order, idx) => (
                    <tr
                      key={order._id || order.id}
                      className={`border-b last:border-b-0 text-base transition-colors ${checkedIds.includes(order._id || order.id)
                        ? "bg-blue-50"
                        : idx % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                        } hover:bg-blue-100`}
                    >
                      <td className="px-4 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={checkedIds.includes(order._id || order.id)}
                          onChange={() => handleCheck(order._id || order.id)}
                          className="accent-blue-600 w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 flex items-center gap-3">
                        <span className="font-semibold text-[#222]">
                          {order.carInfo?.title || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {order.customerInfo?.fullName || "N/A"}
                      </td>
                      <td className="px-4 py-4">
                        {order.location?.name || order.location || "N/A"}
                      </td>
                      <td className="px-4 py-4">{order.paymentMethod || "N/A"}</td>
                      <td className="px-4 py-4">{order.totalPrice || order.total || "N/A"}</td>
                      <td className="px-4 py-4">{order.deposit || "N/A"}</td>
                      <td className="px-4 py-4">
                        {order.contract?.url
                          ? <a href={order.contract.url} target="_blank" rel="noopener noreferrer">View</a>
                          : ""}
                        {order.contract?.signed ? " (Signed)" : ""}
                      </td>
                      <td className="px-4 py-4">
                        <Status status={order.status} />
                      </td>
                      <td className="px-4 flex items-center">
                        <button className="text-blue-600 rounded-full p-2 mx-2 transition cursor-pointer">
                          <EllipsisOutlined />
                        </button>
                        <button className="text-red-600 rounded-full p-2 mx-2 transition cursor-pointer">
                          <DeleteOutlined />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Ant Design Pagination */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-gray-400 text-sm">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, total)} from {total} orders
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="flex"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;