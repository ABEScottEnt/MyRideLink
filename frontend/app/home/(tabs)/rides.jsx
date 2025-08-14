import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import SectionTitle from "@/components/shared/SectionTitle";
import RideComparisonList from "@/components/rides/RideComparisonList";
import { uberData, lyftData } from "@/data/testRides";
import RideMap from "@/components/rides/RideMap";
import LocationSearch from "@/components/shared/LocationSearch";
import COLORS from "@/constants/theme";

export default function Rides() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromPlace, setFromPlace] = useState(null);
  const [toPlace, setToPlace] = useState(null);

  const handleSubmit = () => {
    const coords = [
      fromPlace
        ? `From(${fromPlace.lat?.toFixed?.(5)}, ${fromPlace.lon?.toFixed?.(5)})`
        : null,
      toPlace
        ? `To(${toPlace.lat?.toFixed?.(5)}, ${toPlace.lon?.toFixed?.(5)})`
        : null,
    ]
      .filter(Boolean)
      .join(" | ");
    Alert.alert(
      "Search Tapped!",
      `From: ${from}, To: ${to}${coords ? `\n${coords}` : ""}`
    );
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
            onSelectFrom={(item) => setFromPlace(item)}
            onSelectTo={(item) => setToPlace(item)}
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
