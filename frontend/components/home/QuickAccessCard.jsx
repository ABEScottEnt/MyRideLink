import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickAccessCard = ({ iconName, label, sublabel, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.iconContainer}>
      <Ionicons name={iconName} size={32} color="#E63946" />
    </View>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.sublabel}>{sublabel}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#fbe9e7',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  sublabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center'
  },
});

export default QuickAccessCard;