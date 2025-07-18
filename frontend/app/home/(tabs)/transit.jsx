import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import TransitMap from "../../../components/transit/TransitMap";
import TransitComparisonList from "../../../components/transit/TransitComparisonList";

export default function Rides() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Public Transit</Text>
            <Text style={styles.subtitle}>
              Find the best routes and schedules
            </Text>
          </View>

          <View style={styles.outerLocationContainer}>
            <View style={styles.innerLocationContainer}>
              <MaterialIcons name="location-on" size={20} color="black" />
              <TextInput
                style={styles.location}
                placeholder="Current Location"
              />
            </View>
            <View style={styles.innerLocationContainer}>
              <MaterialIcons name="location-on" size={20} color="black" />
              <TextInput style={styles.location} placeholder="To" />
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert("Search Tapped!")}
              style={styles.buttonContainer}
            >
              <Text style={styles.buttonText}>Find Routes</Text>
            </TouchableOpacity>
          </View>

          <TransitMap />

          <TransitComparisonList />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    //justifyContent: 'center',     // ⬅️ Center vertically (optional)
    //alignItems: 'center',         // ⬅️ Center everything horizontally
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    //marginTop: 8,
    //textAlign: 'center',          // ⬅️ Center the text inside Text
  },
  outerLocationContainer: {
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 2,
  },
  innerLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "grey",
    borderWidth: 0.5,
    borderRadius: 8,
    padding: 8,
    margin: 10,
  },
  location: {
    //color: 'grey',
    width: "100%",
  },
  buttonContainer: {
    backgroundColor: "#cf4d4d",
    padding: 16,
    borderRadius: 8,
    alignItems: "center", // Centers the text horizontally
    justifyContent: "center", // Centers the text vertically
    margin: 10,
  },
  buttonText: {
    color: "#ffffff", // White text
    fontSize: 18,
    fontWeight: "bold",
  },
  mapContainer: {
    height: 400,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#EAEAEA",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  webview: {
    flex: 1,
  },
  routesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  routeCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  routeLabel: {
    fontSize: 11,
    color: "#666",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },

  mainRoute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  routeTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeTime: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  routeAmountContainer: {
    alignItems: "flex-end",
  },
  routeAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  routeSteps: {
    marginBottom: 10,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stepIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepDetails: {
    flex: 1,
  },
  stepLane: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  stepRoute: {
    fontSize: 11,
    color: "#666",
    marginTop: 1,
  },
  stepDuration: {
    fontSize: 11,
    color: "#999",
    marginTop: 1,
  },
  nextDepartureContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextDepartureText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
});
