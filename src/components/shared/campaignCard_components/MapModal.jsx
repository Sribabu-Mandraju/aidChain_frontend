import { motion } from "framer-motion"
import { X, MapPin, ExternalLink } from "lucide-react"
import { toast } from "react-hot-toast"
import { MapContainer, TileLayer, Marker, Circle, useMap, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from "react"

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

const MapController = ({ center, radius, disasterName }) => {
  const map = useMap()

  useEffect(() => {
    if (center && typeof center.latitude === 'number' && typeof center.longitude === 'number' &&
        !isNaN(center.latitude) && !isNaN(center.longitude)) {
      map.setView([center.latitude, center.longitude], 10)
    }
  }, [center, map])

  if (!center || typeof center.latitude !== 'number' || typeof center.longitude !== 'number' ||
      isNaN(center.latitude) || isNaN(center.longitude)) {
    return null
  }

  return (
    <>
      <Marker position={[center.latitude, center.longitude]}>
        <Popup>
          <div className="text-center">
            <strong>{disasterName || 'Campaign Location'}</strong>
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
  )
}

const MapModal = ({ campaign, onClose }) => {
  const defaultCenter = [20, 0]
  const defaultZoom = 2

  const mapCenter = campaign.latitude && campaign.longitude
    ? [parseFloat(campaign.latitude), parseFloat(campaign.longitude)]
    : defaultCenter

  const mapZoom = campaign.latitude && campaign.longitude ? 10 : defaultZoom

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Campaign Location</h3>
            <p className="text-sm text-gray-500 mt-1">{campaign.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Map Preview */}
          <div className="relative h-[400px] bg-gray-100 rounded-xl overflow-hidden">
            <MapContainer
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
              {campaign.latitude && campaign.longitude && (
                <MapController
                  center={{
                    latitude: parseFloat(campaign.latitude),
                    longitude: parseFloat(campaign.longitude),
                  }}
                  radius={campaign.radius}
                  disasterName={campaign.title}
                />
              )}
            </MapContainer>
          </div>

          {/* Location Details */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-gray-900 font-medium">
                  {campaign.location || "Location not specified"}
                </p>
              </div>
              {campaign.latitude && campaign.longitude && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${campaign.latitude}&mlon=${campaign.longitude}&zoom=10`, '_blank')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Open in OSM
                </motion.button>
              )}
            </div>
          </div>

          {/* Additional Location Information */}
          {campaign.locationDetails && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-amber-800 text-sm leading-relaxed">
                {campaign.locationDetails}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MapModal 