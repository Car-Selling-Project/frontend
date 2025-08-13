import React from "react";
import { Select } from "antd";
const { Option } = Select;
import { FaCarSide } from "react-icons/fa";

const ModelFilter = ({ cars, model, setModel }) => {
  const uniqueModels = [...new Set(cars.map((car) => car.model).filter(m => m && m.trim()))]; // Lọc bỏ giá trị null/rỗng

  return (
    <Select
      allowClear
      placeholder="Select Model"
      className="w-full !rounded-2xl"
      value={model || undefined}
      onChange={(value) => setModel(value)}
      suffixIcon={<FaCarSide className="text-gray-500 w-5 h-5" />}
    >
      {uniqueModels.map((m) => (
        <Option key={m} value={m}>
          {m}
        </Option>
      ))}
    </Select>
  );
};

export default ModelFilter;