import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../api/axiosInstance'

const useLocationData = () => {
    const [locations, setLocations] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    
    useEffect(() => {
        const fetchLocations = async () => {
        try {
            const searchParams = new URLSearchParams(location.search)
            const params = {}
    
            if (searchParams.get('name')) params.name = searchParams.get('name')
    
            console.log("Query params sent:", params) // Debug
            const res = await api.get('/admins/locations', { params })
            setLocations(res.data.locations || [])
        } catch (error) {
            console.error("Error fetching locations:", error)
        } finally {
            setLoading(false)
        }
        }
        fetchLocations()
    }, [location.search])
    
    return { locations, loading }
}

export default useLocationData