import { ScrollView, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React from 'react';
import COLORS from '../../constants/theme';

const favoriteLocations = [
  { id: '1', name: 'Home', location: '123 Elm Street, Anytown', icon: 'home' },
  { id: '2', name: 'Work', location: '456 Oak Ave, Anytown', icon: 'briefcase' },
  { id: '3', name: 'Gym', location: '678 Pine Lane, Anytown', icon: 'barbell' },
  { id: '4', name: 'Mom', location: '101 Maple Drive, Anytown', icon: 'person' },
  { id: '5', name: 'School', location: '222 Cedar Court, Anytown', icon: 'school' },
];

export default function FavoritePlaces() {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name={item.icon} size={24} color="#4682B4" style={styles.icon} />
      <View style={styles.subinfo}>
        <Text style={styles.heading}>{item.name}</Text>
        <Text style={styles.subber}>{item.location}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4682B4" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Favorite Places</Text>
      </View>

      <FlatList
        data={favoriteLocations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  subinfo: {
    flex: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subber: {
    fontSize: 14,
    color: '#666',
  },
});
