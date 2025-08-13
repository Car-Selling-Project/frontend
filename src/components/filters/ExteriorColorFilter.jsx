import React from "react";
import { Select } from "antd";

const { Option } = Select;

const colorMap = {
  Black: "#000",
  White: "#fff",
  Red: "#f00",
  Gray: "#808080"
};

const ExteriorColorFilter = ({ color, setColor }) => {
  const colors = Object.keys(colorMap);

  return (
    <Select
      allowClear
      value={color || undefined}
      onChange={setColor}
      className="w-full !rounded-2xl"
      placeholder="Exterior Color"
    >
      {colors.map((c) => (
        <Option key={c} value={c}>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: colorMap[c] }}
            ></span>
            {c}
          </div>
        </Option>
      ))}
    </Select>
  );
};

export default ExteriorColorFilter;