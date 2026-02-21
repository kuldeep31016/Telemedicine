/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param {Object} coords1 - First coordinate {lat, lng}
 * @param {Object} coords2 - Second coordinate {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (coords1, coords2) => {
    if (!coords1 || !coords2 || !coords1.lat || !coords1.lng || !coords2.lat || !coords2.lng) {
        return null;
    }

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(coords2.lat - coords1.lat);
    const dLng = toRadians(coords2.lng - coords1.lng);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(coords1.lat)) * Math.cos(toRadians(coords2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
    if (!distance) return 'Distance unavailable';
    
    if (distance < 1) {
        return `${Math.round(distance * 1000)} meters`;
    } else if (distance < 10) {
        return `${distance.toFixed(1)} km`;
    } else {
        return `${Math.round(distance)} km`;
    }
};

/**
 * Get user's current location
 * @returns {Promise<{lat: number, lng: number}>} Current location coordinates
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                let errorMessage = 'Unable to get your location';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred.';
                }
                
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
};

/**
 * Calculate and format distance between user and a destination
 * @param {Object} destination - Destination coordinates {lat, lng}
 * @returns {Promise<{distance: number, formatted: string}>}
 */
export const getDistanceFromUser = async (destination) => {
    try {
        const userLocation = await getCurrentLocation();
        const distance = calculateDistance(userLocation, destination);
        
        return {
            distance,
            formatted: formatDistance(distance),
            userLocation
        };
    } catch (error) {
        throw error;
    }
};
