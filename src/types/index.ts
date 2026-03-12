export interface Location {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
}

export interface RouteLegConfig {
  lat1: number;
  lng1: number;
  lat2: number;
  lng2: number;
}

export interface OptimizationResult {
  route: Location[];
  totalDistance: number;
  estimatedTime: number;
}
