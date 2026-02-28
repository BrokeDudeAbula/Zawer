import MapContainer from './components/MapContainer'

export default function MapPage() {
  return (
    <div className="h-full w-full">
      <MapContainer
        center={[104.0657, 30.6595]}
        zoom={14}
      />
    </div>
  )
}
