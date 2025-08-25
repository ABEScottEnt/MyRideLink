import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import COLORS from '../../constants/theme';

const tripsData = [
  { id: '1', date: 'July 15, 2024', fare: '$15', route: '123 Main St to 456 Oak Ave' },
  { id: '2', date: 'July 10, 2024', fare: '$12', route: '789 Pine St to 123 Cedar Ln' },
  { id: '3', date: 'July 5, 2024', fare: '$18', route: 'Airport to Hotel Avenue' },
];

export default function TripHistory() {
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderTrip = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <View style={styles.iconWrapper}>
        <Ionicons name="car" size={20} color={COLORS.primary} />
      </View>

      <View style={styles.tripInfo}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.routeText}>{item.route}</Text>
        <Text style={styles.fareText}>Fare: {item.fare}</Text>
      </View>

      <TouchableOpacity style={styles.star} onPress={() => toggleFavorite(item.id)}>
        <Ionicons
          name={favorites[item.id] ? 'star' : 'star-outline'}
          size={22}
          color={favorites[item.id] ? '#FFD700' : '#C0C0C0'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
     
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Trip History</Text>
      </View>

     
      <FlatList
        data={tripsData}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 15,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#E6F0FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  tripInfo: {
    flex: 1,
  },

  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  routeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  fareText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginTop: 4,
  },

  star: {
    marginLeft: 10,
  },
});
