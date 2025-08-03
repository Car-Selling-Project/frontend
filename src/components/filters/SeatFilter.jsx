import React from "react";
import { Checkbox } from "antd";

const SeatFilter = ({ selectedSeats, setSelectedSeats }) => {
  const seatOptions = Array.from({ length: 6 }, (_, i) => ({
    label: `${i + 2} seats`,
    value: i + 2,
  }));

  return (
    <div>
      <Checkbox.Group
        options={seatOptions}
        value={selectedSeats}
        onChange={setSelectedSeats}
        className="flex flex-wrap gap-2 dark:text-white"
      />
    </div>
  );
};

export default SeatFilter;