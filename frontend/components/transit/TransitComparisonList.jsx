import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/theme";

const TRANSIT_BLUE = COLORS.primary;
const TRANSIT_GREEN = COLORS.secondary;

export default function TransitComparisonList({ routes }) {
  // Safety check: if no routes provided, render a message or empty view
  if (!routes || routes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No routes available</Text>
      </View>
    );
  }

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

  const showTransitStep = (step, index) => {
    const iconType = step.type === "bus" ? "bus" : "train";
    const backgroundColor = step.type === "bus" ? TRANSIT_BLUE : TRANSIT_GREEN;

    return (
      <View key={index} style={styles.stepContainer}>
        <View style={[styles.stepIcon, { backgroundColor }]}>
          <Ionicons name={iconType} size={14} color={COLORS.white} />
        </View>
        <View style={styles.stepDetails}>
          <Text style={styles.stepLane}>{step.Lane}</Text>
          <Text style={styles.stepRoute}>
            {step.Start} {step.Stop ? `→ ${step.Stop}` : ""}
          </Text>
          <Text style={styles.stepDuration}>{step.Duration}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.recommendSection}>
      <Text style={styles.routesTitle}>Recommended Routes</Text>
      {routes.map((route) => (
        <View key={route.id} style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeTitle}>{route.name}</Text>
            <Text style={styles.routeLabel}>{getRouteLabel(route.type)}</Text>
          </View>

          <View style={styles.mainRoute}>
            <View style={styles.routeTimeContainer}>
              <Ionicons name="time-outline" size={14} color={COLORS.muted} />
              <Text style={styles.routeTime}>{route.time}</Text>
            </View>
            <Text style={styles.routeAmount}>{route.amount}</Text>
          </View>

          <View style={styles.routeSteps}>
            {route.steps.map((step, i) => showTransitStep(step, i))}
          </View>

          <View style={styles.nextDepartureContainer}>
            <Ionicons name="time-outline" size={14} color={COLORS.muted} />
            <Text style={styles.nextDepartureText}>
              Next departure: {route.NextDeparture}
            </Text>
          </View>
        </View>
      ))}
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
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
  },
});
