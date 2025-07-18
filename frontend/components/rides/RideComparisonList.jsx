import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const rideTypeIcons = {
  Uber: <Ionicons name="car-outline" size={18} color="#333" />,
  Shared: <MaterialCommunityIcons name="car-multiple" size={18} color="#333" />,
  UberXL: <MaterialCommunityIcons name="car-electric" size={18} color="#333" />,
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
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{title}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f2f2f2",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 10,
          }}
        >
          <Ionicons name="time-outline" size={14} color="#555" />
          <Text style={{ fontSize: 12, color: "#555", marginLeft: 4 }}>
            {eta}
          </Text>
        </View>
      </View>

      {/* Ride Cards */}
      {rides.map(({ type, seats, price, waitTime }, index) => (
        <View
          key={index}
          style={{
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 12,
            marginBottom: 12,
            shadowColor: "#000",
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
                <Ionicons name="car-outline" size={18} color="#333" />
              )}
              <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 6 }}>
                {type}
              </Text>
            </View>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>${price}</Text>
          </View>

          {/* Seats + ETA Badge */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: "#555" }}>{seats} seats</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 10,
              }}
            >
              <Ionicons name="time-outline" size={14} color="#555" />
              <Text style={{ fontSize: 12, color: "#555", marginLeft: 4 }}>
                {waitTime}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
