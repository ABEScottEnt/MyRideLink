import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/theme";

const TRANSIT_BLUE = COLORS.primary;
const TRANSIT_GREEN = COLORS.secondary;

const defaultRoutedata = [
  {
    id: 1,
    name: "Route 1",
    time: "35 min",
    type: "fastest",
    amount: "$3.25",
    steps: [
      {
        type: "bus",
        Lane: "Bus 42",
        Start: "Main St",
        Stop: "Metro Center",
        Duration: "15 min",
      },
      {
        type: "Metro",
        Lane: "Metro Red Line",
        Start: "Metro Center",
        Stop: "Downtown",
        Duration: "20 min",
      },
    ],
    NextDeparture: "8 min",
  },
  {
    id: 2,
    name: "Route 2",
    time: "48 min",
    type: "cheapest",
    amount: "$2.50",
    steps: [
      {
        type: "bus",
        Lane: "Bus 15",
        Start: "Main St",
        Stop: "Union Station",
        Duration: "28 min",
      },
      {
        type: "bus",
        Lane: "Bus 8",
        Start: "Union Station",
        Stop: "Downtown",
        Duration: "20 min",
      },
    ],
    NextDeparture: "12 min",
  },
  {
    id: 3,
    name: "Route 3",
    time: "42 min",
    type: "Least walking",
    amount: "$3.00",
    steps: [
      {
        type: "Metro",
        Lane: "Metro Blue Line",
        Start: "Direct Route",
        Duration: "42 min",
      },
    ],
    NextDeparture: "5 min",
  },
];

const showTransitStep = (step, index) => {
  const iconType = step.type === "bus" ? "bus" : "train";
  const iconColor = step.type === "bus" ? TRANSIT_BLUE : TRANSIT_GREEN;
  const backgroundColor = step.type === "bus" ? TRANSIT_BLUE : TRANSIT_GREEN;

  return (
    <View key={index} style={styles.stepContainer}>
      <View style={[styles.stepIcon, { backgroundColor }]}>
        <Ionicons name={iconType} size={14} color={COLORS.white} />
      </View>
      <View style={styles.stepDetails}>
        <Text style={styles.stepLane}>{step.Lane}</Text>
        <Text style={styles.stepRoute}>
          {step.Start} → {step.Stop}
        </Text>
        <Text style={styles.stepDuration}>{step.Duration}</Text>
      </View>
    </View>
  );
};

const displayRoute = (route) => {
  const getRouteLabel = (type) => {
    switch (type) {
      case "fastest":
        return "Fastest";
      case "cheapest":
        return "Cheapest";
      case "Least walking":
        return "Least walking";
      default:
        return "";
    }
  };

  return (
    <View key={route.id} style={styles.routeCard}>
      <View style={styles.routeHeader}>
        <Text style={styles.routeTitle}>{route.name}</Text>
        <Text
          style={[
            styles.routeLabel,
            { color: TRANSIT_BLUE, backgroundColor: "#e6f0ff" },
          ]}
        >
          {getRouteLabel(route.type)}
        </Text>
      </View>
      <View style={styles.mainRoute}>
        <View style={styles.routeTimeContainer}>
          <Ionicons name="time-outline" size={14} color={COLORS.muted} />
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
        <Ionicons name="time-outline" size={14} color={COLORS.muted} />
        <Text style={styles.nextDepartureText}>
          Next departure: {route.NextDeparture}
        </Text>
      </View>
    </View>
  );
};

export default function TransitComparisonList({ routes = defaultRoutedata }) {
  return (
    <View style={styles.recommendSection}>
      <Text style={styles.routesTitle}>Recommended Routes</Text>
      {routes.map((route) => displayRoute(route))}
    </View>
  );
}

const styles = StyleSheet.create({
  recommendSection: {
    marginTop: 24,
  },
  routesTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: COLORS.gradientEnd,
  },
  routeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.muted,
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  routeLabel: {
    fontSize: 13,
    fontWeight: "500",
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mainRoute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  routeTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeTime: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.text,
  },
  routeAmountContainer: {},
  routeAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.gradientEnd,
  },
  routeSteps: {
    marginBottom: 8,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  stepIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  stepDetails: {},
  stepLane: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.text,
  },
  stepRoute: {
    fontSize: 12,
    color: COLORS.muted,
  },
  stepDuration: {
    fontSize: 12,
    color: COLORS.muted,
  },
  nextDepartureContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextDepartureText: {
    fontSize: 12,
    color: COLORS.muted,
    marginLeft: 4,
  },
});
