//This file contains code for Google Sign In

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet, Alert,
} from 'react-native';
import COLORS from '../../constants/theme';
import HOSTADDRESSCONFIG from "../../config/hostAddressConfig";
import {Path, Svg} from "react-native-svg";
import {GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from "expo-router";
import Constants from "expo-constants";
import {useState} from "react";

GoogleSignin.configure({
    //androidClientId: Constants.expoConfig.extra.googleAndroidClientId,
    iosClientId: Constants.expoConfig.extra.googleIOSClientId,
    webClientId: Constants.expoConfig.extra.googleWebClientId,
});

export default function GoogleAuth() {

    const [loading, setLoading] = useState(false);

    const googleSignIn = async() => {
        try {
            setLoading(true);
            //console.log(Constants.expoConfig.extra.googleAndroidClientId);
            console.log(Constants.expoConfig.extra.googleWebClientId);
            await GoogleSignin.hasPlayServices();
            console.log("A");
            const googleResponse = await GoogleSignin.signIn();
            console.log("B: "+googleResponse);
            if (isSuccessResponse(googleResponse)) {
                const response = await fetch(`http://${HOSTADDRESSCONFIG.hostAddress}:${HOSTADDRESSCONFIG.port}/api/auth/googleSignIn`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({ idToken: googleResponse.data.idToken }),
                });
                const data = await response.json();
                console.log("C: "+data);
                const token = data.token; // ✅ grab token
                if (!token) throw new Error("No access token returned from Supabase");
                await AsyncStorage.setItem("token", token);
                setLoading(false);
                Alert.alert("Google Sign In Successful!", `Hello, ${data.message}`);
                console.log("Google data Sign-In: " + data.message);
                router.push('/home/\(tabs\)/home');
            } else {
                // sign in was cancelled by user
            }
            //const idToken = userInfo.idToken;
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.IN_PROGRESS:
                        // operation (e.g. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // Android only, play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            } else {
                // an error that's not related to google sign in occurred
            }

        }
    }

    return(
        <TouchableOpacity style={styles.submitButton} onPress={() => {googleSignIn()}}>
            <View style={styles.authProviders}>
                <Svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                    <Path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><Path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><Path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><Path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </Svg>
                <Text style= {styles.submitText}>Sign In </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    submitButton: {
        marginTop: 12,
        marginBottom: 12,
        backgroundColor: COLORS.gradientEnd,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    submitText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
    authProviders: {
        flexDirection: "row",
        alignItems: "center",
    }
})