// import { useState, useEffect } from "react";
// import { Button, Select, Modal, Input } from "antd";
// import useOrderData from "../hooks/useOrderData";
// import api from "../api/axiosInstance";
// import { toast } from "react-toastify";
// const { Option } = Select;

// const AddOrder = () => {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { refetch } = useOrderData();

//   // Initial form data matches your backend requirements
//   const [formData, setFormData] = useState({
//     carInfo: "",
//     location: "",
//     paymentMethod: "",
//     deposit: "",
//     customerId: "",
//     customerInfo: {
//       name: "",
//       phone: "",
//       email: "",
//       citizenId: "",
//       address: "",
//     },
//     quantity: 1,
//   });

//   const [cars, setCars] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     api.get('/admins/cars?limit=1000')
//       .then(res => {
//         const carList = Array.isArray(res.data) ? res.data : res.data.cars || []
//         setCars(carList);
//       })
//       .catch(() => setCars([]));
//     api.get('/admins/locations')
//       .then(res => {
//         const locationList = Array.isArray(res.data) ? res.data : res.data.locations || []
//         setLocations(locationList);
//       })
//       .catch(() => setLocations([]));
//     api.get('/admins/allcustomer')
//       .then(res => {
//         const customerList = Array.isArray(res.data) ? res.data : res.data.customers || []
//         setCustomers(customerList);
//       })
//       .catch(() => setCustomers([]));
//   }, [])

//   const openModal = () => setOpen(true);
//   const closeModal = () => setOpen(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name in formData.customerInfo) {
//       setFormData((prev) => ({
//         ...prev,
//         customerInfo: { ...prev.customerInfo, [name]: value },
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const getOrCreateCustomerId = async (customerInfo) => {
//     // Try to find customer by citizenId
//     try {
//       const res = await api.get(`/admins/allcustomer`);
//       console.log("Customer API response:", res.data);
//       const customerList = Array.isArray(res.data) ? res.data : [];
//       const found = customerList.find(c => c.email === customerInfo.email);
//       if (found) return found._id;
//       // If not found, create new customer
//       const createRes = await api.post(`/admins/customer`, customerInfo);
//       return createRes.data.customer._id;
//     } catch (err) {
//       toast.error("Failed to find or create customer");
//       throw err;
//     }
//   };

//   const submitForm = async (e) => {
//     e.preventDefault();
//     console.log("Submitting form data:", formData);
//     setLoading(true)
//     try {

//       // const customerId = await getOrCreateCustomerId(formData.customerInfo);
//       let customerId = formData.customerId;
//       // If no customer selected, try to track/create by info
//       if (!customerId) {
//         customerId = await getOrCreateCustomerId(formData.customerInfo);
//       }
//       console.log("Customer ID:", customerId);

//       const payload = {
//         carInfo: formData.carInfo,
//         location: formData.location,
//         paymentMethod: formData.paymentMethod,
//         deposit: Number(formData.deposit),
//         customerId: customerId,
//         customerInfo: {
//           name: formData.customerInfo.name,
//           phone: formData.customerInfo.phone,
//           email: formData.customerInfo.email,
//           citizenId: formData.customerInfo.citizenId,
//           address: formData.customerInfo.address,
//         },
//         quantity: Number(formData.quantity),
//       }

//       await api.post("/admins/orders", payload);
//       toast.success("Order added successfully");
//       console.log("Order added successfully", payload);
//       if (refetch) refetch();
//       closeModal();
//     } catch (err) {
//       toast.error(`Failed to add order: ${err.response?.data?.message || err.message}` || "Unknown error");
//       console.error("Failed to add order", err.response?.data || err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Button type="primary" onClick={openModal}>
//         Add New Order
//       </Button>
//       <Modal
//         title="Add New Order"
//         open={open}
//         onOk={submitForm}
//         onCancel={closeModal}
//         okText="Submit"
//         confirmLoading={loading}
//         width={900}
//       >
//         <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//           <div>
//             <label htmlFor="">Car</label>
//             <Select
//               placeholder="Car"
//               value={formData.carInfo}
//               onChange={(value) => handleSelectChange("carInfo", value)}
//               style={{ width: "100%" }}
//             >
//               <Option value=''>Select Car</Option>
//               {cars.map(car => (
//                 <Option key={car._id} value={car._id}>{car.title}</Option>
//               ))}
//             </Select>
//           </div>
//           <div>
//             <label htmlFor="">Location</label>
//             <Select
//               placeholder="Location"
//               value={formData.location}
//               onChange={(value) => handleSelectChange("location", value)}
//               style={{ width: "100%" }}
//             >
//               <Option value=''>Select Location</Option>
//               {locations.map(location => (
//                 <Option key={location._id} value={location._id}>{location.name}</Option>
//               ))}
//             </Select>
//           </div>
//           <div>
//             <label htmlFor="">Payment Method</label>
//             <Select
//               placeholder="Payment Method"
//               value={formData.paymentMethod}
//               onChange={(value) => handleSelectChange("paymentMethod", value)}
//               style={{ width: "100%" }}
//               defaultValue=""
//             >
//               <Option value=''>Select Payment Method</Option>
//               <Option value="cash">Cash</Option>
//               <Option value="qr">QR</Option>
//               <Option value="bank_transfer">Bank Transfer</Option>
//             </Select>
//           </div>
//           {formData.paymentMethod === "cash" && (
//             <div>
//               <label htmlFor="">Deposit Amount</label>
//               <Input
//                 type="number"
//                 min={0}
//                 placeholder="Deposit Amount"
//                 name="deposit"
//                 value={formData.deposit}
//                 onChange={handleChange}
//               />
//             </div>
//           )}
//           <div>
//             <label htmlFor="">Customer</label>
//             <Select
//               placeholder="Customer"
//               value={formData.customerId}
//               onChange={(value) => handleSelectChange("customerId", value)}
//               style={{ width: "100%" }}
//             >
//               <Option value=''>Select Customer</Option>
//               {customers.map(customer => (
//                 <Option key={customer._id} value={customer._id}>{customer.name}</Option>
//               ))}
//             </Select>
//           </div>
//           <div>
//             <h3 htmlFor="">Customer Information</h3>
//             <div>
//               <label htmlFor="">Full Name</label>
//               <Input
//                 placeholder="Full Name"
//                 name="name"
//                 value={formData.customerInfo.name}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="">Phone Number</label>
//               <Input
//                 placeholder="Phone Number"
//                 name="phone"
//                 value={formData.customerInfo.phone}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="">Email</label>
//               <Input
//                 placeholder="Email"
//                 name="email"
//                 value={formData.customerInfo.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="">Citizen ID</label>
//               <Input
//                 placeholder="Customer Citizen ID"
//                 name="citizenId"
//                 value={formData.customerInfo.citizenId}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label htmlFor="">Address</label>
//               <Input
//                 placeholder="Address"
//                 name="address"
//                 value={formData.customerInfo.address}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//           <div>
//             <label htmlFor="">Quantity</label>
//             <Input
//               type="number"
//               min={1}
//               placeholder="Quantity"
//               name="quantity"
//               value={formData.quantity}
//               onChange={handleChange}
//             />
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default AddOrder;

import { useState, useEffect } from "react";
import { Button, Select, Modal, Input } from "antd";
import useOrderData from "../hooks/useOrderData";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
const { Option } = Select;

const AddOrder = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refetch } = useOrderData();

  // Initial form data matches your backend requirements
  const [formData, setFormData] = useState({
    carInfo: "",
    location: "",
    paymentMethod: "",
    deposit: "",
    customerId: "",
    customerInfo: {
      fullName: "",
      phone: "",
      email: "",
      citizenId: "",
      address: "",
    },
    quantity: 1,
  });

  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    api.get('/admins/cars?limit=1000')
      .then(res => {
        const carList = Array.isArray(res.data) ? res.data : res.data.cars || []
        setCars(carList);
      })
      .catch(() => setCars([]));
    api.get('/admins/locations')
      .then(res => {
        const locationList = Array.isArray(res.data) ? res.data : res.data.locations || []
        setLocations(locationList);
      })
      .catch(() => setLocations([]));
    api.get('/admins/allcustomer')
      .then(res => {
        const customerList = Array.isArray(res.data) ? res.data : res.data.customers || []
        setCustomers(customerList);
      })
      .catch(() => setCustomers([]));
  }, [])

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.customerInfo) {
      setFormData((prev) => ({
        ...prev,
        customerInfo: { ...prev.customerInfo, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCustomerSelect = (value) => {
    const selectedCustomer = customers.find(c => c._id === value);
    setFormData(prev => ({
      ...prev,
      customerId: value,
      customerInfo: selectedCustomer
        ? {
          fullName: selectedCustomer.name, // map 'name' to 'fullName'
          phone: selectedCustomer.phone,
          email: selectedCustomer.email,
          citizenId: selectedCustomer.citizenId,
          address: selectedCustomer.address,
        }
        : {
          fullName: "",
          phone: "",
          email: "",
          citizenId: "",
          address: "",
        }
    }));
  };

  const getOrCreateCustomerId = async (customerInfo) => {
    // Try to find customer by citizenId
    try {
      const res = await api.get(`/admins/allcustomer`);
      console.log("Customer API response:", res.data);
      const customerList = Array.isArray(res.data) ? res.data : [];
      const found = customerList.find(c => c.email === customerInfo.email);
      if (found) return found._id;
      // If not found, create new customer
      const createRes = await api.post(`/admins/customer`, customerInfo);
      return createRes.data.customer._id;
    } catch (err) {
      toast.error("Failed to find or create customer");
      throw err;
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let customerId = formData.customerId;
      if (!customerId) {
        customerId = await getOrCreateCustomerId(formData.customerInfo);
      }
      console.log("Customer ID:", customerId);
      const payload = {
        carInfo: formData.carInfo,
        location: formData.location,
        paymentMethod: formData.paymentMethod,
        deposit: Number(formData.deposit),
        customerId,
        customerInfo: { ...formData.customerInfo },
        quantity: Number(formData.quantity),
      };
      await api.post("/admins/orders", payload);
      toast.success("Order added successfully");
      if (refetch) refetch();
      closeModal();
    } catch (err) {
      toast.error(`Failed to add order: ${err.response?.data?.message || err.message}` || "Unknown error");
      console.error("Failed to add order", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={openModal}>
        Add New Order
      </Button>
      <Modal
        title="Add New Order"
        open={open}
        onOk={submitForm}
        onCancel={closeModal}
        okText="Submit"
        confirmLoading={loading}
        width={900}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label htmlFor="">Car</label>
            <Select
              placeholder="Car"
              value={formData.carInfo}
              onChange={(value) => handleSelectChange("carInfo", value)}
              style={{ width: "100%" }}
            >
              <Option value=''>Select Car</Option>
              {cars.map(car => (
                <Option key={car._id} value={car._id}>{car.title}</Option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="">Location</label>
            <Select
              placeholder="Location"
              value={formData.location}
              onChange={(value) => handleSelectChange("location", value)}
              style={{ width: "100%" }}
            >
              <Option value=''>Select Location</Option>
              {locations.map(location => (
                <Option key={location._id} value={location._id}>{location.name}</Option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="">Payment Method</label>
            <Select
              placeholder="Payment Method"
              value={formData.paymentMethod}
              onChange={(value) => handleSelectChange("paymentMethod", value)}
              style={{ width: "100%" }}
              defaultValue=""
            >
              <Option value=''>Select Payment Method</Option>
              <Option value="cash">Cash</Option>
              <Option value="qr">QR</Option>
              <Option value="bank_transfer">Bank Transfer</Option>
            </Select>
          </div>
          {formData.paymentMethod === "cash" && (
            <div>
              <label htmlFor="">Deposit Amount</label>
              <Input
                type="number"
                min={0}
                placeholder="Deposit Amount"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
              />
            </div>
          )}
          <div>
            <label htmlFor="">Customer</label>
            <Select
              placeholder="Customer"
              value={formData.customerId}
              onChange={(value) => handleSelectChange("customerId", value)}
              style={{ width: "100%" }}
            >
              <Option value=''>Select Customer</Option>
              {customers.map(customer => (
                <Option key={customer._id} value={customer._id}>{customer.name}</Option>
              ))}
            </Select>
          </div>
          <div>
            <h3 htmlFor="">Customer Information</h3>
            <div>
              <label htmlFor="">Full Name</label>
              <Input
                placeholder="Full Name"
                name="fullName"
                value={formData.customerInfo.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="">Phone Number</label>
              <Input
                placeholder="Phone Number"
                name="phone"
                value={formData.customerInfo.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="">Email</label>
              <Input
                placeholder="Email"
                name="email"
                value={formData.customerInfo.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="">Citizen ID</label>
              <Input
                placeholder="Customer Citizen ID"
                name="citizenId"
                value={formData.customerInfo.citizenId}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="">Address</label>
              <Input
                placeholder="Address"
                name="address"
                value={formData.customerInfo.address}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="">Quantity</label>
            <Input
              type="number"
              min={1}
              placeholder="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddOrder;