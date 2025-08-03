import React from "react";
import { Select } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

const { Option } = Select;

const FuelTypeFilter = ({ fuelType, setFuelType }) => {
  const fuelTypes = ["Gasoline", "Diesel", "Electric", "Hybrid"];

  return (
    <Select
      allowClear
      value={fuelType || undefined}
      onChange={setFuelType}
      className="w-full !rounded-2xl"
      placeholder="Fuel Type"
      suffixIcon={<ThunderboltOutlined />}
    >
      {fuelTypes.map((type) => (
        <Option key={type} value={type}>
          {type}
        </Option>
      ))}
    </Select>
  );
};

export default FuelTypeFilter;