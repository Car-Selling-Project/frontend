import { useState } from "react";
import { Button, Select, Modal, Input, Radio, Rate, Checkbox } from "antd";
const { Option } = Select;

const AddCar = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    image: "",
    steering: "manual",
    capacity: "2",
    originalPrice: "",
    discountedPrice: "",
    rating: 0,
    location: "danang",
    dateAvailable: "",
    description: "",
    popular: false,
  });

  const openModal = () => {
    setOpen(true);
  };

  const submitForm = () => {
    // Logic to submit the form goes here
    console.log("Form submitted", formData);
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (value) => {
    setFormData((prev) => ({ ...prev, rating: value }));
  };

  return (
    <>
      <Button type="primary" onClick={openModal}>
        Add New Car
      </Button>
      <Modal
        title="Add New Car"
        open={open}
        onOk={submitForm}
        onCancel={() => setOpen(false)}
        okText="Submit"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/2">
              <label htmlFor="">Title</label>
              <Input
                placeholder="Title"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="">Car Type</label>
              <Select
                placeholder="Car Type"
                name="type"
                // value={formData.type}
                // onChange={(value) => handleSelectChange("type", value)}
                style={{ width: "100%" }}
              >
                <Option value="sedan">Sedan</Option>
                <Option value="suv">SUV</Option>
                <Option value="hatchback">Hatchback</Option>
                <Option value="pickup">Pickup</Option>
                <Option value="mpv">MPV</Option>
              </Select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/3">
              <label htmlFor="">Brand</label>
              <Select
                placeholder="Brand"
                name="brand"
                // value={formData.brand}
                // onChange={(value) => handleSelectChange("brand", value)}
                style={{ width: "100%" }}
              >
                <Option value="nissan">Nissan</Option>
                <Option value="toyota">Toyota</Option>
                <Option value="honda">Honda</Option>
                <Option value="ford">Ford</Option>
                <Option value="bmw">BMW</Option>
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
            <div className="w-1/3">
              <label htmlFor="">Fuel Type</label>
              <Select
                placeholder="Brand"
                name="brand"
                // value={formData.brand}
                // onChange={(value) => handleSelectChange("brand", value)}
                style={{ width: "100%" }}
              >
                <Option value="gasoline">Gasoline</Option>
                <Option value="electric">Electric</Option>
                <Option value="diesel">Diesel</Option>
                <Option value="hybrid">Hybrid</Option>
              </Select>
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/2">
              <label htmlFor="">Image (max 9 pictures)</label>
              <Button>
                Add Image
              </Button>
            </div>
            <div className="flex flex-col w-1/2">
              <label htmlFor="">Gasoline</label>
              <div className="flex gap-2">
                <Input placeholder="Gasoline" name="image" value={formData.image} onChange={handleChange} />
                <Select
                  placeholder="Gasoline"
                  name="type"
                  // value={formData.type}
                  // onChange={(value) => handleSelectChange("type", value)}
                  style={{ width: "100%" }}
                >
                  <Option value="kph">Km/L</Option>
                  <Option value="kwh">Km/KwH</Option>
                </Select>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/2">
              <p>Steering</p>
              <Radio.Group
                name="steering"
                value={formData.steering}
                onChange={handleChange}
              >
                <div className="flex flex-col gap-2">
                  <Radio value="manual">Manual</Radio>
                <Radio value="automatic">Automatic</Radio>
                </div>
              </Radio.Group>
            </div>
            <div className="w-1/2">
              <p>Capacity</p>
              <Radio.Group
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
              >
                <div className="flex flex-col gap-2">
                  <Radio value="2">2 People</Radio>
                  <Radio value="4">4 People</Radio>
                  <Radio value="5">5 People</Radio>
                  <Radio value="7">7 People</Radio>
                  <Radio value="8">8 People</Radio>
                </div>
              </Radio.Group>
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-3/5">
              <label htmlFor="">Price</label>
              <Input
                placeholder="Price"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
              />
            </div>
            <div className="w-2/5">
              <label htmlFor="">Registration Year</label>
              <Input
                placeholder="Registration Year"
                name="registrationYear"
                // value={formData.registrationYear}
                onChange={handleChange}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", width: "100%" }}>
            <div className="w-1/2">
              <p>Rating</p>
              <Rate value={formData.rating} onChange={handleRatingChange} />
            </div>
            <div className="w-1/2">
              <label htmlFor="">Location</label>
              <Select
                placeholder="Location"
                name="location"
                value={formData.location}
                onChange={(value) => handleSelectChange("location", value)}
                style={{ width: "100%" }}
              >
                <Option value="hanoi">Hanoi</Option>
                <Option value="hochiminhcity">Ho Chi Minh City</Option>
                <Option value="hue">Hue</Option>
                <Option value="danang">Danang</Option>
              </Select>
            </div>
          </div>
          <Input.TextArea
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Checkbox
            name="popular"
            checked={formData.popular}
            onChange={handleChange}
          >
            Popular
          </Checkbox>
        </div>
      </Modal>
    </>
  );
};

export default AddCar;