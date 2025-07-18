import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react';
import {Ionicons, MaterialIcons} from '@expo/vector-icons'
import { WebView } from "react-native-webview";

export default function Rides() {

  const generateMapHtml = () => {
    const filteredTrains = 'ALL'
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

  const Routedata = [
    {
      id: 1,
      name: 'Route 1',
      time: '35 min',
      type: 'fastest',
      amount: '$3.25',
      steps: [
        {
          type: 'bus',
          Lane: 'Bus 42',
          Start: 'Main St',
          Stop: 'Metro Center',
          Duration: '15 min',
        },
        {
          type: 'Metro',
          Lane: 'Metro Red Line',
          Start: 'Metro Center',
          Stop: 'Downtown',
          Duration: '20 min',
        }
      ],
      NextDeparture: '8 min',
    },
    {
      id: 2,
      name: 'Route 2',
      time: '48 min',
      type: 'cheapest',
      amount: '$2.50',
      steps: [
        {
          type: 'bus',
          Lane: 'Bus 15',
          Start: 'Main St',
          Stop: 'Union Station',
          Duration: '28 min',
        },
        {
          type: 'bus',
          Lane: 'Bus 8',
          Start: 'Union Station',
          Stop: 'Downtown',
          Duration: '20 min',
        }
      ],
      NextDeparture: '12 min',
    },
    {
      id: 3,
      name: 'Route 3',
      time: '42 min',
      type: 'Least walking',
      amount: '$3.00',
      steps: [
        {
          type: 'Metro',
          Lane: 'Metro Blue Line',
          Start: 'Direct Route',
          Duration: '42 min',
        },
      ],
      NextDeparture: '5 min',
    },
  ];

  const showTransitStep = (step, index) => {
    const iconType = step.type === 'bus' ? 'bus' : 'train';
    const iconColor = step.type === 'bus' ? '#4285f4' : '#34a853';
    const backgroundColor = step.type === 'bus' ? '#4285f4' : '#34a853';

    return (
        <View key={index} style={styles.stepContainer}>
          <View style={[styles.stepIcon, { backgroundColor }]}>
            <Ionicons name={iconType} size={14} color="#fff" />
          </View>
          <View style={styles.stepDetails}>
            <Text style={styles.stepLane}>{step.Lane}</Text>
            <Text style={styles.stepRoute}>{step.Start} → {step.Stop}</Text>
            <Text style={styles.stepDuration}>{step.Duration}</Text>
          </View>
        </View>
    );
  };
  const displayRoute = (route) => {
    const getRouteLabel = (type) => {
      switch (type) {
        case 'fastest':
          return 'Fastest';
        case 'cheapest':
          return 'Cheapest';
        case 'Least walking':
          return 'Least walking';
        default:
          return '';
      }
    };

    return (
        <View key={route.id} style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>{route.name}</Text>
            <Text style={styles.routeLabel}>{getRouteLabel(route.type)}</Text>
          </View>
          <View style={styles.mainRoute}>
            <View style={styles.routeTimeContainer}>
              <Ionicons name="time-outline" size={14} color="#666" />
              <Text style={styles.routeTime}>{route.time}</Text>
            </View>
            <View style={styles.routeAmountContainer}>
              <Text style={styles.routeAmount}>{route.amount}</Text>
            </View>
          </View>

          <View style={styles.routeSteps}>
            {route.steps.map((step, index) => showTransitStep(step, index))}
          </View>
          <View style={styles.nextDepartureContainer}>
            <Ionicons name="time-outline" size={12} color="#666" />
            <Text style={styles.nextDepartureText}>Next departure: {route.NextDeparture}</Text>
          </View>
        </View>
    );
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

            <View style={styles.recommendSection}>
              <Text style={styles.routesTitle}>Recommended Routes</Text>
              {Routedata.map(route => displayRoute(route))}
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
  routesTitle: {
    fontSize: 16,  
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,  
    marginBottom: 12,  
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,  
  },
  routeTitle: {
    fontSize: 14,  
    fontWeight: '600',
    color: '#333',
  },
  routeLabel: {
    fontSize: 11, 
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 6,  
    paddingVertical: 3,    
    borderRadius: 4,
  },

  mainRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,  
  },
  routeTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeTime: {
    fontSize: 13,  
    color: '#666',
    marginLeft: 4,
  },
  routeAmountContainer: {
    alignItems: 'flex-end',
  },
  routeAmount: {
    fontSize: 14,  
    fontWeight: '600',
    color: '#333',
  },
  routeSteps: {
    marginBottom: 10,  
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,  
  },
  stepIcon: {
    width: 20,  
    height: 20, 
    borderRadius: 10,  
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,  
  },
  stepDetails: {
    flex: 1,
  },
  stepLane: {
    fontSize: 13,  
    fontWeight: '600',
    color: '#333',
  },
  stepRoute: {
    fontSize: 11,  
    color: '#666',
    marginTop: 1,  
  },
  stepDuration: {
    fontSize: 11,  
    color: '#999',
    marginTop: 1,  
  },
  nextDepartureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextDepartureText: {
    fontSize: 11,  
    color: '#666',
    marginLeft: 4,
  },
})
