'use client';

import { useState, useRef, useEffect } from 'react';
import { Location } from '@/types';

interface LocationAutocompleteProps {
  onSelectLocation: (location: Location) => void;
  placeholder?: string;
  debounceDelay?: number;
}

export default function LocationAutocomplete({
  onSelectLocation,
  placeholder = 'Search location',
  debounceDelay = 500,
}: LocationAutocompleteProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=10`
      );

      if (!response.ok) throw new Error('Failed to fetch suggestions');

      const data = await response.json();

      const locations: Location[] = data.map(
        (item: any, index: number) => ({
          id: `${item.lat}-${item.lon}-${index}`,
          name: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        })
      );

      setSuggestions(locations);
      setShowSuggestions(true);
    } catch (err) {
      setError('Failed to fetch suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, debounceDelay);
  };

  const handleSelectSuggestion = (location: Location) => {
    setInput(location.name);
    setShowSuggestions(false);
    setSuggestions([]);
    onSelectLocation(location);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition text-gray-900 bg-white placeholder-gray-500"
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-64 overflow-y-auto shadow-lg z-50">
          {suggestions.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelectSuggestion(location)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
            >
              <div className="flex items-start gap-3">
                <div className="text-blue-500 mt-1">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">
                    {location.name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {location.name.split(',').slice(1).join(',').trim()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && !loading && suggestions.length === 0 && input.length >= 2 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 px-4 py-3 text-gray-600 text-sm z-50">
          No locations found. Try a different search.
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
