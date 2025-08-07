import { ScrollView, View, Text, StyleSheet, Switch, TouchableOpacity, FlatList} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useState } from 'react';
import COLORS from '../../constants/theme';

const tripsData = [
  {
    id: '1',
    date: 'July 15, 2024',
    fare: '$15',
    route: '123 Main St to 456 Oak Ave.',
  },
  {
    id: '2',
    date: 'July 10, 2024',
    fare: '$12',
    route: '789 Pine St to 123 Cedar Ln.',
  },
  {
    id: '3',
    date: 'July 5, 2024',
    fare: '$18',
    route: 'Airport to Hotel Avenue.',
  },
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
     <View style={styles.card}>
           <View style={styles.car}>
              <Ionicons name="car" size={24} color="#4682B4" />
            </View>
            

             <View style={styles.subinfo}>
              <Text style={styles.heading}>{item.date}</Text>
              <Text style={styles.subber}>Fare: {item.fare}</Text>
              <Text style={styles.subber}>{item.route}.</Text>
            </View>

      <TouchableOpacity style={styles.star} onPress={() => toggleFavorite(item.id)}>
        <Ionicons
          name={favorites[item.id] ? 'star' : 'star-outline'}
          size={24}
          color={favorites[item.id] ? '#FFD700' : '#999'}
        />
      </TouchableOpacity>
    </View>
   );

    return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4682B4" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Trips</Text>
      </View>

      <View style={styles.sectionView}>
        <Text style={styles.subHeader}>Past Rides</Text>

        <FlatList
          data={tripsData}
          keyExtractor={(item) => item.id}
          renderItem={renderTrip}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
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

  sectionView: {
    marginTop: 10,
  },

  subHeader: {
    marginBottom: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

 
  card: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    
  },

  tripRow: {
   
   
  },

  car: {
    backgroundColor: 'oldlace',
    borderRadius: 5,
    width: 40,
    height: 40,
    justifyContent: 'center',
   
  },

  subinfo: {
    alignSelf: 'center',
    marginHorizontal: 10,
   
    
  },

  heading: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  subber: {
    fontWeight: '300',
    fontSize: 14,
    color: '#333',
  },

  star: {
    paddingLeft: 10,
    
  },
});
