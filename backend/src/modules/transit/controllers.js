import {
  findRoutesService
} from "./services.js";
import fs from "fs";
import path from "path";

const loadCSV = (filePath) => {
  const data = fs.readFileSync(filePath, "utf8").trim().split("\n");
  const headers = data.shift().split(",");
  return data.map(row => {
    const values = row.split(",");
    return headers.reduce((obj, h, i) => {
      obj[h] = values[i];
      return obj;
    }, {});
  });
};

const GTFS_PATH = path.join(process.cwd(), "gtfs");

// Load data once at module initialization (not per request)
let stops, routes, trips, stopTimes;

const initializeGTFSData = () => {
  try {
    console.log("Loading GTFS data...");
    stops = loadCSV(`${GTFS_PATH}/stops.txt`);
    routes = loadCSV(`${GTFS_PATH}/routes.txt`);
    trips = loadCSV(`${GTFS_PATH}/trips.txt`);
    stopTimes = loadCSV(`${GTFS_PATH}/stop_times.txt`);
    console.log("GTFS data loaded successfully");
    console.log(`Loaded ${stops.length} stops, ${routes.length} routes, ${trips.length} trips`);
  } catch (error) {
    console.error("FAILED to load GTFS data:", error.message);
    console.error("Make sure 'gtfs' folder exists with stops.txt, routes.txt, trips.txt, stop_times.txt");
    throw error; // Crash the server - can't run without data
  }
};

// Call it once when module loads
initializeGTFSData();
// FIXED: Correct haversine formula
const distance = (lat1, lon1, lat2, lon2) => {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findRoutesController = async (req, res) => {
  try {
    // Check if GTFS data is loaded
    if (!stops || !routes || !trips || !stopTimes) {
      return res.status(503).json({
        error: "GTFS data not loaded yet. Server still initializing."
      });
    }

    const { fromLat, fromLon, toLat, toLon } = req.query;

    if (!fromLat || !fromLon || !toLat || !toLon) {
    return res.status(400).json({
        error: "fromLat, fromLon, toLat, toLon required",
    });
    }

// FIXED: Convert strings to numbers

    // FIXED: Convert strings to numbers
    const fromLatNum = parseFloat(fromLat);
    const fromLonNum = parseFloat(fromLon);
    const toLatNum = parseFloat(toLat);
    const toLonNum = parseFloat(toLon);

    // Validate they're valid numbers
    if (isNaN(fromLatNum) || isNaN(fromLonNum) || isNaN(toLatNum) || isNaN(toLonNum)) {
      return res.status(400).json({
        error: "All coordinates must be valid numbers",
      });
    }

    // 1️⃣ Find nearest stops - FIXED: Parse lat/lon from CSV
    const nearestFromStops = stops
      .map(s => ({
        ...s,
        d: distance(fromLatNum, fromLonNum, parseFloat(s.stop_lat), parseFloat(s.stop_lon)),
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 5);

    const nearestToStops = stops
      .map(s => ({
        ...s,
        d: distance(toLatNum, toLonNum, parseFloat(s.stop_lat), parseFloat(s.stop_lon)),
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 5);

    const fromStopIds = new Set(nearestFromStops.map(s => s.stop_id));
    const toStopIds = new Set(nearestToStops.map(s => s.stop_id));

    // 2️⃣ Trips serving from/to stops
    const fromTrips = new Set(
      stopTimes.filter(st => fromStopIds.has(st.stop_id))
               .map(st => st.trip_id)
    );

    const toTrips = new Set(
      stopTimes.filter(st => toStopIds.has(st.stop_id))
               .map(st => st.trip_id)
    );

    // 3️⃣ Common trips
    // 3️⃣ Common trips - FIXED: Check stop sequence order
const validTrips = [...fromTrips].filter(tripId => {
  if (!toTrips.has(tripId)) return false;
  
  // Get all stops for this trip in order
  const tripStops = stopTimes
    .filter(st => st.trip_id === tripId)
    .sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence));
  
  // Find positions of from/to stops
  const fromIndex = tripStops.findIndex(st => fromStopIds.has(st.stop_id));
  const toIndex = tripStops.findIndex(st => toStopIds.has(st.stop_id));
  
  // Valid only if from comes before to
  return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
});

if (!validTrips.length) {
  return res.json({
    message: "No direct MARTA route found (transfer needed)",
    fromStops: nearestFromStops,
    toStops: nearestToStops,
  });
}

    // 4️⃣ Get routes
    // 4️⃣ Get routes
    const routeIds = new Set(
    trips
        .filter(t => validTrips.includes(t.trip_id))
        .map(t => t.route_id)
    );

    const matchedRoutes = routes.filter(r =>
      routeIds.has(r.route_id)
    );

    return res.status(200).json({
      fromStops: nearestFromStops,
      toStops: nearestToStops,
      routes: matchedRoutes,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};