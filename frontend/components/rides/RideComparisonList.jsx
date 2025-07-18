import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "@/constants/theme";

const rideTypeIcons = {
  Uber: <Ionicons name="car-outline" size={18} color={COLORS.primary} />,
  Shared: (
    <MaterialCommunityIcons
      name="car-multiple"
      size={18}
      color={COLORS.primary}
    />
  ),
  UberXL: (
    <MaterialCommunityIcons
      name="car-electric"
      size={18}
      color={COLORS.primary}
    />
  ),
};

export default function RideComparisonList({ title, eta, rides = [] }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
      {/* Header Row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: COLORS.gradientEnd,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.background,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 10,
          }}
        >
          <Ionicons name="time-outline" size={14} color={COLORS.muted} />
          <Text style={{ fontSize: 12, color: COLORS.muted, marginLeft: 4 }}>
            {eta}
          </Text>
        </View>
      </View>

      {/* Ride Cards */}
      {rides.map(({ type, seats, price, waitTime }, index) => (
        <View
          key={index}
          style={{
            backgroundColor: COLORS.white,
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          {/* Ride Icon + Type + Price */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {rideTypeIcons[type] || (
                <Ionicons name="car-outline" size={18} color={COLORS.primary} />
              )}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginLeft: 6,
                  color: COLORS.text,
                }}
              >
                {type}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: COLORS.gradientEnd,
              }}
            >
              ${price}
            </Text>
          </View>

          {/* Seats + ETA Badge */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.text }}>
              {seats} seats
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.background,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
              }}
            >
              <Ionicons name="time-outline" size={14} color={COLORS.muted} />
              <Text
                style={{ fontSize: 12, color: COLORS.muted, marginLeft: 4 }}
              >
                {waitTime}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
