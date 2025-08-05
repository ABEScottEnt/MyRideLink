import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PaymentMethodsScreen() {
  const [methods, setMethods] = useState([
    { id: '1', type: 'Visa', last4: '4243', isDefault: true },
    { id: '2', type: 'Amex', last4: '3007', isDefault: false },
  ]);

  const setDefault = (id) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  const renderMethod = ({ item }) => (
    <View style={styles.methodCard}>
      <View style={styles.methodInfo}>
        <FontAwesome
          name={item.type === 'Visa' ? 'cc-visa' : 'cc-amex'}
          size={24}
          color="#333"
          style={{ marginRight: 12 }}
        />
        <Text style={styles.methodText}>
          {item.type} •••• {item.last4}
        </Text>
      </View>
      {item.isDefault ? (
        <View style={styles.defaultBadge}>
          <Ionicons name="checkmark" size={16} color="#fff" />
          <Text style={styles.defaultText}>Default</Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setDefault(item.id)}
          style={styles.setDefaultBtn}
        >
          <Text style={styles.setDefaultText}>Set Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Saved Methods:</Text>
        <FlatList
          data={methods}
          renderItem={renderMethod}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />

        <TouchableOpacity style={styles.addNewRow}>
          <Text style={styles.addNewText}>
            + Add a New Payment Method
          </Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <MaterialCommunityIcons
              name="credit-card-plus-outline"
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionText}>Add Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <FontAwesome
              name="apple"
              size={20}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.actionText}>Add Apple Pay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueBtn}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const PRIMARY = '#007AFF';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  title: { fontSize: 20, fontWeight: '600', marginLeft: 12 },
  content: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  methodInfo: { flexDirection: 'row', alignItems: 'center' },
  methodText: { fontSize: 16, color: '#333' },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultText: { color: '#fff', marginLeft: 4, fontSize: 12 },
  setDefaultBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  setDefaultText: { color: PRIMARY, fontSize: 12 },
  addNewRow: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addNewText: { fontSize: 16, color: '#333' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  actionText: { fontSize: 16 },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  continueBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
