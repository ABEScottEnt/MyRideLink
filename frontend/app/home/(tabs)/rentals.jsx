import { useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import SectionTitle from "@/components/shared/SectionTitle";
import RentalSearch from "@/components/rentals/RentalSearch";
import RentalComparisonList from "@/components/rentals/RentalComparisonList";
import rentalData from "@/data/testRentals";
import COLORS from "@/constants/theme";

export default function Rentals() {
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [carType, setCarType] = useState("");

  const handleSubmit = () => {
    alert(`Searching ${carType} in ${location} for ${duration}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <SectionTitle
            title="Rentals"
            subtitle="Find cars from Turo, Zipcar and more."
          />
          <RentalSearch
            location={location}
            duration={duration}
            carType={carType}
            setLocation={setLocation}
            setDuration={setDuration}
            setCarType={setCarType}
            onSubmit={handleSubmit}
          />
          <RentalComparisonList data={rentalData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background, // theme background color
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background, // theme background color
  },
  contentContainer: {
    width: "90%",
    alignSelf: "center",
    paddingTop: 12,
    paddingBottom: 24,
  },
});
