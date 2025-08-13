import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet
} from "react-native";
import React, {useState} from "react";
import COLORS from "../../constants/theme";
import {router, useLocalSearchParams} from "expo-router";

export default function OtpInput() {

    const {fullName, email, password} = useLocalSearchParams();
    const [otp, setOtp] = useState('');

    const optVerifier = async ({otp}) => {
        try{
            const response = await fetch(`http://localhost:4000/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email, otp, fullName, password}),
            });

            const data = await response.json();

            if(response.ok) {
                Alert.alert('OPT Verified', `${data.message}. Welcome ${fullName.split(" ")[0]} to MyRideLink.`);
                router.push('/home/\(tabs\)/home');
            }
            else{
                Alert.alert('Error', data.message || 'Something went wrong');
            }
        }catch(error){
            Alert.alert('Error', error.message);
            console.log(error);
        }
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.mainView}>
                    <View style={styles.view1}>
                        <Text style={styles.text}>OTP</Text>
                        <TextInput
                        placeholder='Enter OTP'
                        placeholderTextColor={COLORS.secondary}
                        style={styles.input}
                        value={otp}
                        onChangeText={setOtp}/>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => optVerifier({otp})}
                        >
                        <Text style={styles.buttonText}>Verify OTP</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

})