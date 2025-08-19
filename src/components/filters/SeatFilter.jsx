import React from "react";
import { Checkbox } from "antd";

const SeatFilter = ({ selectedSeat, setSelectedSeat }) => { 
  const seatOptions = Array.from({ length: 6 }, (_, i) => ({
    label: `${i + 2} seats`,
    value: i + 2,
  }));

  return (
    <div>
      <Checkbox.Group
        options={seatOptions}
        value={selectedSeat || []} 
        onChange={setSelectedSeat}
        className="flex flex-wrap gap-2 dark:text-white"
      />
    </div>
  );
};

export default SeatFilter;