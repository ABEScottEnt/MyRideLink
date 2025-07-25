import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionTitle from "@/components/common/SectionTitle";
import RideComparisonList from "@/components/rides/RideComparisonList";
import { uberData, lyftData } from "@/data/testRides";
import RideMap from "@/components/rides/RideMap";
import LocationSearch from "@/components/common/LocationSearch";
import COLORS from "@/constants/theme";

export default function Rides() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSubmit = () => {
    Alert.alert("Search Tapped!", `From: ${from}, To: ${to}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
    backgroundColor: COLORS.background, // Use theme background color here
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background, // And here for ScrollView content container
  },
  contentContainer: {
    width: "90%",
    alignSelf: "center",
  },
});
