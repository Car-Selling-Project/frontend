import React, { useState } from "react"
import { CarOutlined, CloseOutlined } from "@ant-design/icons"
import { Button, Select } from "antd"
import useCarData from "../../hooks/useCarData"
import CarCard from "../../components/CarCard"

const { Option } = Select

const Comparison = () => {
  const { cars, loading } = useCarData()
  const [selectedCars, setSelectedCars] = useState([null, null])
  const [comparisonData, setComparisonData] = useState([null, null])

  // Handle car selection
  const handleCarSelect = (carId, index) => {
    const car = cars.find((c) => c._id === carId)
    if (car) {
      const newSelectedCars = [...selectedCars]
      const newComparisonData = [...comparisonData]
      newSelectedCars[index] = carId
      newComparisonData[index] = car
      setSelectedCars(newSelectedCars)
      setComparisonData(newComparisonData)
    }
  }

  // Remove car
  const removeCar = (index) => {
    const newSelectedCars = [...selectedCars]
    const newComparisonData = [...comparisonData]
    newSelectedCars[index] = null
    newComparisonData[index] = null
    setSelectedCars(newSelectedCars)
    setComparisonData(newComparisonData)
  }

  // Safe render property
  const renderCarProperty = (car, property, nested = null) => {
    if (!car) return "N/A"
    let value = car[property]
    if (nested && value) value = value[nested]
    if (Array.isArray(value)) {
      if (value.length === 0) return "N/A"
      return value
        .map((item) =>
          typeof item === "object" && item !== null
            ? item.name || item._id || "Unknown"
            : item
        )
        .join(", ")
    }
    if (typeof value === "object" && value !== null) {
      return value.name || value._id || "N/A"
    }
    return value || "N/A"
  }

  if (loading) {
    return <div className="text-center py-10">Loading cars...</div>
  }

  return (
    <main className="w-full h-full flex flex-col items-center">
      <div className="w-full flex flex-col">
        <div className="header flex items-center justify-start p-4">
          <h1 className="font-bold dark:text-white text-3xl">
            Car Comparison
          </h1>
        </div>

        {/* Car pickers */}
        <div className="compare w-full flex justify-around">
          {[0, 1].map((index) => (
            <div key={index} className="w-1/2 flex justify-center">
              {comparisonData[index] ? (
                <div className="relative bg-white rounded-2xl p-6 m-6">
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onClick={() => removeCar(index)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                  />
                  <div className="w-full flex justify-center">
                    <CarCard car={comparisonData[index]} />
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 m-6 min-h-[300px] flex flex-col items-center justify-center">
                  <Select
                    placeholder="Pick a car to compare"
                    style={{ width: 250, marginBottom: 20 }}
                    onChange={(value) => handleCarSelect(value, index)}
                    showSearch
                    optionFilterProp="children"
                  >
                    {cars
                      .filter((car) => car._id !== selectedCars[1 - index])
                      .map((car) => (
                        <Option key={car._id} value={car._id}>
                          {car.title} - ${car.price}
                        </Option>
                      ))}
                  </Select>
                  <CarOutlined style={{ fontSize: 48, color: "#ccc" }} />
                  <p>Add car to compare</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison details */}
      <div className="middle w-full flex flex-col">
        {(comparisonData[0] || comparisonData[1]) ? (
          <>
            {/* General Info */}
            <ComparisonSection title="General Information" rows={[
              ["Car Type", renderCarProperty(comparisonData[0], "carType"), renderCarProperty(comparisonData[1], "carType")],
              ["Exterior Color", renderCarProperty(comparisonData[0], "exteriorColor"), renderCarProperty(comparisonData[1], "exteriorColor")],
              ["Brand", renderCarProperty(comparisonData[0], "brandId"), renderCarProperty(comparisonData[1], "brandId")],
              ["Model", renderCarProperty(comparisonData[0], "model"), renderCarProperty(comparisonData[1], "model")],
            ]}/>

            {/* Engine */}
            <ComparisonSection title="Engine Information" rows={[
              ["Registration Year", renderCarProperty(comparisonData[0], "registrationYear"), renderCarProperty(comparisonData[1], "registrationYear")],
              ["Transmission", renderCarProperty(comparisonData[0], "tranmission"), renderCarProperty(comparisonData[1], "tranmission")],
              ["Fuel Type", renderCarProperty(comparisonData[0], "fuelType"), renderCarProperty(comparisonData[1], "fuelType")],
              ["Power", renderCarProperty(comparisonData[0], "engine", "power"), renderCarProperty(comparisonData[1], "engine", "power")],
              ["Fuel Consumption", renderCarProperty(comparisonData[0], "engine", "fuelconsumsion"), renderCarProperty(comparisonData[1], "engine", "fuelconsumsion")],
            ]}/>

            {/* Dimensions */}
            <ComparisonSection title="Dimensions" rows={[
              ["Length", renderCarProperty(comparisonData[0], "dimension", "length"), renderCarProperty(comparisonData[1], "dimension", "length")],
              ["Width", renderCarProperty(comparisonData[0], "dimension", "width"), renderCarProperty(comparisonData[1], "dimension", "width")],
              ["Height", renderCarProperty(comparisonData[0], "dimension", "height"), renderCarProperty(comparisonData[1], "dimension", "height")],
              ["Number of Seats", renderCarProperty(comparisonData[0], "seat"), renderCarProperty(comparisonData[1], "seat")],
            ]}/>

            {/* Price & Rating */}
            <ComparisonSection title="Price & Rating" rows={[
              ["Price", `$${renderCarProperty(comparisonData[0], "price")}`, `$${renderCarProperty(comparisonData[1], "price")}`],
              ["Rating", `${renderCarProperty(comparisonData[0], "rating")}/5 ⭐`, `${renderCarProperty(comparisonData[1], "rating")}/5 ⭐`],
              ["Condition", comparisonData[0]?.stock ? "In Stock" : "Out of Stock", comparisonData[1]?.stock ? "In Stock" : "Out of Stock"],
            ]}/>
          </>
        ) : (
          <div className="text-center py-20">
            <CarOutlined style={{ fontSize: 64, color: "#ccc", marginBottom: 20 }} />
            <h3 className="text-xl text-gray-500">
              Please select at least one car to start comparing
            </h3>
          </div>
        )}
      </div>
    </main>
  )
}

export default Comparison

// Reusable section component
const ComparisonSection = ({ title, rows }) => (
  <div className="details bg-white rounded-2xl p-4 my-6">
    <div className="flex items-center justify-center">
      <h3 className="font-bold text-2xl pb-4 ">{title}</h3>
    </div>
    <hr />
    <div className="grid grid-cols-3 text-center">
      {rows.map(([label, car1, car2], idx) => (
        <React.Fragment key={idx}>
          <div className="font-semibold p-2 border-b text-left">{label}</div>
          <div className="p-2 border-b text-left">{car1}</div>
          <div className="p-2 border-b text-left">{car2}</div>
        </React.Fragment>
      ))}
    </div>
  </div>
)