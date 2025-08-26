import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';

const useTestDriveData = () => {
    const [testDrives, setTestDrives] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchTestDriveData = async () => {
            try {
                const response = await api.get('/admins/testdrivess');
                setTestDrives(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                console.error("Failed to fetch test drives:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestDriveData();
    }, [location.search]);

    return { testDrives, loading };
}

export default useTestDriveData;
