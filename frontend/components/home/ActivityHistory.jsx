import React, { useState, useMemo } from "react";
import {View,Text,StyleSheet,FlatList,TextInput,TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";

const iconMap = {
  car: "car-outline",
  train: "train-outline",
};

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export default function ActivityHistory() {
  const router = useRouter();
  const params = useLocalSearchParams();

  
  const data = params.allData ? JSON.parse(params.allData) : [];

  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("all");

  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Past 7 Days", value: "7" },
    { label: "Past 30 Days", value: "30" },
  ];

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchText.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "all") return true;

      const activityDate = new Date(item.time);
      const daysAgo = getDateDaysAgo(parseInt(filter));
      return activityDate >= daysAgo;
    });
  }, [searchText, filter, data]);

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
          <Text style={styles.sub}>{new Date(item.time).toLocaleString()}</Text>
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
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 12 }}
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>

      <Text style={styles.screenTitle}>Activity History</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by title..."
        placeholderTextColor={COLORS.muted}
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterButton,
              filter === option.value && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(option.value)}
          >
            <Text
              style={[
                styles.filterText,
                filter === option.value && styles.filterTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredData.length === 0 ? (
        <Text style={styles.emptyText}>No activities found.</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.text,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.muted,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.muted,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
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
  emptyText: {
    fontSize: 16,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 40,
  },
});
