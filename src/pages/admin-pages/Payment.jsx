// import { useEffect, useState } from "react";
// import { Tag, Button, Spin, Modal, Descriptions, Pagination, Select } from "antd";
// import { toast } from "react-toastify";
// import useOrderData from "../../hooks/useOrderData";
// import api from "../../api/axiosInstance";

// const paymentStatusColors = {
//     pending: "orange",
//     deposited: "gold",
//     paid: "green",
//     failed: "red",
// };

// const paymentMethodColors = {
//     cash: "blue",
//     bank_transfer: "purple",
//     qr: "cyan",
// };

// const paymentTypeColors = {
//     deposit: "volcano",
//     full: "geekblue",
// };

// const PaymentDetailModal = ({ payment, order, open, onClose }) => {
//     if (!payment || !order) return null;
//     return (
//         <Modal
//             title={`Payment Details`}
//             open={open}
//             onCancel={onClose}
//             footer={null}
//             width={600}
//         >
//             <Descriptions column={1} bordered>
//                 <Descriptions.Item label="Payment ID">{payment._id}</Descriptions.Item>
//                 <Descriptions.Item label="Order ID">{order.orderId}</Descriptions.Item>
//                 <Descriptions.Item label="Amount">{payment.amount}</Descriptions.Item>
//                 <Descriptions.Item label="Method">
//                     <Tag color={paymentMethodColors[payment.method]}>{payment.method}</Tag>
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Type">
//                     <Tag color={paymentTypeColors[payment.type]}>{payment.type}</Tag>
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Status">
//                     <Tag color={paymentStatusColors[payment.status]}>{payment.status}</Tag>
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Created At">
//                     {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Deleted">
//                     {payment.deleted ? <Tag color="red">Deleted</Tag> : <Tag color="green">Active</Tag>}
//                 </Descriptions.Item>
//             </Descriptions>
//         </Modal>
//     );
// };

// const Payment = () => {
//     const { orders, refetch } = useOrderData();
//     const [currentPage, setCurrentPage] = useState(1);
//     const pageSize = 10;
//     const [modalOpen, setModalOpen] = useState(false);
//     const [modalPayment, setModalPayment] = useState(null);
//     const [modalOrder, setModalOrder] = useState(null);
//     const [filterStatus, setFilterStatus] = useState("");
//     const [payment, setPayment] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const fetchPayments = async () => {
//         setLoading(true);
//         try {
//             const res = await api.get("/admins/payments");
//             setPayment(Array.isArray(res.data) ? res.data : []);
//         } catch (error) {
//             toast.error("Failed to fetch payments");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPayments();
//     }, []);

//     // Flatten payments for table display
//     const payments = [];
//     orders.forEach(order => {
//         if (order.data?.payment && Array.isArray(order.data.payment)) {
//             order.data.payment.forEach(payment => {
//                 payments.push({
//                     ...payment,
//                     orderId: order._id || order.id,
//                     orderData: order.data,
//                 });
//             });
//         }
//     });

//     // Filter payments by status
//     const filteredPayments = filterStatus
//         ? payments.filter(p => p.status === filterStatus)
//         : payments;

//     const pagedPayments = filteredPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//     const handleConfirmPayment = async (orderId, paymentId) => {
//         try {
//             await api.patch(`/admins/payment/${paymentId}/confirm`, { orderId, paymentId });
//             toast.success("Payment confirmed!");
//             if (refetch) refetch();
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to confirm payment");
//         }
//     };

//     const handleCancelPayment = async (orderId, paymentId) => {
//         try {
//             await api.patch(`/admins/payment/cancel`, { orderId, paymentId });
//             toast.success("Payment cancelled!");
//             if (refetch) refetch();
//         } catch (error) {
//             toast.error(error.response?.data?.message || "Failed to cancel payment");
//         }
//     };

//     const handleShowDetail = (payment, order) => {
//         setModalPayment(payment);
//         setModalOrder(order);
//         setModalOpen(true);
//     };

//     return (
//         <div className="flex min-h-screen items-center bg-[#F6F7F9]">
//             <div className="flex-1 flex flex-col px-8 py-6">
//                 <div className="w-full bg-white rounded-2xl shadow p-8">
//                     <div className="flex justify-between items-center mb-6">
//                         <h1 className="text-2xl font-bold">Payment List</h1>
//                         <div className="flex items-center gap-4">
//                             <span className="font-semibold">Filter by Status:</span>
//                             <Select
//                                 value={filterStatus}
//                                 onChange={setFilterStatus}
//                                 style={{ minWidth: 120 }}
//                                 allowClear
//                                 placeholder="All"
//                             >
//                                 <Select.Option value="">All</Select.Option>
//                                 <Select.Option value="pending">Pending</Select.Option>
//                                 <Select.Option value="deposited">Deposited</Select.Option>
//                                 <Select.Option value="paid">Paid</Select.Option>
//                                 <Select.Option value="failed">Failed</Select.Option>
//                             </Select>
//                         </div>
//                     </div>
//                     <div className="overflow-x-auto rounded-xl border border-gray-200">
//                         {loading ? (
//                             <div className="flex justify-center items-center py-12">
//                                 <Spin size="large" />
//                             </div>
//                         ) : (
//                             <table className="w-full text-left bg-white rounded-xl overflow-hidden">
//                                 <thead>
//                                     <tr className="bg-gray-50 text-[#222] text-sm font-semibold border-b">
//                                         <th className="px-4 py-3">Order ID</th>
//                                         <th className="px-4 py-3">Payment ID</th>
//                                         <th className="px-4 py-3">Amount</th>
//                                         <th className="px-4 py-3">Method</th>
//                                         <th className="px-4 py-3">Type</th>
//                                         <th className="px-4 py-3">Status</th>
//                                         <th className="px-4 py-3">Created At</th>
//                                         <th className="px-4 py-3">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {pagedPayments.map(payment => (
//                                         <tr key={payment._id} className="border-b text-base hover:bg-blue-100">
//                                             <td className="px-4 py-4">{payment.orderId}</td>
//                                             <td className="px-4 py-4">{payment._id}</td>
//                                             <td className="px-4 py-4">{payment.amount}</td>
//                                             <td className="px-4 py-4">
//                                                 <Tag color={paymentMethodColors[payment.method]}>{payment.method}</Tag>
//                                             </td>
//                                             <td className="px-4 py-4">
//                                                 <Tag color={paymentTypeColors[payment.type]}>{payment.type}</Tag>
//                                             </td>
//                                             <td className="px-4 py-4">
//                                                 <Tag color={paymentStatusColors[payment.status]}>{payment.status}</Tag>
//                                             </td>
//                                             <td className="px-4 py-4">
//                                                 {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}
//                                             </td>
//                                             <td className="px-4 py-4 flex gap-2">
//                                                 <Button
//                                                     size="small"
//                                                     type="primary"
//                                                     onClick={() => handleShowDetail(payment, { orderId: payment.orderId, ...payment.orderData })}
//                                                 >
//                                                     Details
//                                                 </Button>
//                                                 {(payment.status === "pending" || payment.status === "deposited") && (
//                                                     <Button
//                                                         size="small"
//                                                         type="default"
//                                                         onClick={() => handleConfirmPayment(payment.orderId, payment._id)}
//                                                     >
//                                                         Confirm
//                                                     </Button>
//                                                 )}
//                                                 {(payment.status === "pending" || payment.status === "deposited") && (
//                                                     <Button
//                                                         size="small"
//                                                         danger
//                                                         onClick={() => handleCancelPayment(payment.orderId, payment._id)}
//                                                     >
//                                                         Cancel
//                                                     </Button>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         )}
//                     </div>
//                     <div className="flex items-center justify-between mt-6">
//                         <span className="text-gray-400 text-sm">
//                             Showing {(currentPage - 1) * pageSize + 1}-
//                             {Math.min(currentPage * pageSize, filteredPayments.length)} from {filteredPayments.length} payments
//                         </span>
//                         <Pagination
//                             current={currentPage}
//                             pageSize={pageSize}
//                             total={filteredPayments.length}
//                             onChange={setCurrentPage}
//                             showSizeChanger={false}
//                             className="flex"
//                         />
//                     </div>
//                 </div>
//                 <PaymentDetailModal
//                     payment={modalPayment}
//                     order={modalOrder}
//                     open={modalOpen}
//                     onClose={() => setModalOpen(false)}
//                 />
//             </div>
//         </div>
//     );
// };

// export default Payment;

import { useEffect, useState } from "react";
import { Tag, Button, Spin, Modal, Descriptions, Pagination, Select } from "antd";
import { toast } from "react-toastify";
import useOrderData from "../../hooks/useOrderData";
import api from "../../api/axiosInstance";

const paymentStatusColors = {
  pending: "orange",
  deposited: "gold",
  paid: "green",
  failed: "red",
};

const paymentMethodColors = {
  cash: "blue",
  bank_transfer: "purple",
  qr: "cyan",
};

const paymentTypeColors = {
  deposit: "volcano",
  full: "geekblue",
};

const PaymentDetailModal = ({ payment, order, open, onClose }) => {
  if (!payment || !order) return null;
  return (
    <Modal
      title="Payment Details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Payment ID">{payment._id ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Order ID">{order._id || order.id}</Descriptions.Item>
        <Descriptions.Item label="Amount">{payment.amount ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Method">
          <Tag color={paymentMethodColors[payment.method]}>{payment.method ?? "—"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color={paymentTypeColors[payment.type]}>{payment.type ?? "—"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={paymentStatusColors[payment.status]}>{payment.status ?? "—"}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}
        </Descriptions.Item>
        <Descriptions.Item label="Deleted">
          {payment.deleted ? <Tag color="red">Deleted</Tag> : <Tag color="green">Active</Tag>}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

const Payment = () => {
  const { orders, refetch } = useOrderData();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPayment, setModalPayment] = useState(null);
  const [modalOrder, setModalOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch payments for all orders
  useEffect(() => {
    const fetchAllPayments = async () => {
      setLoading(true);
      try {
        const allPayments = [];
        for (const order of orders) {
          const orderId = order._id || order.id;
          if (!orderId) continue;
          const res = await api.get(`/admins/payment/${orderId}`);
          // If backend returns array, use it; if object, wrap in array
          const orderPayments = Array.isArray(res.data?.payment)
            ? res.data.payment
            : res.data?.payment
            ? [res.data.payment]
            : [];
          orderPayments.forEach(payment => {
            allPayments.push({
              ...payment,
              orderId,
              orderData: order.data,
            });
          });
        }
        setPayments(allPayments);
      } catch (error) {
        toast.error("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    if (orders && orders.length > 0) {
      fetchAllPayments();
    }
  }, [orders]);

  // Filter payments by status
  const filteredPayments = filterStatus
    ? payments.filter(p => p.status === filterStatus)
    : payments;

  const pagedPayments = filteredPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleConfirmPayment = async (orderId, paymentId) => {
    try {
      await api.patch(`/admins/payment/${paymentId}/confirm`, { orderId, paymentId });
      toast.success("Payment confirmed!");
      if (refetch) refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm payment");
    }
  };

  const handleCancelPayment = async (orderId, paymentId) => {
    try {
      await api.patch(`/admins/payment/cancel`, { orderId, paymentId });
      toast.success("Payment cancelled!");
      if (refetch) refetch();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel payment");
    }
  };

  const handleShowDetail = (payment, order) => {
    setModalPayment(payment);
    setModalOrder(order);
    setModalOpen(true);
  };

  return (
    <div className="flex min-h-screen items-center bg-[#F6F7F9]">
      <div className="flex-1 flex flex-col px-8 py-6">
        <div className="w-full bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Payment List</h1>
            <div className="flex items-center gap-4">
              <span className="font-semibold">Filter by Status:</span>
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ minWidth: 120 }}
                allowClear
                placeholder="All"
              >
                <Select.Option value="">All</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="deposited">Deposited</Select.Option>
                <Select.Option value="paid">Paid</Select.Option>
                <Select.Option value="failed">Failed</Select.Option>
              </Select>
            </div>
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
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">Payment ID</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedPayments.map(payment => (
                    <tr key={payment._id} className="border-b text-base hover:bg-blue-100">
                      <td className="px-4 py-4">{payment.orderId}</td>
                      <td className="px-4 py-4">{payment._id ?? "—"}</td>
                      <td className="px-4 py-4">{payment.amount ?? "—"}</td>
                      <td className="px-4 py-4">
                        <Tag color={paymentMethodColors[payment.method]}>{payment.method ?? "—"}</Tag>
                      </td>
                      <td className="px-4 py-4">
                        <Tag color={paymentTypeColors[payment.type]}>{payment.type ?? "—"}</Tag>
                      </td>
                      <td className="px-4 py-4">
                        <Tag color={paymentStatusColors[payment.status]}>{payment.status ?? "—"}</Tag>
                      </td>
                      <td className="px-4 py-4">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"}
                      </td>
                      <td className="px-4 py-4 flex gap-2">
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleShowDetail(payment, payment.orderData)}
                        >
                          Details
                        </Button>
                        {(payment.status === "pending" || payment.status === "deposited") && (
                          <Button
                            size="small"
                            type="default"
                            onClick={() => handleConfirmPayment(payment.orderId, payment._id)}
                          >
                            Confirm
                          </Button>
                        )}
                        {(payment.status === "pending" || payment.status === "deposited") && (
                          <Button
                            size="small"
                            danger
                            onClick={() => handleCancelPayment(payment.orderId, payment._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex items-center justify-between mt-6">
            <span className="text-gray-400 text-sm">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, filteredPayments.length)} from {filteredPayments.length} payments
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPayments.length}
              onChange={setCurrentPage}
              showSizeChanger={false}
              className="flex"
            />
          </div>
        </div>
        <PaymentDetailModal
          payment={modalPayment}
          order={modalOrder}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Payment;