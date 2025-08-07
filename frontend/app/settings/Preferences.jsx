import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';
import COLORS from '../../constants/theme';

export default function Preferences() {
  return (
    <ScrollView style={styles.screen}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4682B4" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Preferences</Text>
      </View>

      {/* General Settings */}
      <Text style={styles.sectionHeader}>General Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch value={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={false} />
      </View>

      {/* Privacy */}
      <Text style={styles.sectionHeader}>Privacy</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Location Access</Text>
        <Switch value={true} />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Usage Data</Text>
        <Switch value={false} />
      </View>

      {/* Account */}
      <Text style={styles.sectionHeader}>Account</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Change Password</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Manage Subscriptions</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  headerText: {
    textAlign: 'center',
        fontWeight: '700',
        fontSize: 20,
        marginLeft: 10,
         color: COLORS.primary,
  },
  sectionHeader: {
    marginTop: 25,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  label: {
    fontSize: 15,
    color: '#000',
  },
  editButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editText: {
    color: '#333',
    fontSize: 14,
  },
});
