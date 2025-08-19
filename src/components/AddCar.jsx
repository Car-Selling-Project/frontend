import { useState, useEffect } from "react";
import { Button, Select, Modal, Input } from "antd";
import { toast } from "react-toastify";
const { Option } = Select;
import useCarData from "../hooks/useCarData";
import api from '../api/axiosInstance';

const AddCar = () => {
  const [open, setOpen] = useState(false);
  const { refetch } = useCarData();
  const [formData, setFormData] = useState({
    title: "",
    brandId: "",
    model: "",
    carType: "",
    exteriorColor: [],
    seat: "",
    dimension: { length: "", width: "", height: "" },
    engine: { power: "", fuelconsumsion: "" },
    images: [],
    fuelType: "",
    tranmission: "",
    price: "",
    registrationYear: "",
    stock: "",
    locationId: "",
    description: "",
  });

  const carTypeOptions = ["Sedan", "SUV", "Hatchback", "Pickup", "MPV"];
  const seatOptions = ["2", "4", "5", "7"];
  const fuelTypeOptions = ["Gasoline", "Electric", "Diesel", "Hybrid"];

  const openModal = () => setOpen(true);

  const [brands, setBrands] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api.get('/admins/brands')
      .then(res => {
        const brandList = Array.isArray(res.data) ? res.data : res.data.brands || [];
        setBrands(brandList);
      })
      .catch(() => setBrands([]));
    api.get('/admins/locations')
      .then(res => {
        const locationList = Array.isArray(res.data) ? res.data : res.data.locations || [];
        setLocations(locationList);
      })
      .catch(() => setLocations([]));
  }, []);

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExteriorColorChange = (value) => {
    setFormData((prev) => ({ ...prev, exteriorColor: value }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["length", "width", "height"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        dimension: {
          ...prev.dimension,
          [name]: value,
        },
      }));
    } else if (["power", "fuelconsumsion"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        engine: {
          ...prev.engine,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // ép kiểu number cho các field numeric
      const payload = {
        title,
        brandId,
        model,
        carType,
        description,
        dimension: {
          height: Number(height),
          length: Number(length),
          width: Number(width),
        },
        engine: {
          fuelConsumption,
          power,
        },
        exteriorColor, // mảng string
        fuelType,
        locationId,
        price: Number(price),
        registrationYear: Number(registrationYear),
        seat: Number(seat),
        stock: Number(stock),
        transmission,
      };

      // append object payload vào FormData
      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === "object" && !Array.isArray(payload[key])) {
          // nested object (dimension, engine)
          Object.keys(payload[key]).forEach((subKey) => {
            formData.append(`${key}[${subKey}]`, payload[key][subKey]);
          });
        } else if (Array.isArray(payload[key])) {
          payload[key].forEach((val) => formData.append(`${key}[]`, val));
        } else {
          formData.append(key, payload[key]);
        }
      });

      // append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      await axios.post("http://localhost:3001/admins/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Car added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error adding car");
    }
  };

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
              <label>Title</label>
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
                style={{ width: "100%" }}
                placeholder="Brand"
                name="brandId"
                value={formData.brandId}
                onChange={value => handleSelectChange("brandId", value)}
                defaultValue=""
              >
                <Option value="">Select Brand</Option>
                {brands.map(brand => (
                  <Option key={brand._id} value={brand._id}>{brand.name}</Option>
                ))}
              </Select>
            </div>
            <div className="w-1/3">
              <label>Model</label>
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
              <label>Car Type</label>
              <Select
                placeholder="Car Type"
                name="carType"
                value={formData.carType}
                onChange={(value) => handleSelectChange("carType", value)}
                style={{ width: "100%" }}
              >
                <Option value="">Select Car Type</Option>
                {carTypeOptions.map((type) => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </div>
            <div className="w-1/2">
              <label>Exterior Color</label>
              <Select
                mode="tags"
                placeholder="Exterior Color"
                name="exteriorColor"
                value={formData.exteriorColor}
                onChange={handleExteriorColorChange}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label>Length</label>
              <Input
                placeholder="Length"
                name="length"
                value={formData.dimension.length}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label>Width</label>
              <Input
                placeholder="Width"
                name="width"
                value={formData.dimension.width}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label>Height</label>
              <Input
                placeholder="Height"
                name="height"
                value={formData.dimension.height}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3 flex flex-col">
              <label>Image (max 9 pictures)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                name="images"
                onChange={handleImageChange}
                className="rounded-xl border-2"
              />
            </div>
            <div className="w-1/3">
              <label>Fuel Type</label>
              <Select
                placeholder="Fuel Type"
                name="fuelType"
                value={formData.fuelType}
                onChange={(value) => handleSelectChange("fuelType", value)}
                style={{ width: "100%" }}
              >
                <Option value="">Select Fuel Type</Option>
                {fuelTypeOptions.map((type) => (
                  <Option key={type} value={type}>{type}</Option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col w-1/3">
              <label>Fuel Consumption</label>
              <Input
                placeholder="Fuel Consumption"
                name="fuelconsumsion"
                value={formData.engine.fuelconsumsion}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label>Transmission</label>
              <Select
                placeholder="Transmission"
                name="tranmission"
                value={formData.tranmission}
                onChange={(value) => handleSelectChange("tranmission", value)}
                style={{ width: "100%" }}
              >
                <Option value="">Select Transmission</Option>
                <Option value="Manual">Manual</Option>
                <Option value="Automatic">Automatic</Option>
              </Select>
            </div>
            <div className="w-1/3">
              <label>Power</label>
              <Input
                placeholder="Power"
                name="power"
                value={formData.engine.power}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label>Seats</label>
              <Select
                placeholder="Seats"
                name="seat"
                value={formData.seat}
                onChange={(value) => handleSelectChange("seat", value)}
                style={{ width: "100%" }}
              >
                <Option value="">Select Seats</Option>
                {seatOptions.map((seat) => (
                  <Option key={seat} value={seat}>{seat}</Option>
                ))}
              </Select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label>Price</label>
              <Input
                placeholder="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label>Registration Year</label>
              <Input
                placeholder="Registration Year"
                name="registrationYear"
                value={formData.registrationYear}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/3">
              <label>Stock</label>
              <Input
                placeholder="Stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label>Location</label>
              <Select
                placeholder="Location"
                name="locationId"
                value={formData.locationId}
                onChange={value => setFormData(prev => ({ ...prev, locationId: value }))}
                style={{ width: "100%" }}
                defaultValue=""
              >
                <Option value="">Select Location</Option>
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