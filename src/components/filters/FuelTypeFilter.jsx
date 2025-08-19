import React, { useMemo } from "react";
import { Select } from "antd";
const { Option } = Select;
import { ThunderboltOutlined } from "@ant-design/icons";

const FuelTypeFilter = ({ cars, fuelType, setFuelType }) => {
  const fuelTypes = useMemo(() => {
    const seen = new Map();
    for (let car of cars) {
      if (car.fuelType && !seen.has(car.fuelType)) {
        seen.set(car.fuelType, car.fuelType);
      }
    }
    return Array.from(seen.entries()).map(([value]) => value);
  }, [cars]);

  return (
    <Select
      allowClear
      value={fuelType || undefined}
      onChange={(value) => setFuelType(value)}
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