import React, { useMemo } from "react";
import { Select } from "antd";
const { Option } = Select;
import { TbBrandVolkswagen } from "react-icons/tb";

const BrandFilter = ({ cars, brandId, setBrandId }) => {
  const brands = useMemo(() => {
    const seen = new Map();
    for (let car of cars) {
      if (car.brandId && !seen.has(car.brandId._id)) {
        seen.set(car.brandId._id, car.brandId.name);
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ _id: id, name }));
  }, [cars]);

  return (
    <Select
      allowClear
      placeholder="Select Brand"
      className="w-full"
      value={brandId || undefined}
      onChange={(value) => setBrandId(value)}
      suffixIcon={<TbBrandVolkswagen className="text-gray-500 h-5 w-5" />}
    >
      {brands.map((brand) => (
        <Option key={brand._id} value={brand._id}>
          {brand.name}
        </Option>
      ))}
    </Select>
  );
};

export default BrandFilter;
