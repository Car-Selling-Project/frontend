import React, { useMemo } from "react";
import { Select } from "antd";
const { Option } = Select;
import { CarOutlined } from "@ant-design/icons";

const CarTypeFilter = ({ cars, carType, setCarType }) => {
  const carTypes = useMemo(() => {
    const seen = new Map();
    for (let car of cars) {
      if (car.carType && !seen.has(car.carType)) {
        seen.set(car.carType, car.carType); 
      }
    }
    return Array.from(seen.entries()).map(([value]) => value); 
  }, [cars]);

  return (
    <Select
      allowClear
      value={carType || undefined}
      onChange={(value) => setCarType(value)} 
      className="w-full !rounded-2xl"
      placeholder="Select Car Type"
      suffixIcon={<CarOutlined />}
    >
      {carTypes.map((type) => (
        <Option key={type} value={type}>
          {type}
        </Option>
      ))}
    </Select>
  );
};

export default CarTypeFilter;