import React, { useMemo } from "react";
import { Select } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Option } = Select;

const TransmissionFilter = ({ cars, tranmissions, setTranmissions }) => { 
  const types = useMemo(() => {
    const seen = new Set();
    for (let car of cars) {
      if (car.tranmission) {
        seen.add(car.tranmission);
      }
    }
    return Array.from(seen);
  }, [cars]);

  return (
    <Select
      allowClear
      value={tranmissions || undefined} 
      onChange={setTranmissions} 
      className="w-full !rounded-2xl"
      placeholder="Transmission"
      suffixIcon={<SettingOutlined />}
    >
      {types.map((t) => (
        <Option key={t} value={t}>
          {t}
        </Option>
      ))}
    </Select>
  );
};

export default TransmissionFilter;