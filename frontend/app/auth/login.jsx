import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Image, Alert,
} from 'react-native';
import COLORS from '../../constants/theme';
import HOSTADDRESSCONFIG from "../../config/hostAddressConfig";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Path, Svg} from "react-native-svg";
import GoogleAuth from "./googleAuth";
import AppleAuth from "./appleAuth";

export default function AuthScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async ({email, password}) => {
        //setLoading(true);
        //console.log("Button pressed with:", firstName, email);
        //console.log(firstName, email);
        //Alert.alert("Button Pressed");
        try{
            const payload = {email,password};
            const endpoint = '/login';
            //console.log(endpoint);
            //console.log(email);
            //console.log("Payload: "+ firstName+" " + lastName+" " + email+" " + password+" " + phone+" " + addressLine1+" " + city+" " + state+" " +  zipCode);
            //Change the host address w.r.t. your backend device address
            const response = await fetch(`http://${HOSTADDRESSCONFIG.hostAddress}:${HOSTADDRESSCONFIG.port}/api/auth${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            //console.log("Payload: "+ firstName+" " + lastName+" " + email+" " + password+" " + phone+" " + addressLine1+" " + city+" " + state+" " +  zipCode);
            //console.log(firstName, email);
            const data = await response.json();

            if (response.ok) {
                    //console.log(data)
                    const token = data.token; // ✅ grab token
                    if (!token) throw new Error("No access token returned from Supabase");
                    await AsyncStorage.setItem("token", token);
                    Alert.alert('Login successful', `Welcome back, ${data.user.email || ''}`);
                    router.push('/home/\(tabs\)/home');
            }
            else {
                console.log(data.message);
                Alert.alert('Error', data.message || 'Response is not Ok');
            }
        } catch (error) {
            console.log(error.message);
            Alert.alert('Error', error.message || 'Something went wrong');
            console.error(error);
        } finally {
            //setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.tagline}>Your journey, simplified</Text>

                <View style={styles.card}>
                    <View style={styles.tab}>
                        <Text style={styles.tabTextActive}>
                            Login
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {
                            <>
                                <View style={styles.inputWrapper}>
                                    <Ionicons
                                        name="mail-outline"
                                        size={20}
                                        color={COLORS.secondary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor={COLORS.secondary}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        value={email}
                                        onChangeText={setEmail}
                                    />
                                </View>
                                <View style={styles.inputWrapper}>
                                    <Ionicons
                                        name="lock-closed-outline"
                                        size={20}
                                        color={COLORS.secondary}
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your password"
                                        placeholderTextColor={COLORS.secondary}
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>
                            </>
                        }

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => handleSubmit({email, password})}
                            activeOpacity={0.85}
                            //disabled={loading}
                        >
                            <Text style={styles.submitText}>
                                Log In
                            </Text>
                        </TouchableOpacity>

                        <GoogleAuth/>
                        <AppleAuth/>


                        <TouchableOpacity>
                            <Text style={styles.link}>Forgot password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push('auth/signUp')}>
                            <Text style={styles.link}>Create An Account? Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.white },
    container: { padding: 20, alignItems: 'center' },
    logo: {
        width: 260,
        height: 260,
        marginBottom: 0,
    },
    tagline: {
        fontSize: 14,
        fontStyle: 'italic',
        color: COLORS.muted,
        textAlign: 'center',
        marginBottom: 10,
    },
    card: {
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
        marginBottom: 24,
    },
    tabRow: {
        //flexDirection: 'row',
        //borderWidth: 1,
        //borderColor: '#DDD',
        //borderRadius: 8,
        //overflow: 'hidden',
        //marginBottom: 20,
    },
    tab: {
        //flex: 1,
        //paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    tabActive: {
        //backgroundColor: COLORS.white,
    },
    tabTextActive: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.muted,
    },
    tabTextInactive: {
        //fontSize: 16,
        //color: COLORS.secondary,
    },
    form: {
        marginTop: 12
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    inputIcon: {
        position: 'absolute',
        left: 16,
        top: 14,
        zIndex: 1,
    },
    input: {
        height: 48,
        borderColor: '#DDD',
        borderWidth: 1,
        borderRadius: 12,
        paddingLeft: 44,
        backgroundColor: COLORS.background,
        color: COLORS.text,
        fontSize: 16,
    },
    submitButton: {
        marginTop: 12,
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
    link: {
        marginTop: 12,
        fontSize: 14,
        color: COLORS.gradientEnd,
        textAlign: 'center',
    },
});
