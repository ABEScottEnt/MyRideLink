import { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import SectionTitle from "@/components/shared/SectionTitle";
import LocationSearch from "@/components/shared/LocationSearch";
import TransitMap from "@/components/transit/TransitMap";
import TransitComparisonList from "@/components/transit/TransitComparisonList";

import { testTransitData } from "@/data/testTransits";
import COLORS from "@/constants/theme";

export default function Transit() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromPlace, setFromPlace] = useState(null);
  const [toPlace, setToPlace] = useState(null);

  const getMARTA = async () => {
      // URL: https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=69f0de05-36c8-4516-a4a2-cd26c2c00d4a
      try {
        const response = await fetch("https://developerservices.itsmarta.com:18096/itsmarta/railrealtimearrivals/developerservices/traindata?apiKey=69f0de05-36c8-4516-a4a2-cd26c2c00d4a", {
          method: "GET"
        });
        const data = await response.json();

        if (response.ok) {
          console.log("API Call Success");
          //console.log(data);
        } else {
          console.log("API Call Fail");
        }
      } catch (error) {
        console.log("API call error:", error);
      }
    }
  
  const handleSubmit = () => {

    console.log("TEST");
    getMARTA();

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
            title="Public Transit"
            subtitle="Find the best routes and schedules"
          />
          <LocationSearch
            fromValue={from}
            toValue={to}
            onChangeFrom={setFrom}
            onChangeTo={setTo}
            onClearFrom={() => setFrom("")}
            onClearTo={() => setTo("")}
            onSubmit={handleSubmit}
            submitText="Find Routes"
            onSelectFrom={(item) => setFromPlace(item)}
            onSelectTo={(item) => setToPlace(item)}
          />
          <TransitMap />
          {/* Pass the imported data here */}
          <TransitComparisonList routes={testTransitData} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background, // use theme background
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.background, // use theme background here too
  },
  contentContainer: {
    width: "90%",
    alignSelf: "center",
  },
});
