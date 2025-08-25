import { useEffect, useState, useRef } from "react";
import {
  InfoCircleOutlined,
  EllipsisOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import { Pagination, Modal, Tag, Descriptions, Spin, Button } from "antd";
import { toast } from "react-toastify";
import axios from "../api/axiosInstance";

const statusColors = {
  pending: "gold",
  confirmed: "green",
  canceled: "red",
  paid: "blue",
};

const paymentStatusColors = {
  pending: "orange",
  confirmed: "green",
  failed: "red",
};

const ContractDetailModal = ({ contract, open, onClose }) => {
  if (!contract) return null;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="w-full max-h-screen flex items-center gap-2 overflow-hidden">
          <InfoCircleOutlined className="text-blue-500" />
          <span>Contract Detail</span>
        </div>
      }
      width={700}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Car">{contract.data?.carInfo?.title}</Descriptions.Item>
        <Descriptions.Item label="Location">{contract.data?.location?.name}</Descriptions.Item>
        <Descriptions.Item label="Customer">{contract.data?.customerInfo?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Phone">{contract.data?.customerInfo?.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{contract.data?.customerInfo?.email}</Descriptions.Item>
        <Descriptions.Item label="Citizen ID">{contract.data?.customerInfo?.citizenId}</Descriptions.Item>
        <Descriptions.Item label="Address">{contract.data?.customerInfo?.address}</Descriptions.Item>
        <Descriptions.Item label="Total Price">${contract.data?.totalPrice}</Descriptions.Item>
        <Descriptions.Item label="Deposit">${contract.data?.deposit}</Descriptions.Item>
        <Descriptions.Item label="Payment Method">{contract.data?.paymentMethod}</Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          <Tag color={paymentStatusColors[contract.data?.paymentStatus] || "default"}>
            {contract.data?.paymentStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Quantity">{contract.data?.quantity}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={statusColors[contract.data?.status] || "default"}>
            {contract.data?.status}
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
          <Tag color={contract.contract?.signedByBuyer ? "green" : "red"}>
            {contract.contract?.signedByBuyer ? "Yes" : "No"}
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
          {contract.data?.createdAt && new Date(contract.data.createdAt).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [checkedIds, setCheckedIds] = useState([]);
  const [modalContract, setModalContract] = useState(null);
  const [signingId, setSigningId] = useState(null);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [signType, setSignType] = useState("text"); // "text" or "image"
  const [signText, setSignText] = useState("");
  const [signImage, setSignImage] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const ordersRes = await axios.get("/customers/orderss");
        console.log(ordersRes.data);
        const orders = ordersRes.data.data || [];
        // For each order, fetch contract status
        const contractPromises = orders.map(order =>
          axios.get(`/customers/orders/${order.id}/contract`).then(res => ({
            ...order,
            contract: res.data.contract,
            contractStatus: res.data.contractStatus
          }))
        );
        const contractsData = await Promise.all(contractPromises);
        setContracts(contractsData.filter(c => c.status !== "canceled"));
      } catch (err) {
        toast.error("Failed to load contracts");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  useEffect(() => {
    setCheckedIds([]);
  }, [contracts]);

  const total = contracts.length;
  const pagedData = contracts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleCheckAll = () => {
    if (checkedIds.length === pagedData.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(pagedData.map((contract) => contract.id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCheckedIds([]);
  };

  const handleSignContract = async (orderId, signatureImage) => {
    if (!orderId) {
      toast.error("Invalid Order");
      return;
    }
    setLoading(true);
    try {
      await axios.patch(`/customers/orders/${orderId}/buyer-sign`, { signatureImage }, {
        headers: { "Content-Type": "application/json" }
      });
      toast.success("Signed contract successfully");
      // ...refresh logic...
    } catch (error) {
      toast.error(`Failed to sign contract: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setSignModalOpen(false);
      setSignText("");
      setSignImage(null);
      setSigningId(null);
      setSignType("text");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F6F7F9]">
        <Spin size="large" />
      </div>
    );
  }

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
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total Price</th>
                  <th className="px-4 py-3">Deposit</th>
                  <th className="px-4 py-3">Contract</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Information</th>
                </tr>
              </thead>
              <tbody>
                {pagedData.map((contract, idx) => {
                  const validContractId =
                    (contract.id && typeof contract.id === "string" && /^[a-f\d]{24}$/i.test(contract.id))
                      ? contract.id
                      : null;
                  const isCanceled = contract.data?.status === "canceled";
                  return (
                    <tr
                      key={contract.id}
                      className={`border-b last:border-b-0 text-base transition-colors ${checkedIds.includes(contract.id)
                        ? "bg-blue-50"
                        : idx % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                        } hover:bg-blue-100`}
                    >
                      <td className="px-4 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={checkedIds.includes(contract.id)}
                          onChange={() => handleCheck(contract.id)}
                          className="accent-blue-600 w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 font-semibold text-[#222]">
                        {contract.data?.carInfo?.title || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-gray-500">
                        {contract.data?.customerInfo?.fullName || "N/A"}
                      </td>
                      <td className="px-4 py-4">
                        {contract.data?.location?.name || "N/A"}
                      </td>
                      <td className="px-4 py-4">
                        <Tag color={paymentStatusColors[contract.data?.paymentStatus] || "default"}>
                          {contract.data?.paymentMethod || "N/A"}
                        </Tag>
                      </td>
                      <td className="px-4 py-4">{contract.data?.totalPrice || "N/A"}</td>
                      <td className="px-4 py-4">{contract.data?.deposit || "N/A"}</td>
                      <td className="px-4 py-4">
                        {contract.contract?.url ? (
                          <>
                            <a
                              href={contract.contract.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="small" type="primary">
                                View <FilePdfOutlined />
                              </Button>
                            </a>
                            {contract.contract?.signedByBuyer ? (
                              <Tag color="green" className="ml-2">
                                <CheckCircleOutlined /> Signed
                              </Tag>
                            ) : (
                              <>
                                <Tag color="orange" className="ml-2">
                                  <CloseCircleOutlined /> Not Signed
                                </Tag>
                                <Button
                                  size="small"
                                  type="default"
                                  className="ml-2"
                                  onClick={() => {
                                    setSigningId(validContractId);
                                    setSignModalOpen(true);
                                  }}
                                  disabled={!validContractId || isCanceled}
                                >
                                  Sign
                                </Button>
                              </>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <Tag color={statusColors[contract.data?.status] || "default"}>
                          {contract.data?.status}
                        </Tag>
                      </td>
                      <td className="px-4 flex items-center">
                        <button
                          className="text-blue-600 rounded-full p-2 mx-2 transition cursor-pointer"
                          onClick={() => setModalContract(contract)}
                        >
                          <EllipsisOutlined />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-6">
            <span className="text-gray-400 text-sm">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, total)} from {total} contracts
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
        <ContractDetailModal
          contract={modalContract}
          open={!!modalContract}
          onClose={() => setModalContract(null)}
        />
        <Modal
          open={signModalOpen}
          title="Sign Contract"
          onCancel={() => {
            setSignModalOpen(false);
            setSignText("");
            setSignImage(null);
            setSigningId(null);
            setSignType("text");
          }}
          onOk={() => {
            if (signType === "text") {
              handleSignContract(signingId, signText);
            } else {
              handleSignContract(signingId, signImage);
            }
          }}
          okText="Sign"
          destroyOnClose
        >
          <div style={{ marginBottom: 16 }}>
            <Button
              type={signType === "text" ? "primary" : "default"}
              onClick={() => setSignType("text")}
              style={{ marginRight: 8 }}
            >
              Text Sign
            </Button>
            <Button
              type={signType === "image" ? "primary" : "default"}
              onClick={() => setSignType("image")}
            >
              Image Sign
            </Button>
          </div>
          {signType === "text" ? (
            <input
              type="text"
              placeholder="Enter your name or signature text"
              value={signText}
              onChange={e => setSignText(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={e => setSignImage(e.target.files[0])}
              />
              {signImage && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(signImage)}
                    alt="Signature Preview"
                    style={{ maxWidth: "100%", maxHeight: 120 }}
                  />
                </div>
              )}
            </>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ContractList;