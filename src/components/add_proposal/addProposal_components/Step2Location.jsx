import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Circle, useMap, Popup } from 'react-leaflet';
import FormNavigation from './FormNavigation';
import { Search, MapPin, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ProposalFormApp/1.0',
      },
    });
    const data = await response.json();
    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lon),
        displayName: display_name,
      };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

const MapController = ({ center, setLocation, disasterName, radius }) => {
  const map = useMap();

  useEffect(() => {
    if (center && typeof center.latitude === 'number' && typeof center.longitude === 'number' &&
        !isNaN(center.latitude) && !isNaN(center.longitude)) {
      map.setView([center.latitude, center.longitude], 10);
    }
  }, [center, map]);

  const handleMapClick = (e) => {
    if (e && e.latlng) {
      const { lat, lng } = e.latlng;
      setLocation((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    }
  };

  useEffect(() => {
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map]);

  if (!center || typeof center.latitude !== 'number' || typeof center.longitude !== 'number' ||
      isNaN(center.latitude) || isNaN(center.longitude)) {
    return null;
  }

  return (
    <>
      <Marker position={[center.latitude, center.longitude]}>
        <Popup>
          <div className="text-center">
            <strong>{disasterName || 'Selected Location'}</strong>
            <div className="text-xs mt-1">
              {center.latitude}, {center.longitude}
            </div>
          </div>
        </Popup>
      </Marker>
      {radius && !isNaN(parseFloat(radius)) && (
        <Circle
          center={[center.latitude, center.longitude]}
          radius={parseFloat(radius) * 1000}
          pathOptions={{
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '5, 5',
          }}
        />
      )}
    </>
  );
};

const Step2Location = ({ formData, updateFormData, nextStep, previousStep, currentStep }) => {
  const [localData, setLocalData] = useState({
    latitude: formData?.location?.latitude ? parseFloat(formData.location.latitude) : null,
    longitude: formData?.location?.longitude ? parseFloat(formData.location.longitude) : null,
    radius: formData?.location?.radius || '',
    search: '',
    displayName: '',
  });

  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState({});
  const [mapReady, setMapReady] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now());

  useEffect(() => {
    setMapReady(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!localData.search) {
      setErrors(prev => ({
        ...prev,
        search: 'Please enter a location to search',
      }));
      return;
    }

    setIsSearching(true);
    try {
      const { lat, lng, displayName } = await geocodeAddress(localData.search);
      setLocalData(prev => ({
        ...prev,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        displayName: displayName,
      }));
      setErrors(prev => ({ ...prev, search: '' }));
      setMapKey(Date.now());
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        search: 'Could not find location. Please try another address.',
      }));
    } finally {
      setIsSearching(false);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (localData.latitude === null || localData.longitude === null) {
      newErrors.location = 'Please select a location on the map';
    }
    if (!localData.radius) {
      newErrors.radius = 'Please specify a radius';
    } else if (Number(localData.radius) <= 0) {
      newErrors.radius = 'Radius must be greater than 0';
    }
    return newErrors;
  };

  const handleNext = () => {
    const newErrors = validateFields();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateFormData({
      location: {
        latitude: localData.latitude.toString(),
        longitude: localData.longitude.toString(),
        radius: localData.radius,
      },
    });
    nextStep();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const defaultCenter = [20, 0];
  const defaultZoom = 2;

  const mapCenter = localData.latitude !== null && localData.longitude !== null
    ? [localData.latitude, localData.longitude]
    : defaultCenter;

  const mapZoom = localData.latitude !== null && localData.longitude !== null ? 10 : defaultZoom;

  if (!mapReady) {
    return null;
  }

  return (
    <motion.div
      className="bg-white rounded-xl p-8 shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center" variants={itemVariants}>
        <MapPin className="mr-2" size={24} />
        Location Details
      </motion.h2>

      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Location</label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                name="search"
                value={localData.search}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.search ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
                placeholder="e.g., New York, NY"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-5 py-3 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all shadow-md"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </motion.button>
          </form>
          {errors.search && (
            <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.search}
            </div>
          )}
          {localData.displayName && (
            <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-md border border-green-100">
              Found: {localData.displayName}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Radius (km)</label>
          <input
            type="number"
            name="radius"
            value={localData.radius}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.radius ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all`}
            placeholder="e.g., 10"
          />
          {errors.radius && (
            <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.radius}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
          <div className="h-[400px] relative">
            <MapContainer
              key={mapKey}
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
              zoomControl={true}
              className="z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {localData.latitude !== null && localData.longitude !== null && (
                <MapController
                  center={{
                    latitude: localData.latitude,
                    longitude: localData.longitude,
                  }}
                  setLocation={setLocalData}
                  disasterName={formData?.disasterName || ''}
                  radius={localData.radius}
                />
              )}
            </MapContainer>

            {errors.location && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
                {errors.location}
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md z-[1000]">
              <div className="text-xs text-gray-600">
                <div className="font-medium mb-1">Instructions:</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Search for a location or</li>
                  <li>Click directly on the map</li>
                  <li>Set a radius for the affected area</li>
                </ul>
              </div>
            </div>
          </div>

          {localData.latitude !== null && localData.longitude !== null && (
            <div className="bg-gray-50 p-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Coordinates:</span>
                  <span className="ml-2 text-gray-600">
                    {localData.latitude.toFixed(6)}, {localData.longitude.toFixed(6)}
                  </span>
                </div>
                {localData.radius && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Radius:</span>
                    <span className="ml-2 text-gray-600">{localData.radius} km</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <FormNavigation
        onPrevious={previousStep}
        onNext={handleNext}
        currentStep={currentStep}
      />
    </motion.div>
  );
};

export default Step2Location;