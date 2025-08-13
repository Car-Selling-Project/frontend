import { useState, useEffect } from 'react'
import { CarOutlined, CloseOutlined } from '@ant-design/icons'
import { Button, Select, message } from 'antd'
import useCarData from '../../hooks/useCarData'
import CarCard from '../../components/CarCard'

const { Option } = Select

const Comparison = () => {
    const { cars, loading } = useCarData()
    const [selectedCars, setSelectedCars] = useState([null, null])
    const [comparisonData, setComparisonData] = useState([null, null])
    // Handle car selection for comparison
    const handleCarSelect = (carId, index) => {
        const car = cars.find(c => c._id === carId)
        if (car) {
            const newSelectedCars = [...selectedCars]
            const newComparisonData = [...comparisonData]
            newSelectedCars[index] = carId
            newComparisonData[index] = car
            setSelectedCars(newSelectedCars)
            setComparisonData(newComparisonData)
        }
    }

    // Remove car from comparison
    const removeCar = (index) => {
        const newSelectedCars = [...selectedCars]
        const newComparisonData = [...comparisonData]
        newSelectedCars[index] = null
        newComparisonData[index] = null
        setSelectedCars(newSelectedCars)
        setComparisonData(newComparisonData)
    }

    // Helper function to safely render car property
    const renderCarProperty = (car, property, nested = null) => {
        if (!car) return 'N/A'
        
        let value = car[property]
        if (nested && value) {
            value = value[nested]
        }
        
        // Handle arrays
        if (Array.isArray(value)) {
            if (value.length === 0) return 'N/A'
            return value.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return item.name || item._id || 'Unknown'
                }
                return item
            }).join(', ')
        }
        
        if (typeof value === 'object' && value !== null) {
            return value.name || value._id || 'N/A'
        }
        
        return value || 'N/A'
    }

    if (loading) {
        return <div className="text-center py-10">Loading cars...</div>
    }

  return (
    <main className='w-full h-full flex flex-col items-center justify-between'>
      <div className='w-full flex flex-col'>
        <div className='header flex items-center justify-start p-4'>
          <h1 className='font-bold dark:text-white text-3xl'>Car Comparison</h1>
        </div>
        <div className="compare w-full flex items-center justify-around flex-row ">
          {/* Car 1 */}
          <div className='w-1/2 flex items-center justify-center'>
            {comparisonData[0] ? (
              <div className='comparison-cars flex flex-col relative bg-white' style={{ borderRadius: '16px', padding: '2rem', margin: '3rem 0' }}>
                <Button 
                  type="text" 
                  icon={<CloseOutlined />} 
                  onClick={() => removeCar(0)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-10"
                />
                <div className="w-full flex justify-center">
                  <CarCard car={comparisonData[0]} />
                </div>
              </div>
            ) : (
              <div className='comparison-cars flex flex-col items-center justify-center' style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', margin: '3rem 0', minHeight: '300px' }}>
                <Select
                  placeholder="Pick a car to compare"
                  style={{ width: 250, marginBottom: 20 }}
                  onChange={(value) => handleCarSelect(value, 0)}
                  showSearch
                  optionFilterProp="children"
                >
                  {cars.filter(car => car._id !== selectedCars[1]).map(car => (
                    <Option key={car._id} value={car._id}>
                      {car.title} - ${car.price}
                    </Option>
                  ))}
                </Select>
                <CarOutlined style={{ fontSize: 48, color: '#ccc' }} />
                <p>Add car to compare</p>
              </div>
            )}
          </div>
          
          {/* Car 2 */}
          <div className='w-1/2 flex items-center justify-center'>
            {comparisonData[1] ? (
              <div className='comparison-cars flex flex-col relative' style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', margin: '3rem 0' }}>
                <Button 
                  type="text" 
                  icon={<CloseOutlined />} 
                  onClick={() => removeCar(1)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 z-10"
                />
                <div className="w-full flex justify-center">
                  <CarCard car={comparisonData[1]} />
                </div>
              </div>
            ) : (
              <div className='comparison-cars flex flex-col items-center justify-center' style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '2rem', margin: '3rem 0', minHeight: '300px' }}>
                <Select
                  placeholder="Pick a car to compare"
                  style={{ width: 250, marginBottom: 20 }}
                  onChange={(value) => handleCarSelect(value, 1)}
                  showSearch
                  optionFilterProp="children"
                >
                  {cars.filter(car => car._id !== selectedCars[0]).map(car => (
                    <Option key={car._id} value={car._id}>
                      {car.title} - ${car.price}
                    </Option>
                  ))}
                </Select>
                <CarOutlined style={{ fontSize: 48, color: '#ccc' }} />
                <p>Add car to compare</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="middle w-full flex flex-col">
        {(comparisonData[0] || comparisonData[1]) && (
          <>
            <div className="details" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1rem', margin: '1.5rem 0' }}>
              <div className='category flex items-center flex-col'>
                <h3 className="font-bold text-2xl pb-4">General Information</h3>
              </div>
              <hr />
              <div className="infomation">
                <div className='category flex items-center flex-col'>
                  <h3>Car Type</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'carType')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'carType')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Exterior Color</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'exteriorColor')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'exteriorColor')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Brand</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'brandId')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'brandId')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Model</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'model')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'model')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="details" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1rem', margin: '1.5rem 0' }}>
              <div className='flex items-center justify-center'>
                <h3 className="font-bold text-2xl pb-4">Engine Information</h3>
              </div>
              <hr />
              <div className="infomation">
                <div className='category flex items-center flex-col'>
                  <h3>Registration Year</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'registrationYear')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'registrationYear')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Transmission</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'tranmission')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'tranmission')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Fuel Type</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'fuelType')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'fuelType')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Power</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'engine', 'power')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'engine', 'power')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Fuel Consumption</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'engine', 'fuelconsumsion')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'engine', 'fuelconsumsion')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="details" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1rem', margin: '1.5rem 0' }}>
              <div className='flex items-center justify-center'>
                <h3 className="font-bold text-2xl pb-4">Dimensions</h3>
              </div>
              <hr />
              <div className="infomation">
                <div className='category flex items-center flex-col'>
                  <h3>Length</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'dimension', 'length')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'dimension', 'length')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Width</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'dimension', 'width')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'dimension', 'width')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Height</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'dimension', 'height')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'dimension', 'height')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Number of Seats</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'seat')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'seat')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="details" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '1rem', margin: '1.5rem 0' }}>
              <div className='flex items-center justify-center'>
                <h3 className="font-bold text-2xl pb-4">Price & Rating</h3>
              </div>
              <hr />
              <div className="infomation">
                <div className='category flex items-center flex-col'>
                  <h3>Price</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>${renderCarProperty(comparisonData[0], 'price')}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>${renderCarProperty(comparisonData[1], 'price')}</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Rating</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[0], 'rating')}/5 ⭐</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{renderCarProperty(comparisonData[1], 'rating')}/5 ⭐</p>
                    </div>
                  </div>
                </div>
                <div className='category flex items-center flex-col'>
                  <h3>Condition</h3>
                  <div className='category-info w-full flex items-center flex-row justify-around'>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{comparisonData[0]?.stock ? 'In Stock' : 'Out of Stock'}</p>
                    </div>
                    <div className='w-1/2 flex items-center justify-center'>
                      <p style={{ padding: '0 5rem' }}>{comparisonData[1]?.stock ? 'In Stock' : 'Out of Stock'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {!comparisonData[0] && !comparisonData[1] && (
          <div className="text-center py-20">
            <CarOutlined style={{ fontSize: 64, color: '#ccc', marginBottom: 20 }} />
            <h3 className="text-xl text-gray-500">Please select at least one car to start comparing</h3>
          </div>
        )}
      </div>
    </main>
  )
}

export default Comparison