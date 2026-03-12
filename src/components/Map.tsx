'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Location } from '@/types';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  locations: Location[];
  optimizedRoute: Location[] | null;
}

const icon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const startIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const endIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Map({ locations, optimizedRoute }: MapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]);

  useEffect(() => {
    if (locations.length > 0) {
      const avgLat = locations.reduce((sum, loc) => sum + (loc.lat || 0), 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + (loc.lng || 0), 0) / locations.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [locations]);

  const routeToDisplay = optimizedRoute || locations;
  const routeCoordinates = routeToDisplay
    .filter(loc => loc.lat !== undefined && loc.lng !== undefined)
    .map(loc => [loc.lat!, loc.lng!] as [number, number]);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="blue"
            weight={3}
            opacity={0.7}
            dashArray={optimizedRoute ? '' : '10, 5'}
          />
        )}

        {routeToDisplay.map((location, index) => {
          let markerIcon = icon;
          if (index === 0) {
            markerIcon = startIcon;
          } else if (index === routeToDisplay.length - 1) {
            markerIcon = endIcon;
          }

          return (
            location.lat !== undefined &&
            location.lng !== undefined && (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={markerIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{index + 1}. {location.name}</strong>
                  </div>
                </Popup>
              </Marker>
            )
          );
        })}
      </MapContainer>
    </div>
  );
}
