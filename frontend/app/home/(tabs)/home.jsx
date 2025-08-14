import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import LocationSearch from "@/components/shared/LocationSearch";
import QuickAccessCard from "@/components/home/QuickAccessCard";
import RecentActivity from "@/components/home/RecentActivity";
import { useState } from "react";
import COLORS from "@/constants/theme";

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromPlace, setFromPlace] = useState(null);
  const [toPlace, setToPlace] = useState(null);
  const handleRides = () => {
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
      "Find Rides",
      `From: ${from}, To: ${to}${coords ? `\n${coords}` : ""}`
    );
  };
  const handleTransit = () => {
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
      "Find Transit",
      `From: ${from}, To: ${to}${coords ? `\n${coords}` : ""}`
    );
  };
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/logo.png")}
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
            onSelectFrom={(item) => setFromPlace(item)}
            onSelectTo={(item) => setToPlace(item)}
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
    backgroundColor: COLORS.background, // theme background color here
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
    backgroundColor: COLORS.background, // theme background color here as well
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
