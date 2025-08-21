import React, { useState } from 'react'
import {
  InfoCircleOutlined,
  EllipsisOutlined,
  FilePdfOutlined
} from "@ant-design/icons";
import { Pagination, Modal, Tag, Descriptions, Spin, Button } from "antd";

// Mock contract data based on orders.schema.js
const mockContracts = [
  {
    _id: "1",
    carInfo: { title: "Tesla Model S" },
    location: { name: "Hanoi Showroom" },
    totalPrice: 120000,
    deposit: 36000,
    paymentMethod: "bank_transfer",
    paymentStatus: "confirmed",
    customerInfo: {
      fullName: "Nguyen Van A",
      phone: "0901234567",
      email: "a@gmail.com",
      citizenId: "123456789",
      address: "123 Main St, Hanoi"
    },
    contract: {
      url: "https://example.com/contract1.pdf",
      signed: true,
      signedBySeller: true,
      signedBySellerName: "Admin Seller",
      signedBySellerAt: "2024-08-01T10:00:00Z",
      signedByBuyer: true,
      signedByBuyerName: "Nguyen Van A",
      signedByBuyerAt: "2024-08-01T11:00:00Z"
    },
    status: "confirmed",
    quantity: 1,
    createdAt: "2024-08-01T09:00:00Z"
  },
  {
    _id: "2",
    carInfo: { title: "Toyota Camry" },
    location: { name: "Saigon Showroom" },
    totalPrice: 80000,
    deposit: 24000,
    paymentMethod: "cash",
    paymentStatus: "pending",
    customerInfo: {
      fullName: "Tran Thi B",
      phone: "0912345678",
      email: "b@gmail.com",
      citizenId: "987654321",
      address: "456 Main St, Saigon"
    },
    contract: {
      url: "https://example.com/contract2.pdf",
      signed: false,
      signedBySeller: false,
      signedByBuyer: false
    },
    status: "pending",
    quantity: 2,
    createdAt: "2024-08-02T09:00:00Z"
  }
];

const ContractDetailModal = ({ contract, open, onClose }) => {
  if (!contract) return null;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-2">
          <InfoCircleOutlined className="text-blue-500" />
          <span>Contract Detail</span>
        </div>
      }
      width={700}
    >
      <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600, width: 120 }}>
        <Descriptions.Item label="Car">{contract.carInfo?.title}</Descriptions.Item>
        <Descriptions.Item label="Location">{contract.location?.name}</Descriptions.Item>
        <Descriptions.Item label="Customer">{contract.customerInfo?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Phone">{contract.customerInfo?.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{contract.customerInfo?.email}</Descriptions.Item>
        <Descriptions.Item label="Citizen ID">{contract.customerInfo?.citizenId}</Descriptions.Item>
        <Descriptions.Item label="Address">{contract.customerInfo?.address}</Descriptions.Item>
        <Descriptions.Item label="Total Price">${contract.totalPrice}</Descriptions.Item>
        <Descriptions.Item label="Deposit">${contract.deposit}</Descriptions.Item>
        <Descriptions.Item label="Payment Method">{contract.paymentMethod}</Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          <Tag color={
            contract.paymentStatus === "confirmed" ? "green" :
            contract.paymentStatus === "pending" ? "orange" : "red"
          }>
            {contract.paymentStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Quantity">{contract.quantity}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={
            contract.status === "confirmed" ? "green" :
            contract.status === "pending" ? "orange" : "red"
          }>
            {contract.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Contract PDF">
          {contract.contract?.url ? (
            <Button
              type="link"
              icon={<FilePdfOutlined />}
              href={contract.contract.url}
              target="_blank"
            >
              View PDF
            </Button>
          ) : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Signed">
          <Tag color={contract.contract?.signed ? "green" : "red"}>
            {contract.contract?.signed ? "Yes" : "No"}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Signed By Seller">
          <Tag color={contract.contract?.signedBySeller ? "green" : "red"}>
            {contract.contract?.signedBySeller ? "Yes" : "No"}
          </Tag>
          {contract.contract?.signedBySellerName && (
            <span> ({contract.contract.signedBySellerName})</span>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Signed By Buyer">
          <Tag color={contract.contract?.signedByBuyer ? "green" : "red"}>
            {contract.contract?.signedByBuyer ? "Yes" : "No"}
          </Tag>
          {contract.contract?.signedByBuyerName && (
            <span> ({contract.contract.signedByBuyerName})</span>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {new Date(contract.createdAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

const ContractList = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const total = mockContracts.length;

  // Checkbox state
  const [checkedIds, setCheckedIds] = useState([]);
  const [modalContract, setModalContract] = useState(null);

  // Slice data for current page
  const pagedData = mockContracts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleCheckAll = () => {
    if (checkedIds.length === pagedData.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(pagedData.map((contract) => contract._id));
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
            <h1 className="text-2xl font-bold">Contract List</h1>
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
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
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Total Price</th>
                  <th className="px-4 py-3">Deposit</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Contract</th>
                </tr>
              </thead>
              <tbody>
                {pagedData.map((contract, idx) => (
                  <tr
                    key={contract._id}
                    className={`border-b last:border-b-0 text-base transition-colors ${
                      checkedIds.includes(contract._id)
                        ? "bg-blue-50"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    } hover:bg-blue-100`}
                  >
                    <td className="px-4 py-4 align-middle">
                      <input
                        type="checkbox"
                        checked={checkedIds.includes(contract._id)}
                        onChange={() => handleCheck(contract._id)}
                        className="accent-blue-600 w-5 h-5 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#222]">
                      {contract.carInfo?.title}
                      <button
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        onClick={() => setModalContract(contract)}
                        title="View Details"
                      >
                        <InfoCircleOutlined className="cursor-pointer" />
                      </button>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      {contract.location?.name}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      ${contract.totalPrice}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      ${contract.deposit}
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      <Tag color={
                        contract.paymentStatus === "confirmed" ? "green" :
                        contract.paymentStatus === "pending" ? "orange" : "red"
                      }>
                        {contract.paymentMethod}
                      </Tag>
                    </td>
                    <td className="px-4 py-4 text-gray-700">
                      <Tag color={
                        contract.status === "confirmed" ? "green" :
                        contract.status === "pending" ? "orange" : "red"
                      }>
                        {contract.status}
                      </Tag>
                    </td>
                    <td className="px-4 py-4">
                      {contract.contract?.url ? (
                        <a
                          href={contract.contract.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <Button>
                            View <FilePdfOutlined />
                          </Button>
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                      <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full p-2 mx-2 transition cursor-pointer">
                        <EllipsisOutlined />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Ant Design Pagination */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-gray-400 text-sm">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, total)} from {total} data
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
        {/* Contract Detail Modal */}
        <ContractDetailModal
          contract={modalContract}
          open={!!modalContract}
          onClose={() => setModalContract(null)}
        />
      </div>
    </div>
  );
};

export default ContractList;