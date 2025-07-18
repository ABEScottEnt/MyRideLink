import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/theme";

const data = [
  {
    id: "1",
    title: "Downtown → Airport",
    time: "Yesterday, 3:30 PM",
    price: "$24.50",
    rating: "4.9",
    type: "car",
  },
  {
    id: "2",
    title: "Metro Line 2",
    time: "2 days ago, 8:15 AM",
    price: "$2.75",
    duration: "25 min",
    type: "train",
  },
  {
    id: "3",
    title: "Downtown → Airport",
    time: "2 days ago, 8:15 AM",
    price: "$2.75",
    duration: "25 min",
    type: "train",
  },
  {
    id: "4",
    title: "Metro Line 3",
    time: "1 days ago, 8:15 AM",
    price: "$2.75",
    duration: "25 min",
    type: "train",
  },
];

const iconMap = {
  car: "car-outline",
  train: "train-outline",
};

const RecentActivity = () => {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.left}>
        <Ionicons
          name={iconMap[item.type]}
          size={20}
          color={COLORS.primary}
          style={styles.itemIcon}
        />
        <View style={styles.textBlock}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.sub}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.price}>{item.price}</Text>
        {item.rating ? (
          <Text style={styles.meta}>⭐ {item.rating}</Text>
        ) : (
          <Text style={styles.meta}>{item.duration}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          name="time-outline"
          size={24}
          color="#333"
          style={styles.clockIcon}
        />
        <Text style={styles.header}>Recent Activity</Text>
      </View>
      <View style={styles.list}>
        {data.map((item) => (
          <View key={item.id} style={styles.itemContainer}>
            <View style={styles.left}>
              <Ionicons
                name={iconMap[item.type]}
                size={20}
                color={COLORS.primary}
                style={styles.itemIcon}
              />
              <View style={styles.textBlock}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.sub}>{item.time}</Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text style={styles.price}>{item.price}</Text>
              {item.rating ? (
                <Text style={styles.meta}>⭐ {item.rating}</Text>
              ) : (
                <Text style={styles.meta}>{item.duration}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.muted,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  clockIcon: {
    marginRight: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.gradientEnd,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f1f1f1",
    marginBottom: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIcon: {
    marginRight: 12,
  },
  textBlock: {
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  sub: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
    width: 80,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  meta: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
});

export default RecentActivity;
