// src/components/rentals/RentalSearch.jsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import COLORS from "@/constants/theme";

export default function RentalSearch() {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Search Rentals</Text>
      <Text style={styles.subHeading}>
        Choose location, duration, and car type.
      </Text>

      <TextInput style={styles.input} placeholder="Enter location" placeholderTextColor={COLORS.muted} />
      <TextInput style={styles.input} placeholder="Duration" placeholderTextColor={COLORS.muted} />
      <TextInput style={styles.input} placeholder="Car Type" placeholderTextColor={COLORS.muted} />

      <TouchableOpacity style={styles.searchBtn}>
        <Text style={styles.searchText}>Search Cars</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
  },
  subHeading: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderRadius: 8,
    borderColor: COLORS.muted,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 12,
    color: COLORS.text,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  searchText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
