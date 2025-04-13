import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapController = ({ map, center, radius, title }) => {
  useEffect(() => {
    if (center && map) {
      map.setView([center.lat, center.lng], 10);
    }
  }, [center, map]);

  return null;
};

const CampaignMap = ({ latitude, longitude, radius, title }) => {
  const [map, setMap] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    setIsMapReady(true);
  }, []);

  const center = {
    lat: Number.parseFloat(latitude),
    lng: Number.parseFloat(longitude),
  };

  if (!isMapReady || isNaN(center.lat) || isNaN(center.lng)) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-gray-500">
          Loading map or invalid coordinates...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        whenCreated={setMap}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={[center.lat, center.lng]}>
          <Popup>
            <div className="text-center">
              <strong>{title || "Campaign Location"}</strong>
              <div className="text-xs mt-1">
                {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
              </div>
            </div>
          </Popup>
        </Marker>

        {radius && !isNaN(Number.parseFloat(radius)) && (
          <Circle
            center={[center.lat, center.lng]}
            radius={Number.parseFloat(radius) * 1000}
            pathOptions={{
              color: "red",
              fillColor: "red",
              fillOpacity: 0.2,
              weight: 2,
              dashArray: "5, 5",
            }}
          />
        )}

        <MapController
          map={map}
          center={center}
          radius={radius}
          title={title}
        />
      </MapContainer>
    </div>
  );
};

export default CampaignMap;
