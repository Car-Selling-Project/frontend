import React, { useMemo } from "react";
import { Select } from "antd";
const { Option } = Select;

const ExteriorColorFilter = ({ cars, color, setColor }) => {
  // Lấy danh sách màu duy nhất từ exteriorColor của các xe
  const colors = useMemo(() => {
    const allColors = new Set();
    cars.forEach((car) => {
      if (car.exteriorColor && Array.isArray(car.exteriorColor)) {
        car.exteriorColor.forEach((c) => allColors.add(c));
      }
    });
    return Array.from(allColors);
  }, [cars]);

  return (
    <Select
      mode="multiple" // Thêm multi-select
      allowClear
      value={color || []} // Giá trị là mảng
      onChange={setColor} // Cập nhật mảng
      className="w-full !rounded-2xl"
      placeholder="Exterior Color"
    >
      {colors.map((c) => (
        <Option key={c} value={c}>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: c === "Black" ? "#000" : c === "White" ? "#fff" : c === "Red" ? "#f00" : c === "Gray" ? "#808080" : "#ccc", border: "1px solid black" }}
            ></span>
            {c}
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default ExteriorColorFilter;