import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Star,
  Loader,
  Pill,
  RefreshCw,
  ExternalLink,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCurrentLocation, calculateDistance, formatDistance } from '../../utils/location';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// ── localStorage cache — persists across refresh & browser close ─────
const CACHE_KEY = 'nearbyMedicalCache';
const CACHE_MAX_AGE_MS = 30 * 60 * 1000;  // 30 minutes
const DRIFT_THRESHOLD_KM = 1;              // 1 km

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const writeCache = (pharmacies, location) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      lat: location.lat,
      lng: location.lng,
      time: Date.now(),
      data: pharmacies,
    }));
  } catch { /* quota exceeded – ignore */ }
};

/** Returns true when cached data is still valid (not stale + user hasn't moved) */
const isCacheValid = (cache, currentLocation) => {
  if (!cache || !cache.data?.length || !cache.time) return false;
  // Condition 1: older than 30 min → invalid
  if (Date.now() - cache.time > CACHE_MAX_AGE_MS) return false;
  // Condition 2: user moved > 1 km → invalid
  if (currentLocation) {
    const km = calculateDistance(
      { lat: cache.lat, lng: cache.lng },
      currentLocation
    );
    if (km > DRIFT_THRESHOLD_KM) return false;
  }
  return true;
};

const NearbyPharmacy = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const infoWindowRef = useRef(null);                  

  // ── 1. Load Google Maps script (once) ─────────────────────────────
  useEffect(() => {
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => setMapsLoaded(true));
      if (window.google && window.google.maps) setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapsLoaded(true);
    script.onerror = () => {
      setLocationError('Failed to load Google Maps');
      setLoading(false);
    };
    document.head.appendChild(script);
  }, []);

  // ── 2. Once maps SDK loaded → decide: use cache or fetch ──────────
  useEffect(() => {
    if (!mapsLoaded) return;

    // ── FAST PATH: check cache synchronously BEFORE any async work ──
    const cache = readCache();
    if (cache && cache.data?.length && cache.time && (Date.now() - cache.time < CACHE_MAX_AGE_MS)) {
      // Cache is fresh (< 30 min) → render instantly, NO GPS, NO API
      const cachedLoc = { lat: cache.lat, lng: cache.lng };
      setUserLocation(cachedLoc);
      setPharmacies(cache.data);
      setLoading(false);

      setTimeout(() => {
        initMap(cachedLoc);
        addPharmacyMarkers(cache.data, cachedLoc);
      }, 150);
      return;
    }

    // No cache or cache expired → full fetch (GPS + Places API)
    smartLoad();
  }, [mapsLoaded]);

  /**
   * Smart load:
   *  1. Read cache from localStorage
   *  2. Get user's current GPS (lightweight — no API cost)
   *  3. If cache is valid (< 30 min AND user moved < 1 km) → show cached, ZERO API calls
   *  4. Otherwise → fetch fresh pharmacies from Google Places API
   */
  const smartLoad = async () => {
    try {
      setLoading(true);
      setLocationError(null);

      const cache = readCache();
      const currentLocation = await getCurrentLocation();
      setUserLocation(currentLocation);

      if (cache && isCacheValid(cache, currentLocation)) {
        // ✅ Cache hit — show instantly, NO API call
        const cachedLoc = { lat: cache.lat, lng: cache.lng };
        setPharmacies(cache.data);
        setLoading(false);

        setTimeout(() => {
          initMap(cachedLoc);
          addPharmacyMarkers(cache.data, cachedLoc);
        }, 150);
        return;
      }

      // ❌ Cache miss / expired / user moved — fresh fetch
      await fetchPharmacies(currentLocation);
    } catch (error) {
      console.error('Error:', error);
      // If location failed but we have stale cache, show it
      const cache = readCache();
      if (cache && cache.data?.length) {
        const cachedLoc = { lat: cache.lat, lng: cache.lng };
        setUserLocation(cachedLoc);
        setPharmacies(cache.data);
        setLoading(false);
        setTimeout(() => {
          initMap(cachedLoc);
          addPharmacyMarkers(cache.data, cachedLoc);
        }, 150);
        toast.error('Using cached results — location unavailable');
      } else {
        setLocationError(error.message);
        toast.error(error.message || 'Failed to get your location');
        setLoading(false);
      }
    }
  };

  // ── Fetch pharmacies from Google Places API ───────────────────────
  const fetchPharmacies = async (location) => {
    try {
      if (!location) {
        location = await getCurrentLocation();
        setUserLocation(location);
      }

      setLoading(true);
      setLocationError(null);

      await new Promise(r => setTimeout(r, 100));
      initMap(location);

      if (mapInstanceRef.current) {
        await new Promise((resolve) => {
          window.google.maps.event.addListenerOnce(mapInstanceRef.current, 'idle', resolve);
          setTimeout(resolve, 2000);
        });
      }

      const results = await searchNearbyPharmacies(location);
      if (results && results.length) {
        writeCache(results, location);
      }
    } catch (error) {
      console.error('Error:', error);
      setLocationError(error.message);
      toast.error(error.message || 'Failed to get your location');
    } finally {
      setLoading(false);
    }
  };

  const initMap = (location) => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: location.lat, lng: location.lng },
      zoom: 14,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#e0e0e0' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9e7f5' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4edda' }] },
      ],
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;

    // Add user location marker
    new window.google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: map,
      title: 'Your Location',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: '#2563EB',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 10,
      },
      zIndex: 999,
    });

    // Add pulse effect around user marker
    new window.google.maps.Circle({
      strokeColor: '#2563EB',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#2563EB',
      fillOpacity: 0.1,
      map: map,
      center: { lat: location.lat, lng: location.lng },
      radius: 200,
    });

    infoWindowRef.current = new window.google.maps.InfoWindow();
  };

  const searchNearbyPharmacies = async (location) => {
    if (!window.google) {
      throw new Error('Google Maps not loaded');
    }

    try {
      const { places } = await window.google.maps.places.Place.searchNearby({
        fields: ['displayName', 'location', 'formattedAddress', 'rating', 'userRatingCount', 'regularOpeningHours', 'id'],
        locationRestriction: {
          center: { lat: location.lat, lng: location.lng },
          radius: 5000, // 5km radius
        },
        includedPrimaryTypes: ['pharmacy'],
        maxResultCount: 5,
        rankPreference: 'DISTANCE',
      });

      if (places && places.length > 0) {
        const top5 = places.map((place, index) => {
          const placeLat = place.location.lat();
          const placeLng = place.location.lng();
          const distance = calculateDistance(
            { lat: location.lat, lng: location.lng },
            { lat: placeLat, lng: placeLng }
          );

          let isOpen = null;
          try {
            if (place.regularOpeningHours) {
              isOpen = place.regularOpeningHours.periods ? true : null;
            }
          } catch (e) {
            // ignore
          }

          return {
            id: place.id,
            name: place.displayName,
            address: place.formattedAddress || 'Address not available',
            lat: placeLat,
            lng: placeLng,
            distance,
            rating: place.rating || null,
            totalRatings: place.userRatingCount || 0,
            isOpen,
            index: index + 1,
          };
        });

        setPharmacies(top5);
        addPharmacyMarkers(top5, location);
        return top5;
      } else {
        toast.error('No pharmacies found nearby');
        return [];
      }
    } catch (error) {
      console.error('Places search failed:', error);
      // Fallback to legacy PlacesService if new API not available
      return searchNearbyPharmaciesLegacy(location);
    }
  };

  // Fallback for accounts where new API isn't enabled yet
  const searchNearbyPharmaciesLegacy = (location) => {
    return new Promise((resolve) => {
      if (!mapInstanceRef.current) {
        resolve([]);
        return;
      }

      const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);

      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        type: 'pharmacy',
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const top5 = results.slice(0, 5).map((place, index) => {
            const placeLat = place.geometry.location.lat();
            const placeLng = place.geometry.location.lng();
            const distance = calculateDistance(
              { lat: location.lat, lng: location.lng },
              { lat: placeLat, lng: placeLng }
            );

            return {
              id: place.place_id,
              name: place.name,
              address: place.vicinity,
              lat: placeLat,
              lng: placeLng,
              distance,
              rating: place.rating || null,
              totalRatings: place.user_ratings_total || 0,
              isOpen: place.opening_hours?.isOpen() ?? null,
              index: index + 1,
            };
          });

          setPharmacies(top5);
          addPharmacyMarkers(top5, location);
          resolve(top5);
        } else {
          console.error('Places search failed:', status);
          toast.error('No pharmacies found nearby');
          resolve([]);
        }
      });
    });
  };

  const addPharmacyMarkers = (pharmacyList, loc) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const refLoc = loc || userLocation;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: refLoc?.lat || 0, lng: refLoc?.lng || 0 });

    pharmacyList.forEach((pharmacy, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: pharmacy.lat, lng: pharmacy.lng },
        map: mapInstanceRef.current,
        title: pharmacy.name,
        label: {
          text: String(index + 1),
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '14px',
        },
        icon: {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
          fillColor: '#059669',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
          scale: 1.8,
          anchor: new window.google.maps.Point(12, 24),
          labelOrigin: new window.google.maps.Point(12, 10),
        },
        animation: window.google.maps.Animation.DROP,
      });

      marker.addListener('click', () => {
        setSelectedPharmacy(pharmacy);
        const content = `
          <div style="padding: 8px; max-width: 220px;">
            <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${pharmacy.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${pharmacy.address}</p>
            <p style="font-size: 12px; color: #059669; font-weight: 600;">${formatDistance(pharmacy.distance)}</p>
          </div>
        `;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
      bounds.extend({ lat: pharmacy.lat, lng: pharmacy.lng });
    });

    // Fit all markers in view
    if (mapInstanceRef.current && pharmacyList.length > 0) {
      mapInstanceRef.current.fitBounds(bounds);
      // Don't zoom in too much
      const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'idle', () => {
        if (mapInstanceRef.current.getZoom() > 15) {
          mapInstanceRef.current.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  };

  const handleNavigate = (pharmacy) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${pharmacy.lat},${pharmacy.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleSelectPharmacy = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: pharmacy.lat, lng: pharmacy.lng });
      mapInstanceRef.current.setZoom(16);

      // Trigger info window on the corresponding marker
      const marker = markersRef.current[pharmacy.index - 1];
      if (marker && infoWindowRef.current) {
        const content = `
          <div style="padding: 8px; max-width: 220px;">
            <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${pharmacy.name}</h3>
            <p style="font-size: 12px; color: #666; margin-bottom: 4px;">${pharmacy.address}</p>
            <p style="font-size: 12px; color: #059669; font-weight: 600;">${formatDistance(pharmacy.distance)}</p>
          </div>
        `;
        infoWindowRef.current.setContent(content);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      }
    }
  };

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);   // bust cache
    setPharmacies([]);
    setSelectedPharmacy(null);
    fetchPharmacies(null);                // force fresh API call
  };

  if (locationError) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Hidden map div so it stays in DOM for re-init */}
        <div ref={mapRef} style={{ width: 0, height: 0, overflow: 'hidden' }} />
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-800 mb-2">Location Access Required</h3>
          <p className="text-red-600 mb-6">{locationError}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Loading Overlay */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-96 gap-4 mb-6">
          <Loader className="w-10 h-10 text-emerald-600 animate-spin" />
          <p className="text-gray-600 font-medium">Finding nearby pharmacies...</p>
          <p className="text-gray-400 text-sm">Getting your location and searching</p>
        </div>
      )}

      {/* Header */}
      <div className={`flex items-center justify-between mb-6 ${loading ? 'hidden' : ''}`}>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-emerald-600" />
            Get Your Medicine
          </h1>
          <p className="text-gray-600 mt-1">
            Top 5 nearest pharmacies to your location
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium shadow-lg shadow-emerald-200"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Map - always rendered with real dimensions; visually hidden while loading */}
      <div className={`bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden mb-6 ${loading ? 'opacity-0 h-0 overflow-hidden' : ''}`}
           style={loading ? { position: 'absolute', left: '-9999px', width: '600px', height: '400px' } : {}}
      >
        <div
          ref={mapRef}
          className="w-full h-[400px]"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Pharmacy Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${loading ? 'hidden' : ''}`}>
        {pharmacies.map((pharmacy) => (
          <motion.div
            key={pharmacy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pharmacy.index * 0.1 }}
            onClick={() => handleSelectPharmacy(pharmacy)}
            className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
              selectedPharmacy?.id === pharmacy.id
                ? 'border-emerald-500 ring-2 ring-emerald-200'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {pharmacy.index}
                </span>
                <span className="text-white font-semibold text-sm truncate max-w-[180px]">
                  {pharmacy.name}
                </span>
              </div>
              {pharmacy.isOpen !== null && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  pharmacy.isOpen
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pharmacy.isOpen ? 'Open' : 'Closed'}
                </span>
              )}
            </div>

            {/* Card Body */}
            <div className="p-4">
              {/* Address */}
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600 line-clamp-2">
                  {pharmacy.address}
                </p>
              </div>

              {/* Distance */}
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-sm font-bold text-emerald-700">
                  {formatDistance(pharmacy.distance)}
                </span>
              </div>

              {/* Rating */}
              {pharmacy.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  <span className="text-sm font-semibold text-gray-700">
                    {pharmacy.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({pharmacy.totalRatings} reviews)
                  </span>
                </div>
              )}

              {/* Navigate Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(pharmacy);
                }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 text-sm"
              >
                <Navigation className="w-4 h-4" />
                Navigate
                <ExternalLink className="w-3 h-3 ml-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {pharmacies.length === 0 && !loading && (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
          <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Pharmacies Found</h3>
          <p className="text-gray-600">
            No pharmacies found nearby. Try refreshing or check your location settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default NearbyPharmacy;
