/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LatLngExpression } from "leaflet"
import dynamic from "next/dynamic"
import { LocateFixed } from "lucide-react"
import "leaflet/dist/leaflet.css"
import { Polyline, Popup, useMap } from "react-leaflet"
import { useEffect } from "react"

interface ILocation {
  latitude: number,
  longitude: number
}

interface IProps {
  userLocation: ILocation,
  deliveryLocation: ILocation
}

function Recenter({positions}:{positions:[number, number]}) {
  const map = useMap()
  useEffect(()=>{
    if(positions[0] !== 0 && positions[1] !== 0){
      map.setView(positions, map.getZoom(), {
        animate: true
      })
    }
  }, [positions, map])
  return null
}

const LeafletMap = dynamic(
  async () => {
    const [{ MapContainer, Marker, TileLayer }, { default: L }] = await Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ])

    const deliveryManIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/128/1023/1023448.png",
      iconSize: [45, 45]
    })
    const userIcon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/128/9101/9101321.png",
      iconSize: [45, 45]
    })

    const LeafletMapContent = ({
      userPosition,
      deliveryPosition,
      linePositions
    }: {
      userPosition: [number, number] | null
      deliveryPosition: [number, number] | null
      linePositions: [[number, number], [number, number]] | null
    }) => (
      <MapContainer
        center={userPosition as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <Recenter positions={userPosition as any}/>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userPosition as LatLngExpression} icon={userIcon}>
          <Popup>Delivery Address</Popup>
        </Marker>
        {deliveryPosition && (
          <Marker position={deliveryPosition as LatLngExpression} icon={deliveryManIcon}>
            <Popup>Delivery Man</Popup>
          </Marker>
        )}
        <Polyline positions={linePositions as any} color="blue" />
      </MapContainer>
    )

    return LeafletMapContent
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50/50 text-sm font-semibold text-blue-400 shadow-sm shadow-blue-100/50">
        Loading map...
      </div>
    ),
  }
)

const LiveMap = ({userLocation, deliveryLocation}: IProps) => {
  const linePositions: [[number, number], [number, number]] | null =
    userLocation && deliveryLocation
      ? [[userLocation.latitude, userLocation.longitude], [deliveryLocation.latitude, deliveryLocation.longitude]]
      : null

  return (
    <div className="w-full">
      <div className="relative h-80 overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/50 sm:h-105">
        <div className="absolute left-4 top-4 z-1000 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-blue-700 shadow-md shadow-blue-200/60 backdrop-blur-sm">
          <LocateFixed className="h-4 w-4" />
          Live location tracking
        </div>
        {userLocation && (
          <LeafletMap
            userPosition={[userLocation.latitude, userLocation.longitude]}
            deliveryPosition={[deliveryLocation.latitude, deliveryLocation.longitude]}
            linePositions={linePositions}
          />
        )}
      </div>
    </div>
  )
}

export default LiveMap
