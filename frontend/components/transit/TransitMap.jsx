import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const generateMapHtml = () => {
  const filteredTrains = "ALL";
  const trainDataString = JSON.stringify(filteredTrains);

  return `
    <!DOCTYPE html>
    <html lang="">
    <head>
      <title>MARTA Map</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { padding: 0; margin: 0; }
        html, body, #map { height: 100%; width: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([33.76, -84.39], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
      </script>
    </body>
    </html>
  `;
};

export default function TransitMap() {
  return (
    <View style={styles.mapContainer}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: generateMapHtml() }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 250,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
  },
  webview: {
    flex: 1,
    borderRadius: 12,
  },
});