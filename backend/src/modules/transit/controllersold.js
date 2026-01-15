import {
  findRoutesService
} from "./services.js";

/*export const findRoutesController = async (req, res) => {
  console.log("controller called");

  try {
    return res.status(200).json({ message: "Hello World" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};*/
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

const stops = loadCSV(`${GTFS_PATH}/stops.txt`);
const routes = loadCSV(`${GTFS_PATH}/routes.txt`);
const trips = loadCSV(`${GTFS_PATH}/trips.txt`);
const stopTimes = loadCSV(`${GTFS_PATH}/stop_times.txt`);

const distance = (lat1, lon1, lat2, lon2) => {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  return R * Math.sqrt(dLat ** 2 + dLon ** 2);
};

export const findRoutesController = async (req, res) => {
  try {
    const { fromLat, fromLon, toLat, toLon } = req.query;

    if (!fromLat || !fromLon || !toLat || !toLon) {
      return res.status(400).json({
        error: "fromLat, fromLon, toLat, toLon required",
      });
    }

    // 1️⃣ Find nearest stops
    const nearestFromStops = stops
      .map(s => ({
        ...s,
        d: distance(fromLat, fromLon, s.stop_lat, s.stop_lon),
      }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 5);

    const nearestToStops = stops
      .map(s => ({
        ...s,
        d: distance(toLat, toLon, s.stop_lat, s.stop_lon),
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
    const commonTrips = [...fromTrips].filter(t => toTrips.has(t));

    if (!commonTrips.length) {
      return res.json({
        message: "No direct MARTA route found (transfer needed)",
        fromStops: nearestFromStops,
        toStops: nearestToStops,
      });
    }

    // 4️⃣ Get routes
    const routeIds = new Set(
      trips
        .filter(t => commonTrips.includes(t.trip_id))
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
