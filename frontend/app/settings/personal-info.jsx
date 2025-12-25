import React, {useEffect, useState} from 'react';
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
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import COLORS from '../../constants/theme';
import HOSTADDRESSCONFIG from "../../config/hostAddressConfig";
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PersonalInfo() {

    const [profilePic, setProfilePic] = useState(null);

    const [firstName, setFirstName] = useState('Sign in to view/edit your Info');
    const [lastName, setLastName] = useState('Sign in to view/edit your Info');
    const [email, setEmail] = useState('Sign in to view/edit your Info');
    const [phone, setPhone] = useState('Sign in to view/edit your Info');
    const [addressLine1, setAddressLine1] = useState('Sign in to view/edit your Info');
    //const [addressLine2, setAddressLine2] = useState('Sign in to view/edit your Info');
    const [city, setCity] = useState('Sign in to view/edit your Info');
    const [state, setState] = useState('Sign in to view/edit your Info');
    const [zipCode, setZipCode] = useState('Sign in to view/edit your Info');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem("token");

                const response = await fetch(`http://${HOSTADDRESSCONFIG.hostAddress}:${HOSTADDRESSCONFIG.port}/api/auth/profile`,{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched profile:", data);

                setProfilePic(data.user.profile_pic_url);
                setFirstName(data.user.firstName || "".trim());
                setLastName(data.user.lastName || "".trim());
                setEmail(data.user.email || "");
                setPhone(data.user.phone || "");
                setAddressLine1(data.user.addressLine1 || "");
                //setAddressLine2(data.user.addressLine2 || "");
                setCity(data.user.city || "");
                setState(data.user.state || "");
                setZipCode(data.user.zipCode || "");

            } catch (error) {
                console.error("Error fetching profile:", error);
                Alert.alert("Error", "Failed to load profile information");
            }
        }
        fetchProfile();
    }, []);

  const handleSave = async () => {
      try {
          const token = await AsyncStorage.getItem("token");
          const response = await fetch(`http://${HOSTADDRESSCONFIG.hostAddress}:${HOSTADDRESSCONFIG.port}/api/auth/update-profile`,{
              method: "PATCH",
              headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                  firstName,
                  lastName,
                  email,
                  phone,
                  addressLine1,
                  //addressLine2,
                  city,
                  state,
                  zipCode,
              }),
          });
          if (!response.ok) {
              throw new Error(`Failed to update: ${response.status}`);
          }

          const result = await response.json();
          console.log("Profile updated:", result);

          setEditing(false);
          Alert.alert('Profile Updated', 'Your changes have been saved.');
      }
      catch (error) {
          console.error("Error updating profile:", error);
          Alert.alert("Error", "Failed to update profile");
      }
  };

    const uploadProfilePic = async (uri) => {
        const token = await AsyncStorage.getItem("token");

        const formData = new FormData();
        formData.append("image", {
            uri,
            name: "avatar.jpg",
            type: "image/jpeg",
        });

        const response = await fetch(
            `http://${HOSTADDRESSCONFIG.hostAddress}:${HOSTADDRESSCONFIG.port}/api/auth/upload-profile-pic`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);

        setProfilePic(data.url);
        Alert.alert("Success", "Profile picture updated");
    };

    const requestPermissions = async () => {
        const camera = await ImagePicker.requestCameraPermissionsAsync();
        const media = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!camera.granted || !media.granted) {
            Alert.alert("Permission required", "Camera and gallery permissions are needed.");
            return false;
        }
        return true;
    };

    const pickImage = async (fromCamera = false) => {
        const ok = await requestPermissions();
        if (!ok) return;

        const result = fromCamera
            ? await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
            })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
            });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            setProfilePic(localUri);
            const uploadedUrl = await uploadProfilePic(localUri);
            setProfilePic(uploadedUrl);
        }
    };


    return (
      <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
          >

            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.primary}/>
              </TouchableOpacity>
              <Text style={styles.headerText}>Personal Info</Text>
              <View style={{width: 24}}/>
            </View>


            <View style={styles.profileImageWrapper}>
                {profilePic ? (
                    <Image
                        source={{ uri: profilePic}}
                        style={styles.pic}
                    />
                ) : (
                    <Ionicons name="person-circle-outline" size={60} color="blue" style={styles.picHolder} />
                )}
                <TouchableOpacity
                    style={styles.editIconOverlay}
                    onPress={() =>
                        Alert.alert(
                            "Update Profile Picture",
                            "Choose an option",
                            [
                                { text: "Camera", onPress: () => pickImage(true) },
                                { text: "Gallery", onPress: () => pickImage(false) },
                                { text: "Cancel", style: "cancel" }
                            ]
                        )
                    }
                >
                <Ionicons name="camera" size={16} color="#fff"/>
              </TouchableOpacity>
            </View>


            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Profile Details</Text>

              <Text style={styles.label}>First Name</Text>
              <TextInput
                  style={styles.inputField}
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={editing}
              />

                <Text style={styles.label}>Last Name</Text>
                <TextInput
                    style={styles.inputField}
                    value={lastName}
                    onChangeText={setLastName}
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

                <Text style={styles.label}>Address Line 1</Text>
                <TextInput
                    style={styles.inputField}
                    value={addressLine1}
                    onChangeText={setAddressLine1}
                    editable={editing}
                />

                {/*
                <Text style={styles.label}>Address Line 2</Text>
                <TextInput
                    style={styles.inputField}
                    value={addressLine2}
                    onChangeText={setAddressLine2}
                    editable={editing}
                />
                */}

                <Text style={styles.label}>City</Text>
                <TextInput
                    style={styles.inputField}
                    value={city}
                    onChangeText={setCity}
                    editable={editing}
                />

                <Text style={styles.label}>State</Text>
                <TextInput
                    style={styles.inputField}
                    value={state}
                    onChangeText={setState}
                    editable={editing}
                />

                <Text style={styles.label}>Zip Code</Text>
                <TextInput
                    style={styles.inputField}
                    value={zipCode}
                    onChangeText={setZipCode}
                    editable={editing}
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
