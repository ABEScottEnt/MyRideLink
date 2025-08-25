import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../../constants/theme';
import { router } from 'expo-router';

export default function PersonalInfo() {
  const [name, setName] = useState('Evans Ahenkorah');
  const [email, setEmail] = useState('example@gmail.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    setEditing(false);
    Alert.alert('Profile Updated', 'Your changes have been saved.');
  };

  return (
     <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
         
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Personal Info</Text>
            <View style={{ width: 24 }} />
          </View>

          
          <View style={styles.profileImageWrapper}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
              style={styles.pic}
            />
            <TouchableOpacity style={styles.editIconOverlay}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Profile Details</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.inputField}
              value={name}
              onChangeText={setName}
              editable={editing}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.inputField}
              value={email}
              onChangeText={setEmail}
              editable={editing}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.inputField}
              value={phone}
              onChangeText={setPhone}
              editable={editing}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => (editing ? handleSave() : setEditing(true))}
            >
              <Text style={styles.editButtonText}>
                {editing ? 'Save Changes' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  profileImageWrapper: {
    alignSelf: 'center',
    marginTop: 20,
    position: 'relative',
  },
  pic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 5,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: '#F7F8FA',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 15,
    color: COLORS.text,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
