import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

const RentalCard = ({ car }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <FontAwesome5 name="car" size={20} color="black" />
        <Text style={styles.carName}>{car.model}</Text>
      </View>

      <View style={styles.row}>
        <MaterialIcons name="event-seat" size={16} color="gray" />
        <Text style={styles.info}>{car.seats} seats</Text>
        <MaterialIcons name="local-gas-station" size={16} color="gray" />
        <Text style={styles.info}>{car.fuel}</Text>
      </View>

      <Text style={styles.details}>
        тнР {car.rating} ({car.trips} trips)
      </Text>
      <Text style={styles.details}>{car.distance}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{car.pricePerDay}</Text>
        <Text style={styles.subPrice}>{car.pricePerHour}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  carName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  info: {
    marginHorizontal: 4,
    color: 'gray',
  },
  details: {
    fontSize: 12,
    color: 'gray',
  },
  priceRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subPrice: {
    fontSize: 12,
    color: 'gray',
  },
});

export default RentalCard;