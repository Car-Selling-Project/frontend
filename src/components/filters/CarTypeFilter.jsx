import React from "react";
import { Select } from "antd";
import { CarOutlined } from "@ant-design/icons";

const { Option } = Select;

const CarTypeFilter = ({ carType, setCarType }) => {
  const types = ["Sedan", "SUV", "Hatchback", "Pickup", "MPV"];

  return (
    <Select
      allowClear
      value={carType || undefined}
      onChange={setCarType}
      className="w-full !rounded-2xl"
      placeholder="Car Type"
      suffixIcon={<CarOutlined />}
    >
      {types.map((type) => (
        <Option key={type} value={type}>
          {type}
        </Option>
      ))}
    </Select>
  );
};

export default CarTypeFilter;