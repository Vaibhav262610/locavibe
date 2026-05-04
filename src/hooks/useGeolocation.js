import { useState, useEffect } from 'react';

export const useGeolocation = (options = {}) => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const defaultOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        ...options
    };

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser');
            setLoading(false);
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
                lat: latitude,
                lng: longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
            });
            setError(null);
            setLoading(false);
        };

        const handleError = (error) => {
            let errorMessage = 'Unable to retrieve location';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied by user';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information unavailable';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out';
                    break;
                default:
                    errorMessage = 'An unknown error occurred';
                    break;
            }

            setError(errorMessage);
            setLoading(false);
        };

        // Get current position
        navigator.geolocation.getCurrentPosition(
            handleSuccess,
            handleError,
            defaultOptions
        );

        // Watch position for updates (optional)
        const watchId = navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            defaultOptions
        );

        // Cleanup
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    const refreshLocation = () => {
        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({
                    lat: latitude,
                    lng: longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                });
                setLoading(false);
            },
            (error) => {
                setError('Failed to get location');
                setLoading(false);
            },
            defaultOptions
        );
    };

    return {
        location,
        error,
        loading,
        refreshLocation
    };
};