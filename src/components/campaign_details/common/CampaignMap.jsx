"use client"

import { MapPin, Clock } from "lucide-react"
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useEffect, useState } from "react"
import { getDonationEndTime, getRegistrationEndTime, getWaitingEndTime, getDistributionEndTime } from "../../../providers/disasterRelief_provider"

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

const CampaignMap = ({ latitude, longitude, radius, title, contractAddress }) => {
  const [timeLeft, setTimeLeft] = useState({
    donation: 0,
    registration: 0,
    waiting: 0,
    distribution: 0,
  })

  // Format time left
  const formatTimeLeft = (seconds) => {
    if (seconds <= 0) return "Ended"
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)

    if (days > 0) return `${days}d ${hours}h left`
    if (hours > 0) return `${hours}h ${minutes}m left`
    return `${minutes}m left`
  }

  // Update time left
  const updateTimeLeft = async () => {
    try {
      const [donationEnd, registrationEnd, waitingEnd, distributionEnd] = await Promise.all([
        getDonationEndTime(contractAddress),
        getRegistrationEndTime(contractAddress),
        getWaitingEndTime(contractAddress),
        getDistributionEndTime(contractAddress),
      ])

      const now = Math.floor(Date.now() / 1000)
      setTimeLeft({
        donation: Number(donationEnd) - now,
        registration: Number(registrationEnd) - now,
        waiting: Number(waitingEnd) - now,
        distribution: Number(distributionEnd) - now,
      })
    } catch (error) {
      console.error("Error updating time left:", error)
    }
  }

  useEffect(() => {
    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [contractAddress])

  // Convert string values to numbers and validate
  const parsedLatitude = parseFloat(latitude)
  const parsedLongitude = parseFloat(longitude)
  const parsedRadius = parseFloat(radius)

  // Validate coordinates
  if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
    return (
      <div className="relative w-full h-full bg-gray-100 rounded-xl flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <MapPin size={40} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Invalid Location</h3>
          <p className="text-gray-600 mb-4">The provided coordinates are invalid</p>
          <p className="text-sm text-gray-500">
            Location: {latitude}, {longitude}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Time Left Indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gray-800/80 backdrop-blur-sm shadow-md z-10">
        <Clock size={14} />
        <span>{formatTimeLeft(timeLeft.donation)}</span>
      </div>

      <MapContainer
        key={`${parsedLatitude}-${parsedLongitude}`}
        center={[parsedLatitude, parsedLongitude]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[parsedLatitude, parsedLongitude]}>
          <Popup>
            <div className="text-center">
              <strong>{title}</strong>
              <div className="text-xs mt-1">
                {parsedLatitude.toFixed(4)}, {parsedLongitude.toFixed(4)}
              </div>
              {!isNaN(parsedRadius) && parsedRadius > 0 && (
                <div className="text-xs mt-1">
                  Radius: {parsedRadius} km
                </div>
              )}
              <div className="text-xs mt-2 text-gray-600">
                <div>Donation Period: {formatTimeLeft(timeLeft.donation)}</div>
                <div>Registration Period: {formatTimeLeft(timeLeft.registration)}</div>
                <div>Waiting Period: {formatTimeLeft(timeLeft.waiting)}</div>
                <div>Distribution Period: {formatTimeLeft(timeLeft.distribution)}</div>
              </div>
            </div>
          </Popup>
        </Marker>
        {!isNaN(parsedRadius) && parsedRadius > 0 && (
          <Circle
            center={[parsedLatitude, parsedLongitude]}
            radius={parsedRadius * 1000}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.2,
              weight: 2,
              dashArray: "5, 5",
            }}
          />
        )}
      </MapContainer>
    </div>
  )
}

export default CampaignMap
