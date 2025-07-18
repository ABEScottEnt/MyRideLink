import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionTitle from "@/components/common/SectionTitle";
import RideComparisonList from "@/components/rides/RideComparisonList";
import { uberData, lyftData } from "@/components/rides/testRides";
import RideMap from "@/components/rides/RideMap";
import LocationSearch from "@/components/common/LocationSearch";

export default function Rides() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const handleSubmit = () => {
    // Replace with your search logic
    alert(`From: ${from}, To: ${to}`);
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView className="flex-1 bg-gray-50">
        <View style={styles.contentContainer}>
          <SectionTitle
            title="Rides"
            subtitle="Compare Uber, Lyft, and more. Find the best ride for your trip."
          />
          <LocationSearch
            fromValue={from}
            toValue={to}
            onChangeFrom={setFrom}
            onChangeTo={setTo}
            onClearFrom={() => setFrom("")}
            onClearTo={() => setTo("")}
            onSubmit={handleSubmit}
            submitText="Find Rides"
          />
          <RideMap />
          <RideComparisonList title="Uber" eta="2-5 min" rides={uberData} />
          <RideComparisonList title="Lyft" eta="3-6 min" rides={lyftData} />
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
    justifyContent: "center", // ⬅️ Center vertically (optional)
    // alignItems: "center", // Remove to allow full width
    // paddingHorizontal: 16, // Remove to let contentContainer handle padding
  },
  contentContainer: {
    width: "90%",
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center", // ⬅️ Center the text inside Text
  },
});
