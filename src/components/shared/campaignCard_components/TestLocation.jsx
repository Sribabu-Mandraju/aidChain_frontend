"use client"

import { useState } from "react"

const LocationTest = () => {
  const [centerLat, setCenterLat] = useState("")
  const [centerLon, setCenterLon] = useState("")
  const [radius, setRadius] = useState("")
  const [userLat, setUserLat] = useState("")
  const [userLon, setUserLon] = useState("")
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  // Improved function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Convert latitude and longitude from degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180)

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    // Convert coordinates to radians
    const lat1Rad = toRadians(lat1)
    const lat2Rad = toRadians(lat2)

    // Haversine formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    // Earth's radius in kilometers
    const R = 6371

    // Distance in kilometers
    return R * c
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude.toString())
        setUserLon(position.coords.longitude.toString())
        setError("")
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location. "
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location services in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out. Please try again."
            break
          default:
            errorMessage += "Please ensure location services are enabled."
        }
        setError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  const testLocation = () => {
    try {
      // Parse inputs
      const cLat = Number.parseFloat(centerLat)
      const cLon = Number.parseFloat(centerLon)
      const rad = Number.parseFloat(radius) / 1000 // Convert to kilometers
      const uLat = Number.parseFloat(userLat)
      const uLon = Number.parseFloat(userLon)

      // Validate inputs
      if ([cLat, cLon, rad, uLat, uLon].some(isNaN)) {
        throw new Error("All fields must be valid numbers")
      }

      // Calculate distance
      const distance = calculateDistance(uLat, uLon, cLat, cLon)

      // Add a small buffer (2% of radius) to account for GPS inaccuracy
      const buffer = Math.max(0.1, rad * 0.02) // At least 100 meters buffer
      const isInside = distance <= rad + buffer

      setResult({
        distance,
        radius: rad,
        buffer,
        isInside,
        difference: distance - rad,
      })

      setError("")
    } catch (err) {
      setError(err.message)
      setResult(null)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Location Verification Test Tool</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-md font-medium">Disaster Center Point</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Latitude</label>
              <input
                type="text"
                value={centerLat}
                onChange={(e) => setCenterLat(e.target.value)}
                placeholder="e.g., 28.6139"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Longitude</label>
              <input
                type="text"
                value={centerLon}
                onChange={(e) => setCenterLon(e.target.value)}
                placeholder="e.g., 77.2090"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Radius (meters)</label>
            <input
              type="text"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              placeholder="e.g., 5000"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-md font-medium">User Location</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Latitude</label>
              <input
                type="text"
                value={userLat}
                onChange={(e) => setUserLat(e.target.value)}
                placeholder="e.g., 28.6129"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Longitude</label>
              <input
                type="text"
                value={userLon}
                onChange={(e) => setUserLon(e.target.value)}
                placeholder="e.g., 77.2295"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <button
            onClick={getCurrentLocation}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Get Current Location
          </button>
        </div>

        <button
          onClick={testLocation}
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Test Location
        </button>

        {error && <div className="p-3 bg-red-50 text-red-600 rounded-md">{error}</div>}

        {result && (
          <div className="p-4 bg-gray-50 rounded-md space-y-2">
            <h3 className="font-medium">Results:</h3>
            <p>
              Distance from center: <span className="font-semibold">{result.distance.toFixed(2)} km</span>
            </p>
            <p>
              Allowed radius: <span className="font-semibold">{result.radius.toFixed(2)} km</span>
            </p>
            <p>
              Buffer applied: <span className="font-semibold">{result.buffer.toFixed(2)} km</span>
            </p>
            <p>
              Distance difference: <span className="font-semibold">{Math.abs(result.difference).toFixed(2)} km</span>
            </p>
            <p className={result.isInside ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
              Status: {result.isInside ? "INSIDE disaster area ✅" : "OUTSIDE disaster area ❌"}
            </p>
            {!result.isInside && (
              <p>You need to move {Math.abs(result.difference).toFixed(2)} km closer to the center</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationTest
