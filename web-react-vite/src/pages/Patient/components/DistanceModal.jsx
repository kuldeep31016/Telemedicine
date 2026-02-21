import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, Loader2, AlertCircle } from 'lucide-react';
import { getDistanceFromUser } from '../../../utils/location';

const DistanceModal = ({ isOpen, onClose, hospitalName, hospitalAddress, location }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [distanceData, setDistanceData] = useState(null);

    useEffect(() => {
        if (isOpen && location) {
            calculateDistance();
        }
    }, [isOpen, location]);

    const calculateDistance = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await getDistanceFromUser(location);
            setDistanceData(data);
        } catch (err) {
            console.error('Error calculating distance:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                
                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <MapPin size={20} />
                            <h3 className="text-lg font-bold">Hospital Location</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Hospital Info */}
                        <div className="mb-6">
                            <h4 className="font-bold text-gray-900 text-lg mb-2">{hospitalName}</h4>
                            {hospitalAddress && (
                                <p className="text-sm text-gray-600 flex items-start gap-2">
                                    <MapPin size={14} className="mt-0.5 flex-shrink-0 text-blue-600" />
                                    <span>{hospitalAddress}</span>
                                </p>
                            )}
                        </div>

                        {/* Distance Info */}
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                <span className="ml-3 text-gray-600">Calculating distance...</span>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-medium text-red-900 mb-1">Unable to calculate distance</p>
                                        <p className="text-xs text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        ) : !location ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-medium text-amber-900 mb-1">Location not available</p>
                                        <p className="text-xs text-amber-700">
                                            This doctor hasn't set their hospital location yet.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : distanceData ? (
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                                        <Navigation className="text-white" size={28} />
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-sm text-blue-700 font-medium mb-1">Distance from your location</p>
                                        <p className="text-4xl font-bold text-blue-900">{distanceData.formatted}</p>
                                    </div>
                                    {distanceData.distance && distanceData.distance < 5 && (
                                        <p className="text-xs text-green-700 font-medium mt-3 bg-green-100 inline-block px-3 py-1 rounded-full">
                                            Nearby location
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : null}

                        {/* Actions */}
                        {location && !error && (
                            <div className="mt-6 flex gap-3">
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
                                >
                                    Get Directions
                                </a>
                                <button
                                    onClick={onClose}
                                    className="px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DistanceModal;
