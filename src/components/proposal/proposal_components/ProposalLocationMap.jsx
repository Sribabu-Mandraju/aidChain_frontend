import { MapPin } from "lucide-react"
import { MapContainer, TileLayer, Marker, Circle, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

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

const ProposalLocationMap = ({ proposal }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 pb-3">
        <h2 className="text-xl font-semibold text-gray-800 mb-1 flex items-center">
          <MapPin className="w-5 h-5 text-green-500 mr-2" />
          Affected Area
        </h2>
        <p className="text-gray-600 mb-4">
          This proposal covers a {proposal.location.radius} km radius around the following location:
        </p>
      </div>
      {proposal.location && (
        <div className="h-[400px] relative">
          <MapContainer
            key={`${proposal.location.latitude}-${proposal.location.longitude}`}
            center={[proposal.location.latitude, proposal.location.longitude]}
            zoom={8}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[proposal.location.latitude, proposal.location.longitude]}>
              <Popup>
                <div className="text-center">
                  <strong>{proposal.disasterName}</strong>
                  <div className="text-xs mt-1">
                    {proposal.location.latitude.toFixed(4)}, {proposal.location.longitude.toFixed(4)}
                  </div>
                  <div className="text-xs mt-1">
                    Radius: {proposal.location.radius} km
                  </div>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={[proposal.location.latitude, proposal.location.longitude]}
              radius={proposal.location.radius * 1000}
              pathOptions={{
                color: "red",
                fillColor: "red",
                fillOpacity: 0.2,
                weight: 2,
                dashArray: "5, 5",
              }}
            />
          </MapContainer>
        </div>
      )}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-wrap justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Coordinates:</span> {proposal.location.latitude.toFixed(4)},{" "}
            {proposal.location.longitude.toFixed(4)}
          </div>
          <div>
            <span className="font-medium">Coverage Radius:</span> {proposal.location.radius} km
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalLocationMap 