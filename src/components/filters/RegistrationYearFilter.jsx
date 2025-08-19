import React from "react";
import { Slider } from "antd";

const RegistrationYearFilter = ({ registrationYear, setRegistrationYear }) => { 
  return (
    <div>
      <Slider
        range
        min={1986}
        max={new Date().getFullYear()}
        value={registrationYear}
        onChange={setRegistrationYear}
      />
    </div>
  );
};

export default RegistrationYearFilter;