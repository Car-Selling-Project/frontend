// import { useState, useEffect, useRef } from "react";
// import {
//   EllipsisOutlined,
// } from "@ant-design/icons";
// import { Pagination, Spin, Select, Button } from "antd";
// import useOrderData from "../../hooks/useOrderData";
// import { Modal, Descriptions, Tag } from "antd";
// import { toast } from "react-toastify";
// import AddOrder from "../../components/AddOrder";
// import api from "../../api/axiosInstance";

// const statusOptions = [
//   { value: "pending", label: "Pending", color: "#FFD700", bg: "#FFFBE6" },
//   { value: "confirmed", label: "Confirmed", color: "#52C41A", bg: "#F6FFED" },
//   { value: "canceled", label: "Canceled", color: "#FF4D4F", bg: "#FFF1F0" },
//   { value: "paid", label: "Paid", color: "#1890FF", bg: "#E6F7FF" },
// ];

// const StatusSelect = ({ status, orderId, onStatusChange, disabled }) => {
//   const option = statusOptions.find(opt => opt.value === status) || statusOptions[0];

//   const handleChange = async (value) => {
//     if (disabled) return;
//     if (value === "confirmed") {
//       await onStatusChange(orderId, value, "confirm");
//     } else if (value === "canceled") {
//       await onStatusChange(orderId, value, "cancel");
//     } else if (value === "paid") {
//       await onStatusChange(orderId, value, "paid");
//     } else {
//       await onStatusChange(orderId, value, "update");
//     }
//   };

//   return (
//     <Select
//       value={status}
//       onChange={handleChange}
//       bordered={false}
//       disabled={disabled}
//       style={{
//         background: option.bg,
//         color: option.color,
//         fontWeight: 500,
//         borderRadius: 999,
//         padding: "0 16px",
//         minWidth: 110,
//       }}
//       dropdownStyle={{ borderRadius: 8 }}
//     >
//       {statusOptions.map(opt => (
//         <Select.Option key={opt.value} value={opt.value}>
//           <span style={{ color: opt.color, fontWeight: 500 }}>{opt.label}</span>
//         </Select.Option>
//       ))}
//     </Select>
//   );
// };

// const statusColors = {
//   pending: "gold",
//   confirmed: "green",
//   canceled: "red",
// };

// const paymentStatusColors = {
//   pending: "orange",
//   confirmed: "green",
//   failed: "red",
// };

// const OrderDetailModal = ({ order, open, onClose }) => {
//   if (!order) return null;

//   return (
//     <Modal
//       title={`Order Details`}
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       width={700}
//     >
//       <Descriptions column={1} bordered>
//         <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
//         <Descriptions.Item label="Car">
//           {order.data?.carInfo?.title || order.data?.carInfo?._id || "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Location">
//           {order.data?.location?.name || order.data?.location?._id || "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Admin">
//           {order.data?.admin?.fullName || order.data?.admin?._id || "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Customer Name">
//           {order.data?.customerInfo?.fullName || "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Customer Phone">
//           {order.data?.customerInfo?.phone || "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Customer Email">
//           {order.data?.customerInfo?.email || "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Customer Citizen ID">
//           {order.data?.customerInfo?.citizenId || "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Customer Address">
//           {order.data?.customerInfo?.address || "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Payment Method">
//           {order.data?.paymentMethod || "N/A"}
//         </Descriptions.Item>
//         {/* {order.data?.paymentMethod === "bank_transfer" && (
//           <>
//             <Descriptions.Item label="Bank Name">
//               {order.data?.bankDetails?.bankName || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Bank Account Number">
//               {order.data?.bankDetails?.bankAccountNumber || "N/A"}
//             </Descriptions.Item>
//           </>
//         )}
//         {order.data?.paymentMethod === "qr" && (
//           <Descriptions.Item label="QR Code">
//             {order.qrCodeUrl ? (
//               <img src={order.qrCodeUrl} alt="QR Code" style={{ maxWidth: 120 }} />
//             ) : "N/A"}
//           </Descriptions.Item>
//         )} */}
//         <Descriptions.Item label="Deposit">{order.data?.deposit || "N/A"}</Descriptions.Item>
//         <Descriptions.Item label="Total Price">{order.data?.totalPrice || "N/A"}</Descriptions.Item>
//         <Descriptions.Item label="Quantity">{order.data?.quantity || "N/A"}</Descriptions.Item>
//         <Descriptions.Item label="Payment Status">
//           <Tag color={paymentStatusColors[order.data?.paymentStatus] || "default"}>
//             {order.data?.paymentStatus}
//           </Tag>
//         </Descriptions.Item>
//         <Descriptions.Item label="Contract">
//           {order.data?.contract?.url ? (
//             <a href={order.data?.contract.url} target="_blank" rel="noopener noreferrer">
//               View Contract
//             </a>
//           ) : "N/A"}
//           {order.data?.contract?.signed && <Tag color="green" className="ml-2">Signed</Tag>}
//         </Descriptions.Item>
//         <Descriptions.Item label="Status">
//           <Tag color={statusColors[order.data?.status] || "default"}>
//             {order.data?.status}
//           </Tag>
//         </Descriptions.Item>
//         <Descriptions.Item label="Created At">
//           {order.data?.createdAt ? new Date(order.data.createdAt).toLocaleString() : "N/A"}
//         </Descriptions.Item>
//         <Descriptions.Item label="Updated At">
//           {order.data?.updatedAt ? new Date(order.data.updatedAt).toLocaleString() : "N/A"}
//         </Descriptions.Item>
//       </Descriptions>
//     </Modal>
//   );
// };

// const Orders = () => {
//   const { orders, loading, refetch } = useOrderData();
//   // console.log(orders);
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 10;
//   const total = orders?.length || 0;
//   const [checkedIds, setCheckedIds] = useState([]);
//   const [modalOrder, setModalOrder] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [signOrderId, setSignOrderId] = useState(null);
//   const fileInputRef = useRef();

//   useEffect(() => {
//     setCheckedIds([]);
//   }, [orders]);

//   const pagedData = orders ? orders.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

//   const handleCheck = (id) => {
//     setCheckedIds((prev) =>
//       prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
//     );
//   };

//   const handleCheckAll = () => {
//     if (checkedIds.length === pagedData.length) {
//       setCheckedIds([]);
//     } else {
//       setCheckedIds(pagedData.map((order) => order._id || order.id));
//     }
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     setCheckedIds([]);
//   };

//   const handleShowDetail = (order) => {
//     setModalOrder(order);
//     setModalOpen(true);
//   };

//   // Handle status change with direct endpoint calls
//   const handleStatusChange = async (orderId, newStatus, action) => {
//     try {
//       if (action === "confirmed") {
//         await api.patch(`/admins/orders/${orderId}/confirm`);
//         toast.success("Order confirmed!");
//       } else if (action === "canceled") {
//         await api.patch(`/admins/orders/${orderId}/canceled`);
//         toast.success("Order canceled!");
//       } else {
//         await api.patch(`/admins/orders/${orderId}`, { status: newStatus });
//         toast.success("Order status updated!");
//       }
//       setCurrentPage(1); // Auto reset to first page
//       if (refetch) refetch(); // Auto refresh data
//     } catch (err) {
//       toast.error("Failed to update status", err.message || "Unknown error");
//     }
//   };

//   const handleCreateContract = async (orderId) => {
//     if (!orderId) {
//       toast.error("Order ID is missing!");
//       return;
//     }
//     try {
//       await api.post('/admins/orders/contract', { orderId });
//       toast.success("Contract created successfully");
//       if (refetch) refetch();
//     } catch (error) {
//       toast.error(`Failed to create contract: ${error.response?.data?.message || "Unknown error"}`);
//       console.error("Failed to create contract", error.response?.data?.message || error.message);
//     }
//   };

//   const handleSignContract = async (orderId) => {
//     if (!orderId) {
//       toast.error("Order ID is missing!");
//       return;
//     }
//     try {
//       await api.patch(`/admins/orders/${orderId}/seller-sign`);
//       toast.success("Signed contract successfully");
//       if (refetch) refetch();
//     } catch (error) {
//       toast.error(`Failed to sign contract: ${error.response?.data?.message || "Unknown error"}`);
//       console.error("Failed to sign contract", error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center bg-[#F6F7F9]">
//       <div className="flex-1 flex flex-col px-8 py-6">
//         <div className="w-full bg-white rounded-2xl shadow p-8">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">Order List</h1>
//             <AddOrder />
//           </div>
//           <div className="overflow-x-auto rounded-xl border border-gray-200">
//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <Spin size="large" />
//               </div>
//             ) : (
//               <table className="w-full text-left bg-white rounded-xl overflow-hidden">
//                 <thead>
//                   <tr className="bg-gray-50 text-[#222] text-sm font-semibold border-b">
//                     <th className="px-4 py-3">
//                       <input
//                         type="checkbox"
//                         checked={
//                           pagedData.length > 0 &&
//                           checkedIds.length === pagedData.length
//                         }
//                         ref={(el) => {
//                           if (el)
//                             el.indeterminate =
//                               checkedIds.length > 0 &&
//                               checkedIds.length < pagedData.length;
//                         }}
//                         onChange={handleCheckAll}
//                         className="accent-blue-600 w-5 h-5 cursor-pointer"
//                       />
//                     </th>
//                     <th className="px-4 py-3">Car</th>
//                     <th className="px-4 py-3">Customer</th>
//                     <th className="px-4 py-3">Location</th>
//                     <th className="px-4 py-3">Payment Method</th>
//                     <th className="px-4 py-3">Total Price</th>
//                     <th className="px-4 py-3">Deposit</th>
//                     <th className="px-4 py-3">Contract</th>
//                     <th className="px-4 py-3">Status</th>
//                     <th className="px-4 py-3">Information</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {pagedData.map((order, idx) => (
//                     <tr
//                       key={order._id || order.id}
//                       className={`border-b last:border-b-0 text-base transition-colors ${checkedIds.includes(order._id || order.id)
//                         ? "bg-blue-50"
//                         : idx % 2 === 0
//                           ? "bg-white"
//                           : "bg-gray-50"
//                         } hover:bg-blue-100`}
//                     >
//                       <td className="px-4 py-4 align-middle">
//                         <input
//                           type="checkbox"
//                           checked={checkedIds.includes(order._id || order.id)}
//                           onChange={() => handleCheck(order._id || order.id)}
//                           className="accent-blue-600 w-5 h-5 cursor-pointer"
//                         />
//                       </td>
//                       <td className="px-4 py-4 flex items-center gap-3">
//                         <span className="font-semibold text-[#222]">
//                           {order.data?.carInfo?.title || "N/A"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-gray-500">
//                         {order.data?.customerInfo?.fullName || "N/A"}
//                       </td>
//                       <td className="px-4 py-4">
//                         {order.data?.location?.name || order.data?.location || "N/A"}
//                       </td>
//                       <td className="px-4 py-4">{order.data?.paymentMethod || "N/A"}</td>
//                       <td className="px-4 py-4">{order.data?.totalPrice || "N/A"}</td>
//                       <td className="px-4 py-4">{order.data?.deposit || "N/A"}</td>
//                       <td className="px-4 py-4">
//                         {(() => {
//                           const validOrderId =
//                             (order._id && typeof order._id === "string" && /^[a-f\d]{24}$/i.test(order._id))
//                               ? order._id
//                               : (order.id && typeof order.id === "string" && /^[a-f\d]{24}$/i.test(order.id))
//                                 ? order.id
//                                 : null;

//                           if (order.data?.contract?.url) {
//                             return (
//                               <>
//                                 <a
//                                   href={order.data.contract.url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   <Button size="small" type="primary">
//                                     View
//                                   </Button>
//                                 </a>
//                                 {order.data.contract.signedBySeller ? (
//                                   <Tag color="green" className="ml-2">Signed</Tag>
//                                 ) : (
//                                   <>
//                                     <Tag color="orange" className="ml-2">Not Signed</Tag>
//                                     <Button
//                                       size="small"
//                                       type="default"
//                                       className="ml-2"
//                                       onClick={() => {
//                                         setSignOrderId(validOrderId);
//                                         fileInputRef.current?.click();
//                                       }}
//                                       disabled={!validOrderId}
//                                     >
//                                       Sign
//                                     </Button>
//                                     <input
//                                       type="file"
//                                       accept="image/*"
//                                       ref={fileInputRef}
//                                       style={{ display: "none" }}
//                                       onChange={async (e) => {
//                                         const file = e.target.files[0];
//                                         if (!file || !signOrderId) return;
//                                         const reader = new FileReader();
//                                         reader.onload = async (ev) => {
//                                           const signatureImage = ev.target.result; // base64 string
//                                           try {
//                                             await api.patch(`/admins/orders/${signOrderId}/seller-sign`, { signatureImage });
//                                             toast.success("Signed contract successfully");
//                                             if (refetch) refetch();
//                                           } catch (error) {
//                                             toast.error(`Failed to sign contract: ${error.response?.data?.message || "Unknown error"}`);
//                                           }
//                                           setSignOrderId(null);
//                                           e.target.value = ""; // reset file input
//                                         };
//                                         reader.readAsDataURL(file);
//                                       }}
//                                     />
//                                   </>
//                                 )}
//                               </>
//                             );
//                           } else {
//                             return (
//                               <Button
//                                 size="small"
//                                 type="dashed"
//                                 onClick={() => handleCreateContract(validOrderId)}
//                                 disabled={!validOrderId}
//                               >
//                                 Create Contract
//                               </Button>
//                             );
//                           }
//                         })()}
//                       </td>
//                       <td className="px-4 py-4">
//                         <StatusSelect
//                           status={order.data?.status}
//                           orderId={order._id || order.id}
//                           onStatusChange={handleStatusChange}
//                         />
//                       </td>
//                       <td className="px-4 flex items-center">
//                         <button
//                           className="text-blue-600 rounded-full p-2 mx-2 transition cursor-pointer"
//                           onClick={() => handleShowDetail(order)}
//                         >
//                           <EllipsisOutlined />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//           {/* Ant Design Pagination */}
//           <div className="flex items-center justify-between mt-6">
//             <span className="text-gray-400 text-sm">
//               Showing {(currentPage - 1) * pageSize + 1}-
//               {Math.min(currentPage * pageSize, total)} from {total} orders
//             </span>
//             <Pagination
//               current={currentPage}
//               pageSize={pageSize}
//               total={total}
//               onChange={handlePageChange}
//               showSizeChanger={false}
//               className="flex"
//             />
//           </div>
//         </div>
//         {/* Order Detail Modal */}
//         <OrderDetailModal
//           order={modalOrder}
//           open={modalOpen}
//           onClose={() => setModalOpen(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default Orders;

import { useState, useEffect, useRef } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { Pagination, Spin, Select, Button, Modal, Descriptions, Tag } from "antd";
import useOrderData from "../../hooks/useOrderData";
import { toast } from "react-toastify";
import AddOrder from "../../components/AddOrder";
import api from "../../api/axiosInstance";

const statusOptions = [
  { value: "pending", label: "Pending", color: "#FFD700", bg: "#FFFBE6" },
  { value: "confirmed", label: "Confirmed", color: "#52C41A", bg: "#F6FFED" },
  { value: "canceled", label: "Canceled", color: "#FF4D4F", bg: "#FFF1F0" },
  { value: "paid", label: "Paid", color: "#1890FF", bg: "#E6F7FF" },
];

const StatusSelect = ({ status, orderId, onStatusChange, disabled }) => {
  const option = statusOptions.find(opt => opt.value === status) || statusOptions[0];

  const handleChange = async (value) => {
    if (disabled) return;
    if (value === "confirmed") {
      await onStatusChange(orderId, value, "confirm");
    } else if (value === "canceled") {
      await onStatusChange(orderId, value, "cancel");
    } else if (value === "paid") {
      await onStatusChange(orderId, value, "paid");
    } else {
      await onStatusChange(orderId, value, "update");
    }
  };

  return (
    <Select
      value={status}
      onChange={handleChange}
      bordered={false}
      disabled={disabled}
      style={{
        background: option.bg,
        color: option.color,
        fontWeight: 500,
        borderRadius: 999,
        padding: "0 16px",
        minWidth: 110,
      }}
      dropdownStyle={{ borderRadius: 8 }}
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
  confirmed: "green",
  canceled: "red",
  paid: "blue",
};

const paymentStatusColors = {
  pending: "orange",
  confirmed: "green",
  failed: "red",
};

const OrderDetailModal = ({ order, open, onClose }) => {
  if (!order) return null;
  return (
    <Modal
      title={`Order Details`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Order ID">{order._id}</Descriptions.Item>
        <Descriptions.Item label="Car">
          {order.data?.carInfo?.title || order.data?.carInfo?._id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Location">
          {order.data?.location?.name || order.data?.location?._id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Admin">
          {order.data?.admin?.fullName || order.data?.admin?._id || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Name">
          {order.data?.customerInfo?.fullName || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Phone">
          {order.data?.customerInfo?.phone || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Email">
          {order.data?.customerInfo?.email || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Citizen ID">
          {order.data?.customerInfo?.citizenId || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Address">
          {order.data?.customerInfo?.address || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Method">
          {order.data?.paymentMethod || "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Deposit">{order.data?.deposit || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Total Price">{order.data?.totalPrice || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Quantity">{order.data?.quantity || "N/A"}</Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          <Tag color={paymentStatusColors[order.data?.paymentStatus] || "default"}>
            {order.data?.paymentStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Contract">
          {order.data?.contract?.url ? (
            <a href={order.data?.contract.url} target="_blank" rel="noopener noreferrer">
              View Contract
            </a>
          ) : "N/A"}
          {order.data?.contract?.signed && <Tag color="green" className="ml-2">Signed</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={statusColors[order.data?.status] || "default"}>
            {order.data?.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {order.data?.createdAt ? new Date(order.data.createdAt).toLocaleString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {order.data?.updatedAt ? new Date(order.data.updatedAt).toLocaleString() : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

const Orders = () => {
  const { orders, loading, refetch } = useOrderData();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const total = orders?.length || 0;
  const [checkedIds, setCheckedIds] = useState([]);
  const [modalOrder, setModalOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [signOrderId, setSignOrderId] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    setCheckedIds([]);
  }, [orders]);

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

  const handleShowDetail = (order) => {
    setModalOrder(order);
    setModalOpen(true);
  };

  const handleStatusChange = async (orderId, newStatus, action) => {
    try {
      if (action === "confirmed") {
        await api.patch(`/admins/orders/${orderId}/confirm`);
        toast.success("Order confirmed!");
      } else if (action === "canceled") {
        await api.patch(`/admins/orders/${orderId}/canceled`);
        toast.success("Order canceled!");
      } else if (action === "paid") {
        await api.patch(`/admins/orders/${orderId}/paid`);
        toast.success("Order marked as paid!");
      } else {
        await api.patch(`/admins/orders/${orderId}`, { status: newStatus });
        toast.success("Order status updated!");
      }
      setCurrentPage(1);
      if (refetch) refetch();
    } catch (err) {
      toast.error("Failed to update status", err.message || "Unknown error");
    }
  };

  const handleCreateContract = async (orderId) => {
    if (!orderId) {
      toast.error("Order ID is missing!");
      return;
    }
    try {
      await api.post('/admins/orders/contract', { orderId });
      toast.success("Contract created successfully");
      if (refetch) refetch();
    } catch (error) {
      toast.error(`Failed to create contract: ${error.response?.data?.message || "Unknown error"}`);
      console.error("Failed to create contract", error.response?.data?.message || error.message);
    }
  };

  const handleSignContract = async (orderId, signatureImage = null) => {
    if (!orderId) {
      toast.error("Order ID is missing!");
      return;
    }
    try {
      await api.patch(`/admins/orders/${orderId}/seller-sign`, { signatureImage });
      toast.success("Signed contract successfully");
      if (refetch) refetch();
    } catch (error) {
      toast.error(`Failed to sign contract: ${error.response?.data?.message || "Unknown error"}`);
      console.error("Failed to sign contract", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center bg-[#F6F7F9]">
      <div className="flex-1 flex flex-col px-8 py-6">
        <div className="w-full bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Order List</h1>
            <AddOrder />
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
                    <th className="px-4 py-3">Information</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((order, idx) => {
                    const validOrderId =
                      (order._id && typeof order._id === "string" && /^[a-f\d]{24}$/i.test(order._id))
                        ? order._id
                        : (order.id && typeof order.id === "string" && /^[a-f\d]{24}$/i.test(order.id))
                          ? order.id
                          : null;
                    const isCanceled = order.data?.status === "canceled";
                    return (
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
                            {order.data?.carInfo?.title || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-500">
                          {order.data?.customerInfo?.fullName || "N/A"}
                        </td>
                        <td className="px-4 py-4">
                          {order.data?.location?.name || order.data?.location || "N/A"}
                        </td>
                        <td className="px-4 py-4">{order.data?.paymentMethod || "N/A"}</td>
                        <td className="px-4 py-4">{order.data?.totalPrice || "N/A"}</td>
                        <td className="px-4 py-4">{order.data?.deposit || "N/A"}</td>
                        <td className="px-4 py-4">
                          {(() => {
                            if (order.data?.contract?.url) {
                              return (
                                <>
                                  <a
                                    href={order.data.contract.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button size="small" type="primary">
                                      View
                                    </Button>
                                  </a>
                                  {order.data.contract.signedBySeller ? (
                                    <Tag color="green" className="ml-2">Signed</Tag>
                                  ) : (
                                    <>
                                      <Tag color="orange" className="ml-2">Not Signed</Tag>
                                      <Button
                                        size="small"
                                        type="default"
                                        className="ml-2"
                                        onClick={() => {
                                          setSignOrderId(validOrderId);
                                          fileInputRef.current?.click();
                                        }}
                                        disabled={!validOrderId || isCanceled}
                                      >
                                        Sign
                                      </Button>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={async (e) => {
                                          const file = e.target.files[0];
                                          if (!file || !signOrderId) return;
                                          const reader = new FileReader();
                                          reader.onload = async (ev) => {
                                            const signatureImage = ev.target.result; // base64 string
                                            await handleSignContract(signOrderId, signatureImage);
                                            setSignOrderId(null);
                                            e.target.value = ""; // reset file input
                                          };
                                          reader.readAsDataURL(file);
                                        }}
                                      />
                                    </>
                                  )}
                                </>
                              );
                            } else {
                              return (
                                <Button
                                  size="small"
                                  type="dashed"
                                  onClick={() => handleCreateContract(validOrderId)}
                                  disabled={!validOrderId || isCanceled}
                                >
                                  Create Contract
                                </Button>
                              );
                            }
                          })()}
                        </td>
                        <td className="px-4 py-4">
                          <StatusSelect
                            status={order.data?.status}
                            orderId={order._id || order.id}
                            onStatusChange={handleStatusChange}
                            disabled={isCanceled}
                          />
                        </td>
                        <td className="px-4 flex items-center">
                          <button
                            className="text-blue-600 rounded-full p-2 mx-2 transition cursor-pointer"
                            onClick={() => handleShowDetail(order)}
                          >
                            <EllipsisOutlined />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
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
        <OrderDetailModal
          order={modalOrder}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Orders;