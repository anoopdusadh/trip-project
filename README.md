# Trip Optimizer

A web application that helps you plan the most efficient route to visit multiple locations in a city, minimizing travel time.

## Features

- 🗺️ **Interactive Map**: Visualize all your locations with Leaflet
- 📍 **Location Search**: Search locations by name or enter GPS coordinates
- ⚡ **Route Optimization**: Automatically calculates the most efficient route using the Nearest Neighbor algorithm
- 🎨 **Beautiful UI**: Clean, responsive interface built with React and Tailwind CSS
- 📱 **Mobile Responsive**: Works seamlessly on desktop and mobile devices

## How It Works

1. **Add Locations**: Search for places by name (e.g., "Eiffel Tower", "Paris Museum") or enter GPS coordinates manually
2. **View on Map**: All locations are displayed on an interactive map
3. **Optimize Route**: Click "Optimize Route" to calculate the most efficient path visiting all locations
4. **Follow the Route**: The optimized route is shown with numbered markers and connecting lines

## Algorithm

The app uses the **Nearest Neighbor Heuristic** for the Traveling Salesman Problem (TSP):
- Starts from the first location
- Finds the nearest unvisited location
- Repeats until all locations are visited
- Fast and efficient for typical city tours

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup

```bash
# Clone the repository or navigate to the project directory
cd trip-project

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Adding Locations

1. **By Search**: Enter a location name and click "Search Location"
   - Uses OpenStreetMap Nominatim API (free, no API key required)
   - Automatically finds coordinates

2. **By Coordinates**: Enter latitude and longitude manually
   - Click "Add Manual" to add the location

### Optimizing Routes

1. Add at least 2 locations
2. Click the "Optimize Route" button
3. View the optimized path on the map and in the sidebar

### Map Interactions

- **Zoom**: Scroll to zoom in/out
- **Pan**: Click and drag to move around
- **Markers**: Click on markers to see location details

## Technologies Used

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React Leaflet
- **Geocoding**: OpenStreetMap Nominatim API
- **Algorithm**: Nearest Neighbor TSP Solver

## File Structure

```
src/
├── app/
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── LocationInput.tsx  # Location search/input component
│   ├── Map.tsx            # Map visualization component
│   └── RouteOptimizer.tsx # Route optimization component
├── types/
│   └── index.ts          # TypeScript type definitions
└── utils/                 # Utility functions (if needed)
```

## API

The application uses the OpenStreetMap Nominatim API for geocoding:
- **Endpoint**: `https://nominatim.openstreetmap.org/search`
- **Free Tier**: Available without API key
- **Rate Limit**: 1 request per second (respected in the app)

## Customization

### Changing the Algorithm

To use a different optimization algorithm, modify the `nearestNeighborTSP` function in `src/components/RouteOptimizer.tsx`.

### Map Styling

Customize map appearance in `src/components/Map.tsx`:
- Change the TileLayer URL for different map styles
- Modify marker colors and styles
- Adjust polyline appearance

## Limitations

- Nearest Neighbor heuristic gives good results but may not always find the absolute shortest route
- For best results, keep the number of locations under 20
- Route optimization assumes traveling by direct distance (as the crow flies)

## Future Enhancements

- [ ] Integration with routing APIs (Google Maps, OSRM) for actual driving distances
- [ ] Multiple route optimization algorithms (Ant Colony, Genetic Algorithm)
- [ ] Estimated time based on travel mode (driving, walking, transit)
- [ ] Save/export routes
- [ ] Dark mode
- [ ] Route history

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or feature requests, please create an issue in the repository.

---

Happy trip planning! 🎉✈️
