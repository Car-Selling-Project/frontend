import React from "react";
import { Checkbox } from "antd";

const StockFilter = ({ inStockOnly, setInStockOnly }) => {
  return (
    <Checkbox
      checked={inStockOnly}
      onChange={(e) => setInStockOnly(e.target.checked)}
    >
      In Stock Only
    </Checkbox>
  );
};

export default StockFilter;