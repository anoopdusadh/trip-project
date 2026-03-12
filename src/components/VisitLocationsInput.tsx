'use client';

import { Location } from '@/types';
import LocationAutocomplete from './LocationAutocomplete';

interface VisitLocationsInputProps {
  onAddLocation: (location: Location) => void;
}

export default function VisitLocationsInput({
  onAddLocation,
}: VisitLocationsInputProps) {
  const handleSelectLocation = (location: Location) => {
    onAddLocation({
      id: 'visit-' + Date.now().toString(),
      name: location.name,
      lat: location.lat,
      lng: location.lng,
    });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-blue-900 mb-2">
        📌 Add Locations to Visit
      </label>
      <LocationAutocomplete
        onSelectLocation={handleSelectLocation}
        placeholder="Search location to add..."
      />
    </div>
  );
}
