import React, { useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Loader2 } from 'lucide-react';

const GooglePlacesAutocomplete = ({ value, onChange, placeholder, className, icon: Icon = MapPin }) => {
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initAutocomplete = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if Google Maps API key is set
                const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                if (!apiKey) {
                    throw new Error('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
                }

                const loader = new Loader({
                    apiKey: apiKey,
                    version: "weekly",
                    libraries: ["places"]
                });

                await loader.load();

                if (inputRef.current && window.google) {
                    // Initialize autocomplete with restrictions to establishments/hospitals
                    autocompleteRef.current = new window.google.maps.places.Autocomplete(
                        inputRef.current,
                        {
                            types: ['establishment'],
                            fields: ['name', 'formatted_address', 'geometry', 'place_id']
                        }
                    );

                    // Add listener for place selection
                    autocompleteRef.current.addListener('place_changed', () => {
                        const place = autocompleteRef.current.getPlace();
                        
                        if (!place.geometry || !place.geometry.location) {
                            console.error('No details available for input: ', place.name);
                            return;
                        }

                        // Extract location data
                        const locationData = {
                            name: place.name || '',
                            address: place.formatted_address || '',
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                            placeId: place.place_id || ''
                        };

                        console.log('Selected place:', locationData);
                        
                        // Call onChange with the location data
                        if (onChange) {
                            onChange(locationData);
                        }
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error('Error loading Google Maps:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        initAutocomplete();

        // Cleanup
        return () => {
            if (autocompleteRef.current && window.google) {
                window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, []);

    if (error) {
        return (
            <div className={className}>
                <div className="w-full px-4 py-3 rounded-xl border border-red-300 bg-red-50 text-red-600 text-sm">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                defaultValue={value}
                placeholder={placeholder || 'Search for hospital or clinic...'}
                disabled={loading}
                className={className}
            />
            {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 size={18} className="text-gray-400 animate-spin" />
                </div>
            )}
        </div>
    );
};

export default GooglePlacesAutocomplete;
