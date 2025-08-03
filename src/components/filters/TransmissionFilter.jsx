import React from "react";
import { Select } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Option } = Select;

const TransmissionFilter = ({ tranmission, setTranmission }) => {
  const types = ["Manual", "Automatic"];

  return (
    <Select
      allowClear
      value={tranmission || undefined}
      onChange={setTranmission}
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