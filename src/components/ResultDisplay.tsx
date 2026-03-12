'use client';

import { Location } from '@/types';

interface ResultDisplayProps {
  startPoint: Location;
  optimizedRoute: Location[];
  totalDistance: string;
  estimatedTime: number;
  onBack: () => void;
  includesReturn?: boolean;
}

export default function ResultDisplay({
  startPoint,
  optimizedRoute,
  totalDistance,
  estimatedTime,
  onBack,
  includesReturn = false,
}: ResultDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border-2 border-orange-300 space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-orange-900 mb-2">✅ Route Optimized!</h2>
        <div className="bg-orange-200 inline-block px-4 py-2 rounded-lg">
          <p className="text-sm font-semibold text-orange-800">
            Total Distance: <span className="text-lg">{totalDistance} km</span>
          </p>
          <p className="text-sm font-semibold text-orange-800 mt-1">
            Estimated Time: <span className="text-lg">{estimatedTime} minutes</span>
          </p>
          {includesReturn && (
            <p className="text-xs text-orange-700 mt-2">
              ✓ Includes return to starting point
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-orange-900 mb-3">Recommended Route:</h3>
        {optimizedRoute.map((location, index) => (
          <div
            key={location.id}
            className="p-3 bg-orange-100 border-l-4 border-orange-600 rounded"
          >
            <div className="flex items-start gap-3">
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-orange-900">{location.name}</p>
                {index < optimizedRoute.length - 1 && (
                  <p className="text-xs text-orange-700 mt-1">
                    ⬇️ Next location
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium mt-4"
      >
        Plan Another Trip
      </button>
    </div>
  );
}
