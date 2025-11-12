import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, Image, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/theme";

export default function ProfileCard() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = await AsyncStorage.getItem("token");

            //Change the host address w.r.t. your backend device address
            try {
                const response = await fetch("http://100.110.167.198:4000/api/auth/profile", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                if (response.ok) {
                    setProfile({
                        picture: "",
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                        subscription: true, // static for now
                        rating: "5.0",      // static for now
                    });
                } else {
                    console.log(data.message);
                    Alert.alert("Error", data.message || "Response is not Ok");
                }
            } catch (error) {
                console.log("Profile Card Error:", error);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return (
            <View style={styles.profileContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const fullName = profile.firstName && profile.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : profile.firstName || profile.lastName || "No name";

    const emailAddress = profile.email || "No email provided";
    const subscriptionTier = profile.subscription ? "Pro" : "Free";
    const profilePic = profile.picture ? (
        <Image source={{ uri: profile.picture }} style={styles.picHolder} />
    ) : (
        <Ionicons
            name="person-circle-outline"
            size={60}
            color="blue"
            style={styles.picHolder}
        />
    );

    return (
        <View style={styles.profileContainer}>
            <View style={styles.profile}>
                {profilePic}
                <View style={styles.details}>
                    <Text style={styles.fullName}>{fullName}</Text>
                    <Text style={styles.email}>{emailAddress}</Text>
                </View>
            </View>
            <View style={styles.buttons}>
                <TouchableOpacity
                    onPress={() =>
                        Alert.alert(`You have ${subscriptionTier} subscription`)
                    }
                    style={styles.buttonContainer}
                >
                    <Text style={styles.subscriptionRating}>{subscriptionTier}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Alert.alert(`You have ${profile.rating} ⭐ rating`)}
                    style={styles.buttonContainer}
                >
                    <Text style={styles.subscriptionRating}>⭐ {profile.rating}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    profileContainer: {
        borderColor: COLORS.muted,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
    },
    profile: {
        flexDirection: "row",
    },
    details: {
        flexDirection: "column",
        marginLeft: 10,
        marginTop: 8
    },
    picHolder: {

    },
    fullName: {
        fontWeight: "bold",
        fontSize: 18,
    },
    email: {
        fontWeight: "italic",
    },
    buttons:{
        flexDirection: "row",
        marginLeft: 60
    },
    buttonContainer: {
        //backgroundColor: '#cf4d4d',
        padding: 16,
        //backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 6,
        height: 60,
        //width: 70,
    },
    subscriptionRating: {
        color: COLORS.muted,
        fontWeight: 'bold',
        fontSize: 18,
    },
})