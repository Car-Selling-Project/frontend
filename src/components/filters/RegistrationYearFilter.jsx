import React from "react";
import { Slider } from "antd";

const RegistrationYearFilter = ({ yearRange, setYearRange }) => {
  return (
    <div>
      <Slider
        range
        min={1986}
        max={new Date().getFullYear()}
        value={yearRange}
        onChange={setYearRange}
      />
    </div>
  );
};

export default RegistrationYearFilter;