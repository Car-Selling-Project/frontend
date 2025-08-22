import { useState, useEffect } from 'react'
import { Select, Button, Form, Input } from 'antd'
import { toast } from 'react-toastify'
const { Option } = Select
import api from '../../api/axiosInstance'

const TestDrive = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        citizenId: '',
        address: '',
        carInfo: '',
        location: '',
        requestDay: '',
        note: '',
        terms: false,
        promotions: false,
        driverLicense: false
    })

    const [cars, setCars] = useState([])
    const [locations, setLocations] = useState([])
    const [selectedCar, setSelectedCar] = useState(null)

    useEffect(() => {
        api.get('/customers/cars')
            .then(res => {
                // If backend returns { cars: [...] }
                const carList = Array.isArray(res.data) ? res.data : res.data.cars || []
                setCars(carList)
            })
            .catch(() => setCars([]))
        api.get('/customers/locations')
            .then(res => {
                const locationList = Array.isArray(res.data) ? res.data : res.data.locations || []
                setLocations(locationList)
            })
            .catch(() => setLocations([]))
    }, [])

    useEffect(() => {
        const car = cars.find(c => c._id === formData.carInfo)
        setSelectedCar(car || null)
    }, [cars, formData.carInfo])

    const requiredFields = [
        'fullName',
        'phone',
        'email',
        'citizenId',
        'address',
        'carInfo',
        'location',
        'requestDay'
    ]

    const isFormComplete = requiredFields.every(field => formData[field]?.trim() && formData.terms && formData.driverLicense)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })
    }

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (value) => {
        console.log('Form submitted:', value)
        try {
            const res = await api.post('/customers/testdrives', value)
            console.log('Response:', res.data)
            setTimeout(() => { toast.success('Test drive request submitted successfully!') }, 5000)
        } catch (error) {
            setTimeout(() => { toast.error('Failed to submit test drive request.', error.message) }, 5000)
            console.error('Error:', error)
        }
    }

    return (
        <main className='-w-full flex flex-col items-center justify-center'>
            <div className='title m-5'>
                <h1 className='text-3xl font-black'>Drive test Registration</h1>
            </div>
            <Form className='form m-5 flex flex-col items-center justify-center' onFinish={handleSubmit} style={{ width: '30rem', padding: '2rem' }}>
                <div className="Information">
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Full name*</label>
                        <Input
                            type="text"
                            placeholder='Nguyễn Văn A'
                            style={{ borderBottom: '2px solid #080808', width: '25rem', outline: 'none' }}
                            name='fullName'
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Phone Number*</label>
                        <Input
                            type="text"
                            placeholder='0934997481'
                            style={{ borderBottom: '2px solid #080808', width: '25rem', outline: 'none' }}
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Email*</label>
                        <Input
                            type="text"
                            placeholder='example@gmail.com'
                            style={{ borderBottom: '2px solid #080808', width: '25rem', outline: 'none' }}
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Citizen ID*</label>
                        <Input
                            type="text"
                            placeholder='123456789'
                            style={{ borderBottom: '2px solid #080808', width: '25rem', outline: 'none' }}
                            name='citizenId'
                            value={formData.citizenId}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Address*</label>
                        <Input
                            type="text"
                            placeholder='123 Main St, City, Country'
                            style={{ borderBottom: '2px solid #080808', width: '25rem', outline: 'none' }}
                            name='address'
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Name of car*</label>
                        <Select
                            style={{ width: '25rem' }}
                            name='carInfo'
                            value={formData.carInfo}
                            onChange={value => handleSelectChange('carInfo', value)}
                            defaultValue="#"
                        >
                            <Option value="#">Select a car</Option>
                            {cars.map(car => (
                                <Option key={car._id} value={car._id}>{car.title}</Option>
                            ))}
                        </Select>
                    </div>
                    {selectedCar && selectedCar.images && selectedCar.images.length > 0 && (
                        <div className='my-5'>
                            <h3>{selectedCar.title}</h3>
                            <img src={selectedCar.images[0]} alt={selectedCar.title} style={{ maxWidth: '100%' }} />
                        </div>
                    )}
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Location*</label>
                        <Select
                            style={{ width: '25rem' }}
                            value={formData.location}
                            onChange={value => handleSelectChange('location', value)}
                        >
                            <Option value="">Select a location</Option>
                            {locations.map(loc => (
                                <Option key={loc._id} value={loc._id}>{loc.name}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Request Day*</label>
                        <Input
                            type="datetime-local"
                            name="requestDay"
                            id="requestDay"
                            style={{ borderBottom: '2px solid #080808', width: '25rem', outline: 'none' }}
                            value={formData.requestDay}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='flex flex-col my-5'>
                        <label className='font-bold text-xl'>Note</label>
                        <Input.TextArea
                            placeholder='Enter your note here'
                            style={{ width: '25rem' }}
                            name='note'
                            value={formData.note}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="submit m-5 flex flex-col items-start">
                    <div className='flex flex-col items-start'>
                        <div className='my-3 flex items-center'>
                            <Input
                                type="checkbox"
                                name="terms"
                                id="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                                style={{ width: '1.5rem', height: '1.5rem', margin: '0 1rem' }}
                            />
                            <label htmlFor="terms" className='text-xl font-semibold'>I agree to the terms and conditions</label>
                        </div>
                        <div className='my-3 flex items-center'>
                            <Input
                                type="checkbox"
                                name="promotions"
                                id="promotions"
                                checked={formData.promotions}
                                onChange={handleChange}
                                style={{ width: '1.5rem', height: '1.5rem', margin: '0 1rem' }}
                            />
                            <label htmlFor="promotions" className='text-xl font-semibold'>I want to receive promotions and updates</label>
                        </div>
                        <div className='my-3 flex items-center'>
                            <Input
                                type="checkbox"
                                name="driverLicense"
                                id="driverLicense"
                                checked={formData.driverLicense}
                                onChange={handleChange}
                                style={{ width: '1.5rem', height: '1.5rem', margin: '0 1rem' }}
                            />
                            <label htmlFor="driverLicense" className='text-xl font-semibold'>I have a driver's license</label>
                        </div>
                    </div>
                    <div className=''>
                        <Button
                            style={{ width: '25rem', marginTop: '1rem', borderRadius: '50px' }}
                            disabled={!isFormComplete}
                            htmlType='submit'
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </Form>
        </main>
    )
}

export default TestDrive
