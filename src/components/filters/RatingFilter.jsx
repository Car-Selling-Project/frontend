import React from "react";
import { Rate } from "antd";

const RatingFilter = ({ minRating, setMinRating }) => {
  return (
    <div className="flex flex-col">
      <Rate
        allowClear
        value={minRating}
        onChange={setMinRating}
      />
    </div>
  );
};

export default RatingFilter;