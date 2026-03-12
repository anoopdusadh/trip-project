'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import StartPointInput from '@/components/StartPointInput';
import VisitLocationsInput from '@/components/VisitLocationsInput';
import RouteSubmit from '@/components/RouteSubmit';
import ResultDisplay from '@/components/ResultDisplay';
import { Location } from '@/types';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
});

interface RouteResult {
  startPoint: Location;
  optimizedRoute: Location[];
  totalDistance: string;
  estimatedTime: number;
  includesReturn: boolean;
}

export default function Home() {
  const [startPoint, setStartPoint] = useState<Location | null>(null);
  const [visitLocations, setVisitLocations] = useState<Location[]>([]);
  const [result, setResult] = useState<RouteResult | null>(null);

  const handleSetStartPoint = (location: Location) => {
    if (location.name === '') {
      setStartPoint(null);
    } else {
      setStartPoint({ ...location, id: 'start-' + Date.now().toString() });
    }
    setResult(null);
  };

  const handleAddVisitLocation = (location: Location) => {
    setVisitLocations([
      ...visitLocations,
      { ...location, id: 'visit-' + Date.now().toString() },
    ]);
    setResult(null);
  };

  const handleRemoveVisitLocation = (id: string) => {
    setVisitLocations(visitLocations.filter(loc => loc.id !== id));
    setResult(null);
  };

  const handleClearAll = () => {
    setStartPoint(null);
    setVisitLocations([]);
    setResult(null);
  };

  const handleOptimizeRoute = (optimized: RouteResult) => {
    setResult(optimized);
  };

  const allLocations = startPoint ? [startPoint, ...visitLocations] : [];

  return (
    <main className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-[500px] flex flex-col bg-white shadow-lg overflow-hidden">
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="text-3xl font-bold text-white">🚗 Trip Optimizer</h1>
          <p className="text-blue-100 text-sm mt-2">
            Find the shortest route to visit all locations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {!result ? (
              <>
                {/* Start Point Section */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-300">
                  <StartPointInput
                    onSetStartPoint={handleSetStartPoint}
                    startPoint={startPoint}
                  />
                </div>

                {/* Visit Locations Section */}
                {startPoint && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-2 border-blue-300">
                    <VisitLocationsInput onAddLocation={handleAddVisitLocation} />

                    {visitLocations.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">
                          Added Locations ({visitLocations.length})
                        </h3>
                        {visitLocations.map((location, index) => (
                          <div
                            key={location.id}
                            className="flex items-center justify-between p-3 bg-blue-200 rounded-lg hover:bg-blue-300 transition"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-blue-900">
                                {index + 1}. {location.name}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveVisitLocation(location.id)}
                              className="ml-2 text-red-600 hover:bg-red-200 rounded p-2 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Route Submit Section */}
                {startPoint && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-300">
                    <RouteSubmit
                      startPoint={startPoint}
                      visitLocations={visitLocations}
                      onOptimize={handleOptimizeRoute}
                      onClearAll={handleClearAll}
                    />
                  </div>
                )}
              </>
            ) : (
              /* Result Display */
              <ResultDisplay
                startPoint={result.startPoint}
                optimizedRoute={result.optimizedRoute}
                totalDistance={result.totalDistance}
                estimatedTime={result.estimatedTime}
                onBack={handleClearAll}
                includesReturn={result.includesReturn}
              />
            )}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="hidden md:flex flex-1 relative">
        <MapComponent
          locations={allLocations}
          optimizedRoute={result?.optimizedRoute || null}
        />
      </div>
    </main>
  );
}
