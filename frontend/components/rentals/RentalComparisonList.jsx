import { View, Text, StyleSheet } from "react-native";
import RentalCard from "@/components/rentals/RentalCard";
import COLORS from "@/constants/theme";

export default function RentalComparisonList({ data }) {
  return (
    <View style={styles.container}>
      {data.map((group, index) => (
        <View key={index} style={styles.groupContainer}>
          <Text style={styles.company}>{group.company}</Text>
          {group.cars.map((car, i) => (
            <RentalCard key={i} car={car} />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  groupContainer: {
    marginBottom: 20,
  },
  company: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.secondary,
    marginBottom: 10,
    marginTop: 10,
  },
});
