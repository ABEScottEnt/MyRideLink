import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@expo/vector-icons'
import { WebView } from "react-native-webview";

export default function Rides() {

  const generateMapHtml = () => {
    const filteredTrains = 'ALL'
    const trainDataString = JSON.stringify(filteredTrains);

    return `
          <!DOCTYPE html>
          <html>
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

  return (
      <SafeAreaView style={styles.safe}>
        <ScrollView>
          <View style={styles.container}>

            <View>
              <Text style={styles.title}>Public Transit</Text>
              <Text style={styles.subtitle}>Find the best routes and schedules</Text>
            </View>

            <View style={styles.outerLocationContainer}>
              <View style={styles.innerLocationContainer}>
                <MaterialIcons name="location-on" size={20} color="black"/>
                <TextInput style={styles.location} placeholder="Current Location"/>
              </View>
              <View style={styles.innerLocationContainer}>
                <MaterialIcons name="location-on" size={20} color="black" />
                <TextInput style={styles.location} placeholder="To"/>
              </View>
              <TouchableOpacity onPress={() => Alert.alert('Search Tapped!')} style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Find Routes</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
              <WebView
                  originWhitelist={['*']}
                  source={{ html: generateMapHtml() }}
                  style={styles.webview}
              />
            </View>

            <View style={styles.recommendationContainer}>
              <Text style={styles.recommendationText}>Recommended Routes</Text>
              <View style={styles.recommendations}>
                <Text style={styles.boldText}>Route 1</Text>
              </View>
              <View style={styles.recommendations}>
                <Text style={styles.boldText}>Route 2</Text>
              </View>
              <View style={styles.recommendations}>
                <Text style={styles.boldText}>Route 3</Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    //justifyContent: 'center',     // ⬅️ Center vertically (optional)
    //alignItems: 'center',         // ⬅️ Center everything horizontally
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    //marginTop: 8,
    //textAlign: 'center',          // ⬅️ Center the text inside Text
  },
  outerLocationContainer: {
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 2,
  },
  innerLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 8,
    margin: 10,
  },
  location: {
    //color: 'grey',
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: '#cf4d4d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center', // Centers the text vertically
    margin: 10,
  },
  buttonText:{
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 400,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  webview: {
    flex: 1,
  },
  recommendationContainer: {
    flex: 1,
  },
  recommendationText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recommendations: {
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 2,
  },
  boldText: {
    fontWeight: 'bold',
  }
})
