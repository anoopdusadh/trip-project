'use client';

import { Location } from '@/types';
import LocationAutocomplete from './LocationAutocomplete';

interface StartPointInputProps {
  onSetStartPoint: (location: Location) => void;
  startPoint: Location | null;
}

export default function StartPointInput({
  onSetStartPoint,
  startPoint,
}: StartPointInputProps) {
  const handleSelectLocation = (location: Location) => {
    onSetStartPoint({
      id: 'start-' + Date.now().toString(),
      name: location.name,
      lat: location.lat,
      lng: location.lng,
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-green-900 mb-2">
          📍 Starting Point (Your Location)
        </label>
        {startPoint && startPoint.name ? (
          <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg">
            <p className="font-medium text-green-900">{startPoint.name}</p>
            <p className="text-xs text-green-700 mt-1">Selected</p>
            <button
              onClick={() =>
                onSetStartPoint({
                  id: 'start-clear',
                  name: '',
                })
              }
              className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
            >
              Change Location
            </button>
          </div>
        ) : (
          <LocationAutocomplete
            onSelectLocation={handleSelectLocation}
            placeholder="Search starting location..."
          />
        )}
      </div>
    </div>
  );
}
