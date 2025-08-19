import React, { useMemo } from "react";
import { Select } from "antd";
const { Option } = Select;
import { FaCarSide } from "react-icons/fa";

const ModelFilter = ({ cars, model, setModel }) => {
  const models = useMemo(() => {
    const seen = new Map();
    for (let car of cars) {
      if ( car.model && !seen.has(car.model)) {
        seen.set(car.model, car.model);
      }
    }
    return Array.from(seen.entries()).map(([value]) => value);
  }, [cars]);

  return (
    <Select
      allowClear
      placeholder="Select Model"
      className="w-full !rounded-2xl"
      value={model || undefined}
      onChange={(value) => setModel(value)}
      suffixIcon={<FaCarSide className="text-gray-500 w-5 h-5" />}
    >
      {models.map((m) => (
        <Option key={m} value={m}>
          {m}
        </Option>
      ))}
    </Select>
  );
};

export default ModelFilter;