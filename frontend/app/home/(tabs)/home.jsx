import { ScrollView, View, StyleSheet, Text, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LocationSearch from "@/components/common/LocationSearch";
import QuickAccessCard from "@/components/home/QuickAccessCard";
import RecentActivity from "@/components/home/RecentActivity";
import React, { useState } from "react";
import COLORS from "@/constants/theme";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const handleRides = () => {
    Alert.alert("Find Rides", `From: ${from}, To: ${to}`);
  };
  const handleTransit = () => {
    Alert.alert("Find Transit", `From: ${from}, To: ${to}`);
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <LocationSearch
            fromValue={from}
            toValue={to}
            onChangeFrom={setFrom}
            onChangeTo={setTo}
            onClearFrom={() => setFrom("")}
            onClearTo={() => setTo("")}
            buttons={[
              { label: "Rides", onPress: handleRides },
              { label: "Transit", onPress: handleTransit },
            ]}
          />
          <View style={styles.accessGrid}>
            <QuickAccessCard
              label="Rideshare"
              sublabel="Uber, Lyft & more"
              iconName="car-outline"
              iconColor={COLORS.primary}
            />
            <QuickAccessCard
              label="Transit"
              sublabel="Bus, train & metro"
              iconName="train-outline"
              iconColor={COLORS.primary}
            />
            <QuickAccessCard
              label="Car Rental"
              sublabel="Turo, Zipcar & more"
              iconName="key-outline"
              iconColor={COLORS.gradientEnd}
            />
            <QuickAccessCard
              label="Account"
              sublabel="Profile & settings"
              iconName="person-outline"
              iconColor={COLORS.gradientEnd}
            />
          </View>
          <RecentActivity />
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
  logoContainer: {
    alignItems: "center",
    marginTop: 0,
    marginBottom: 0,
  },
  logo: {
    width: 180,
    height: 180,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  contentContainer: {
    width: "90%",
    alignSelf: "center",
  },
  accessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
