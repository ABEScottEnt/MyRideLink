import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SectionTitle from '../../components/common/SectionTitle';

export default function PersonalInfo() {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    pronouns: "He/Him",
    phone: "+1 555-123-4567",
    email: "example@gmail.com",
    address: "123 Main St, Atlanta, GA",
  });

  const [tempInfo, setTempInfo] = useState({ ...userInfo });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    setTempInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setUserInfo({ ...tempInfo });
    setIsEditing(false);
  };

  const renderField = (label, fieldKey) => {
    return (
      <View style={styles.fieldGroup} key={fieldKey}>
        <Text style={styles.label}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={tempInfo[fieldKey]}
            onChangeText={(text) => handleChange(fieldKey, text)}
            multiline={fieldKey === 'address'}
          />
        ) : (
          <Text style={styles.value}>{userInfo[fieldKey]}</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SectionTitle title="Personal Info" />
      
      <View style={styles.avatarContainer}>
        <Ionicons name="person-circle-outline" size={100} color="#4682B4" />
      </View>

      {renderField("Name", "name")}
      {renderField("Pronouns", "pronouns")}
      {renderField("Phone Number", "phone")}
      {renderField("Email", "email")}
      {renderField("Address", "address")}

      <TouchableOpacity
        style={styles.button}
        onPress={isEditing ? handleSave : () => setIsEditing(true)}
      >
        <Text style={styles.buttonText}>{isEditing ? "Save Changes" : "Edit Profile"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f9ff',
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  fieldGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#222',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
