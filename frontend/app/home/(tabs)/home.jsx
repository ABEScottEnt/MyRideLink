import { ScrollView, View, StyleSheet, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuickSearch from "../../../components/home/QuickSearch";
import QuickAccessCard from "../../../components/home/QuickAccessCard";
import RecentActivity from "../../../components/home/RecentActivity";

export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <QuickSearch />
        <View style={styles.accessGrid}>
          <QuickAccessCard
            label="Rideshare"
            sublabel="Uber, Lyft & more"
            iconName="car-outline"
          />
          <QuickAccessCard
            label="Transit"
            sublabel="Bus, train & metro"
            iconName="train-outline"
          />
          <QuickAccessCard
            label="Car Rental"
            sublabel="Turo, Zipcar & more"
            iconName="business-outline"
          />
          <QuickAccessCard
            label="Account"
            sublabel="Profile & settings"
            iconName="person-outline"
          />
        </View>
        <RecentActivity />
      </View>
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
  accessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
