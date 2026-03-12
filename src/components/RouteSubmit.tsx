'use client';

import { useState } from 'react';
import { Location } from '@/types';

interface RouteSubmitProps {
  startPoint: Location | null;
  visitLocations: Location[];
  onOptimize: (result: any) => void;
  onClearAll: () => void;
}

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Nearest neighbor TSP algorithm with optional return to start
function optimizeRoute(
  locations: Location[],
  returnToStart: boolean
): { route: Location[]; distance: number } {
  if (locations.length <= 1) return { route: locations, distance: 0 };

  const visited = new Set<string>();
  const route: Location[] = [];
  let totalDistance = 0;

  let current = locations[0];
  const startPoint = locations[0];
  route.push(current);
  visited.add(current.id);

  while (visited.size < locations.length) {
    let nearest: Location | null = null;
    let minDistance = Infinity;

    for (const location of locations) {
      if (!visited.has(location.id)) {
        if (
          current.lat !== undefined &&
          current.lng !== undefined &&
          location.lat !== undefined &&
          location.lng !== undefined
        ) {
          const distance = calculateDistance(
            current.lat,
            current.lng,
            location.lat,
            location.lng
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearest = location;
          }
        }
      }
    }

    if (nearest) {
      totalDistance += minDistance;
      route.push(nearest);
      visited.add(nearest.id);
      current = nearest;
    }
  }

  // Add return to starting point if enabled
  if (returnToStart && startPoint.lat !== undefined && startPoint.lng !== undefined && current.lat !== undefined && current.lng !== undefined) {
    const returnDistance = calculateDistance(
      current.lat,
      current.lng,
      startPoint.lat,
      startPoint.lng
    );
    totalDistance += returnDistance;
    // Add a "Return to Start" marker
    route.push({
      id: 'return-' + Date.now(),
      name: `Return to ${startPoint.name}`,
      lat: startPoint.lat,
      lng: startPoint.lng,
    });
  }

  return { route, distance: totalDistance };
}

export default function RouteSubmit({
  startPoint,
  visitLocations,
  onOptimize,
  onClearAll,
}: RouteSubmitProps) {
  const [returnToStart, setReturnToStart] = useState(true);

  const handleOptimize = () => {
    if (!startPoint || visitLocations.length === 0) {
      alert('Please add start point and at least one location to visit');
      return;
    }

    const allLocations = [startPoint, ...visitLocations];
    const { route, distance } = optimizeRoute(allLocations, returnToStart);

    // Calculate estimated time (assuming average 40 km/h)
    const estimatedTime = Math.ceil((distance / 40) * 60); // in minutes

    onOptimize({
      startPoint,
      optimizedRoute: route,
      totalDistance: distance.toFixed(2),
      estimatedTime,
      includesReturn: returnToStart,
    });
  };

  return (
    <div className="space-y-3">
      {/* Return to Start Checkbox */}
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-purple-200">
        <input
          type="checkbox"
          id="returnToStart"
          checked={returnToStart}
          onChange={(e) => setReturnToStart(e.target.checked)}
          className="w-5 h-5 accent-purple-600"
        />
        <label htmlFor="returnToStart" className="text-sm font-semibold text-purple-900 cursor-pointer">
          Return to starting point after visiting all locations
        </label>
      </div>

      <button
        onClick={handleOptimize}
        disabled={!startPoint || visitLocations.length === 0}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 transition font-bold text-lg"
      >
        🚀 SUBMIT & OPTIMIZE ROUTE
      </button>

      <button
        onClick={onClearAll}
        className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium"
      >
        Clear All
      </button>
    </div>
  );
}
