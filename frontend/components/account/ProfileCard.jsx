import {View, Text, StyleSheet, TouchableOpacity, Alert} from "react-native";
import {Box} from "lucide-react-native";
import {Ionicons} from "@expo/vector-icons";
import COLORS from "../../constants/theme";

export default function ProfileCard(){

    //Call all the Info from backend here
    const picture = ""
    const firstName = "John"
    const middleName = ""
    const lastName = "Doe"
    const email = "john.doe@xyz.com"
    const subscription = true
    const rating = "5.0"

    let profilePic;
    if(picture){
        profilePic = picture;
    }
    else {
        profilePic = <Ionicons name="person-circle-outline" size={60} color="blue" style={styles.picHolder}/>
    }

    const fullName = middleName
        ?`${firstName} ${middleName} ${lastName}`
        :`${firstName} ${lastName}`;

    let emailAddress;
    if (!email) {
        reportError("Email address required");
    } else {
         emailAddress = `${email}`;
    }

    let subscriptionTier;
    if (!subscription) {
        subscriptionTier = "Free";
    }
    else {
        subscriptionTier = "Pro";
    }


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
                <TouchableOpacity onPress={() => Alert.alert(`You have ${subscriptionTier} subscription`)} style={styles.buttonContainer}><Text style={styles.subscriptionRating}>{subscriptionTier}</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert(`You have ${rating} ⭐ rating`)} style={styles.buttonContainer}><Text style={styles.subscriptionRating}>⭐ {rating}</Text></TouchableOpacity>
            </View>
        </View>
    )
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