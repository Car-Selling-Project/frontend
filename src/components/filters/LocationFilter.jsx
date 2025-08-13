import React, { useMemo } from "react";
import { Select } from "antd";
const { Option } = Select;
import { HiLocationMarker } from "react-icons/hi";

const LocationFilter = ({ cars, locationId, setLocationId }) => {
  const locations = useMemo(() => {
    const seen = new Map();
    for (let car of cars) {
      if (car.locationId && !seen.has(car.locationId._id)) {
        seen.set(car.locationId._id, car.locationId.name);
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ _id: id, name }));
  }, [cars]);

  return (
    <Select
      allowClear
      placeholder="Select Location"
      className="w-full"
      value={locationId || undefined}
      onChange={(value) => setLocationId(value)}
      suffixIcon={<HiLocationMarker className="text-gray-500 h-5 w-5" />}
    >
      {locations.map((loc) => (
        <Option key={loc._id} value={loc._id}>
          {loc.name}
        </Option>
      ))}
    </Select>
  );
};

export default LocationFilter;
