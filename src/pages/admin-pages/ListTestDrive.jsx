import React, { useState, useEffect } from "react";
import { Pagination, Spin, Select, Button } from "antd";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import useTestDriveData from "../../hooks/useTestDriveData";
import { Modal, Descriptions, Tag } from "antd";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";

const statusOptions = [
  { value: "pending", label: "Pending", color: "#FFD700", bg: "#FFFBE6" },
  { value: "approved", label: "Approved", color: "#52C41A", bg: "#F6FFED" },
];

const StatusSelect = ({ status, testDriveId, onStatusChange }) => {
  const option = statusOptions.find(opt => opt.value === status) || statusOptions[0];

  const handleChange = async (value) => {
    if (value === "approved") {
      await onStatusChange(testDriveId, "approve");
    }
  };

  return (
    <Select
      value={status}
      onChange={handleChange}
      bordered={false}
      style={{
        background: option.bg,
        color: option.color,
        fontWeight: 500,
        borderRadius: 999,
        padding: "0 16px",
        minWidth: 110,
      }}
      dropdownStyle={{ borderRadius: 8 }}
      disabled={status !== "pending"}
    >
      {statusOptions.map(opt => (
        <Select.Option key={opt.value} value={opt.value}>
          <span style={{ color: opt.color, fontWeight: 500 }}>{opt.label}</span>
        </Select.Option>
      ))}
    </Select>
  );
};

const statusColors = {
  pending: "gold",
  approved: "green",
  declined: "red",
};

const TestDriveDetailModal = ({ testDrive, open, onClose }) => {
  if (!testDrive) return null;

  return (
    <Modal
      title="Test Drive Details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Test Drive ID">{testDrive._id}</Descriptions.Item>
        <Descriptions.Item label="Car">
          {testDrive.carInfo?.title || testDrive.carInfo?._id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Location">
          {testDrive.location?.name || testDrive.location?._id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Request Day">
          {testDrive.requestDay ? new Date(testDrive.requestDay).toLocaleString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Note">
          {testDrive.note || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Name">
          {testDrive.customerInfo?.fullName}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Phone">
          {testDrive.customerInfo?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Email">
          {testDrive.customerInfo?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Citizen ID">
          {testDrive.customerInfo?.citizenId}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Address">
          {testDrive.customerInfo?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={statusColors[testDrive.status] || "default"}>
            {testDrive.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {testDrive.createdAt ? new Date(testDrive.createdAt).toLocaleString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {testDrive.updatedAt ? new Date(testDrive.updatedAt).toLocaleString() : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

const ListTestDrive = () => {
  const { testDrives, loading, refetch } = useTestDriveData();
  console.log("Test Drives:", testDrives);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const total = testDrives?.length || 0;
  const [checkedIds, setCheckedIds] = useState([]);
  const [modalTestDrive, setModalTestDrive] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setCheckedIds([]);
  }, [testDrives]);

  const pagedData = testDrives ? testDrives.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  const handleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleCheckAll = () => {
    if (checkedIds.length === pagedData.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(pagedData.map((td) => td._id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCheckedIds([]);
  };

  const handleShowDetail = (testDrive) => {
    setModalTestDrive(testDrive);
    setModalOpen(true);
  };

  // Handle status change (approve/decline)
  const handleStatusChange = async (testDriveId, action) => {
    try {
      if (action === "approve") {
        await api.patch(`/admins/testdrives/${testDriveId}`);
        toast.success("Test drive approved!");
        setCurrentPage(1);
        if (refetch) refetch();
      }
    } catch (err) {
      toast.error(`Failed to update status: ${err.response?.data?.message || err.message}`);
      console.error("Failed to update status", err.response?.data || err.message);
    }
  };

  const handleDeleteTestDrive = async (testDriveId) => {
    try {
      await api.delete(`/admins/testdrives/${testDriveId}`);
      toast.success("Test drive deleted successfully!");
      setCurrentPage(1);
      if (refetch) refetch();
    } catch (err) {
      toast.error(`Failed to delete test drive: ${err.message}`);
    }
  }

  return (
    <div className="flex min-h-screen items-center bg-[#F6F7F9]">
      <div className="flex-1 flex flex-col px-8 py-6">
        <div className="w-full bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Test Drive Requests</h1>
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
                    <th className="px-4 py-3">Request Day</th>
                    <th className="px-4 py-3">Note</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Information</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((td, idx) => (
                    <tr
                      key={td._id}
                      className={`border-b last:border-b-0 text-base transition-colors ${checkedIds.includes(td._id)
                        ? "bg-blue-50"
                        : idx % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                        } hover:bg-blue-100`}
                    >
                      <td className="px-4 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={checkedIds.includes(td._id)}
                          onChange={() => handleCheck(td._id)}
                          className="accent-blue-600 w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#222]">
                        {td.carInfo?.title || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {td.customerInfo?.fullName || "N/A"}
                      </td>
                      <td className="px-4 py-4">
                        {td.location?.name || "N/A"}
                      </td>
                      <td className="px-4 py-4">
                        {td.requestDay ? new Date(td.requestDay).toLocaleString() : "N/A"}
                      </td>
                      <td className="px-4 py-4">{td.note || ""}</td>
                      <td className="px-4 py-4">
                        <StatusSelect
                          status={td.status}
                          testDriveId={td._id}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-4 flex items-center">
                        <button
                          className="text-blue-600 rounded-full p-2 mx-2 transition cursor-pointer"
                          onClick={() => handleShowDetail(td)}
                        >
                          <EllipsisOutlined />
                        </button>
                        <button
                          className="hover:bg-blue-200 text-red-600 rounded-full p-2 mx-2 transition cursor-pointer"
                          onClick={() => handleDeleteTestDrive(td._id)}
                          title="Delete Test Drive"
                        >
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
              {Math.min(currentPage * pageSize, total)} from {total} test drives
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
        {/* Test Drive Detail Modal */}
        <TestDriveDetailModal
          testDrive={modalTestDrive}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default ListTestDrive;