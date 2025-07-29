import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentMethod() {
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: 'Emmanuel Baah',
    cardNumber: '**** **** **** 1234',
    expiry: '12/26',
    cvv: '***',
    billingAddress: '123 Main St, Atlanta, GA',
  });

  const [tempInfo, setTempInfo] = useState({ ...paymentInfo });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setTempInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setPaymentInfo({ ...tempInfo });
    setIsEditing(false);
  };

  const renderField = (label, fieldKey, isSecure = false) => (
    <View style={styles.infoRow} key={fieldKey}>
      <Text style={styles.rowLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          value={tempInfo[fieldKey]}
          onChangeText={(text) => handleChange(fieldKey, text)}
          style={styles.input}
          secureTextEntry={isSecure}
        />
      ) : (
        <Text style={styles.rowValue}>{paymentInfo[fieldKey]}</Text>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="card-outline" size={80} color="#000" />
        <Text style={styles.headerTitle}>Payment Method</Text>
      </View>

      <View style={styles.card}>
        {renderField('Cardholder Name', 'cardName')}
        {renderField('Card Number', 'cardNumber')}
        {renderField('Expiration Date', 'expiry')}
        {renderField('CVV', 'cvv', true)}
        {renderField('Billing Address', 'billingAddress')}
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text style={styles.editButtonText}>{isEditing ? 'Save Changes' : 'Edit Payment Info'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoRow: {
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  rowLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 16,
    color: '#111',
  },
  input: {
    fontSize: 16,
    color: '#111',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
