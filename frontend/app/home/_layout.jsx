import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.gradientStart, // Teal
        tabBarInactiveTintColor: COLORS.muted, // Muted gray
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "(tabs)/home":
              iconName = "home-outline";
              break;
            case "(tabs)/rides":
              iconName = "car-outline";
              break;
            case "(tabs)/transit":
              iconName = "train-outline";
              break;
            case "(tabs)/rentals":
              iconName = "key-outline";
              break;
            case "(tabs)/account":
              iconName = "person-outline";
              break;
            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen name="(tabs)/home" options={{ title: "Home" }} />
      <Tabs.Screen name="(tabs)/rides" options={{ title: "Rides" }} />
      <Tabs.Screen name="(tabs)/transit" options={{ title: "Transit" }} />
      <Tabs.Screen name="(tabs)/rentals" options={{ title: "Rentals" }} />
      <Tabs.Screen name="(tabs)/account" options={{ title: "Account" }} />
    </Tabs>
  );
}
