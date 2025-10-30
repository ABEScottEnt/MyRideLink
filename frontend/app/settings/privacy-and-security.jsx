import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import COLORS from '../../constants/theme';

const preferedSelections = [
  { id: '1', name: 'Change Password', meaning: 'Change the password associated with this account', icon: 'alert', redirect: "/auth/update-password" },
];

export default function Preferences() {
  

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => router.push(item.redirect)}>
        <View style={styles.card}>
        <View style={styles.iconContainer}>
            <Ionicons name={item.icon} size={26} color={COLORS.primary} />
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.heading}>{item.name}</Text>
            <Text style={styles.subText}>{item.meaning}</Text>
        </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Preferences</Text>
      </View>

      <FlatList
        data={preferedSelections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background || '#f9f9f9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.primary,
  },
  list: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20', // faded version of primary color
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text || '#333',
  },
  subText: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
});
