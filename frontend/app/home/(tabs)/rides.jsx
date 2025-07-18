import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionTitle from "../../../components/common/SectionTitle";
import RideComparisonList from "../../../components/rides/RideComparisonList";
import { uberData, lyftData } from "../../../components/rides/testRides";

export default function Rides() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView className="flex-1 bg-gray-50">
        <View style={styles.container}>
          <SectionTitle title="Rides" />
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Available Rides
          </Text>
        </View>

        <RideComparisonList title="Uber" eta="2-5 min" rides={uberData} />
        <RideComparisonList title="Lyft" eta="3-6 min" rides={lyftData} />
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
    alignItems: "center", // ⬅️ Center everything horizontally
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center", // ⬅️ Center the text inside Text
  },
});
