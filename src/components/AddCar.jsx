import { useState, useEffect } from "react";
import { Button, Select, Modal, Input } from "antd";
import { toast } from "react-toastify";
const { Option } = Select;
import useCarData from "../hooks/useCarData";
import useBrandData from "../hooks/useBrandData";
import useLocationData from "../hooks/useLocationData";

const AddCar = () => {
  const [open, setOpen] = useState(false);
  const { refetch } = useCarData();
  const { brands, loading } = useBrandData();
  const { locations } = useLocationData();
  const openModal = () => setOpen(true);
  const [formData, setFormData] = useState({
    title: "",
    brandId: "",
    model: "",
    carType: "",
    exteriorColor: [],
    seats: "",
    length: "",
    width: "",
    height: "",
    image: [],
    fuelType: "",
    fuelconsumsion: "",
    tranmission: "",
    power: "",
    price: "",
    registrationYear: "",
    stock: "",
    locationId: "",
    description: "",
  });

  const carTypeOptions = ["Sedan", "SUV", "Hatchback", "Pickup", "MPV"];
  const seatOptions = ["2", "4", "5", "7"];
  const fuelTypeOptions = ["Gasoline", "Electric", "Diesel", "Hybrid"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("Submitting car:", formData);
    try {
      const res = await instance.post("/admins/cars", formData)
      console.log("Car added successfully:", res.data);
      toast.success("Car added successfully")
      refetch()
      setOpen(false)
    } catch (error) {
      toast.error("Failed to add car")
      console.error("Error adding car:", error);
    }
  }

  return (
    <>
      <Button type="primary" onClick={openModal}>
        Add New Car
      </Button>
      <Modal
        title="Add New Car"
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText="Submit"
        width={900}
        className="overflow-hidden"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label htmlFor="">Title</label>
              <Input
                placeholder="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label>Brand</label>
              <Select
                placeholder="Brand"
                name="brandId"
                value={formData.brandId}
                onChange={value => setFormData(prev => ({ ...prev, brandId: value }))}
                style={{ width: "100%" }}
                loading={loading}
              >
                {brands.map(brand => (
                  <Option key={brand._id} value={brand._id}>{brand.name}</Option>
                ))}
              </Select>
            </div>
            <div className="w-1/3">
              <label htmlFor="">Model</label>
              <Input
                placeholder="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/2">
              <label htmlFor="">Car Type</label>
              <Select
                placeholder="Car Type"
                name="carType"
                value={formData.carType}
                onChange={(value) => handleSelectChange("carType", value)}
                style={{ width: "100%" }}
              >
                {carTypeOptions.map((type) => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </div>
            <div className="w-1/2">
              <label htmlFor="">Exterior Color</label>
              <Input
                placeholder="Exterior Color"
                name="exteriorColor"
                value={formData.exteriorColor}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label htmlFor="">Length</label>
              <Input
                placeholder="Length"
                name="length"
                value={formData.length}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="">Width</label>
              <Input
                placeholder="Width"
                name="width"
                value={formData.width}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="">Height</label>
              <Input
                placeholder="Height"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3 flex flex-col">
              <label htmlFor="">Image (max 9 pictures)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                name="image" 
                value={formData.image} 
                onChange={handleChange}
                className="rounded-xl border-2" />
            </div>
            <div className="w-1/3">
              <label htmlFor="">Fuel Type</label>
              <Select
                placeholder="Fuel Type"
                name="fuelType"
                value={formData.fuelType}
                onChange={(value) => handleSelectChange("fuelType", value)}
                style={{ width: "100%" }}
              >
                {fuelTypeOptions.map((type) => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col w-1/3">
              <label htmlFor="">Fuel Consumption</label>
              <div className="flex gap-2">
                <Input placeholder="Fuel Consumption" name="fuelconsumsion" value={formData.fuelconsumsion} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <p>Transmission</p>
              <Select
                placeholder="Transmission"
                name="tranmission"
                value={formData.tranmission}
                onChange={(value) => handleSelectChange("tranmission", value)}
                style={{ width: "100%" }}
              >
                <Option value="manual">Manual</Option>
                <Option value="automatic">Automatic</Option>
              </Select>
            </div>
            <div className="w-1/3">
              <label htmlFor="">Power</label>
              <Input
                placeholder="Power"
                name="power"
                value={formData.power}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <p>Seats</p>
              <Select
                placeholder="Seats"
                name="seats"
                value={formData.seats}
                onChange={(value) => handleSelectChange("seats", value)}
                style={{ width: "100%" }}
              >
                {seatOptions.map((seat) => (
                  <Option key={seat} value={seat}>{seat}</Option>
                ))}
              </Select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label htmlFor="">Price</label>
              <Input
                placeholder="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="">Registration Year</label>
              <Input
                placeholder="Registration Year"
                name="registrationYear"
                value={formData.registrationYear}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label htmlFor="">Stock</label>
              <Input
                placeholder="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label>Location</label>
              <Select
                placeholder="Location"
                name="locationId"
                value={formData.locationId}
                onChange={value => setFormData(prev => ({ ...prev, locationId: value }))}
                style={{ width: "100%" }}
                loading={loading}
              >
                {locations.map(loc => (
                  <Option key={loc._id} value={loc._id}>{loc.name}</Option>
                ))}
              </Select>
            </div>
          </div>
          <Input.TextArea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </Modal>
    </>
  );
};

export default AddCar;