import { useState, useEffect } from "react";
import { Button, Select, Modal, Input } from "antd";
import useOrderData from "../hooks/useOrderData";
import axios from "../api/axiosInstance";
import { toast } from "react-toastify";
const { Option } = Select;

const AddOrder = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { refetch } = useOrderData();

  const [formData, setFormData] = useState({
    carInfo: "",
    location: "",
    paymentMethod: "",
    deposit: "",
    customerId: "",
    quantity: 1,
  });

  const [cars, setCars] = useState([]);
  const [locations, setLocations] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch cars and locations
  useEffect(() => {
    axios.get('/admins/cars?limit=1000')
      .then(res => {
        const carList = Array.isArray(res.data) ? res.data : res.data.cars || [];
        setCars(carList);
      })
      .catch(() => setCars([]));

    axios.get('/admins/locations')
      .then(res => {
        const locationList = Array.isArray(res.data) ? res.data : res.data.locations || [];
        setLocations(locationList);
      })
      .catch(() => setLocations([]));

    // Fetch customers
    axios.get("/admins/orders/customers")
      .then(res => setCustomers(res.data.customers || []))
      .catch(() => setCustomers([]));
  }, []);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitForm = async () => {
    if (!formData.customerId) {
      toast.error("Please select a customer");
      return;
    }
    if (!formData.carInfo) {
      toast.error("Please select a car");
      return;
    }
    if (!formData.location) {
      toast.error("Please select a location");
      return;
    }
    if (!formData.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        carInfo: formData.carInfo,
        location: formData.location,
        paymentMethod: formData.paymentMethod,
        deposit: formData.deposit ? Number(formData.deposit) : 0,
        customerId: formData.customerId,
        quantity: Number(formData.quantity),
      };

      await axios.post("/admins/orders", payload);
      toast.success("Order added successfully");
      if (refetch) refetch();
      closeModal();
    } catch (err) {
      console.error("Failed to add order", err);
      toast.error("Failed to add order");
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
            <label>Customer</label>
            <Select
              placeholder="Select Customer"
              value={formData.customerId}
              onChange={(value) => handleSelectChange("customerId", value)}
              style={{ width: "100%" }}
            >
              <Option value=''>Select Customer</Option>
              {customers.map(c => (
                <Option key={c._id} value={c._id}>
                  {c.fullName} - {c.phone}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label>Car</label>
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
            <label>Location</label>
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
            <label>Payment Method</label>
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
              <label>Deposit Amount</label>
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
            <label>Quantity</label>
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