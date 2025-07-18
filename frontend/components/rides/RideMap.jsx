import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RideMap = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="location-outline" color="#808080" size={40} />
      <Text style={styles.text}>Interactive Map will show here</Text>
      <Text color="#808080">Live Vehicle location and routes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderColor: "#ccc",
    marginVertical: 16,
  },

  text: {
    fontSize: 20,
    color: "#808080",
  },
});

export default RideMap;
