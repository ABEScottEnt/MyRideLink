// This page will swap between login and signup based on the user state(if they click login or signup)
//export default () => null;
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

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  //const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  //const [loading, setLoading] = useState(true)

  const handleSubmit = async ({firstName, lastName, email, password, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode}) => {
    //setLoading(true);
    //console.log("Button pressed with:", firstName, email);
    //console.log(firstName, email);
    //Alert.alert("Button Pressed");
      console.log("Payload: "+ firstName+" " + lastName+" " + email+" " + password+" " + phone+" " + addressLine1+" " + city+" " + state+" " +  zipCode);
    try{
      const payload = isLogin? {email,password} : {firstName, lastName, email, password, phone, addressLine1, /*{addressLine2}{,}*/ city, state, zipCode};
      const endpoint = isLogin? '/login': '/signup';
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
        if (isLogin) {
          //console.log(data)
          const token = data.token; // ✅ grab token
          if (!token) throw new Error("No access token returned from Supabase");
          await AsyncStorage.setItem("token", token);
          Alert.alert('Login successful', `Welcome back, ${data.user.email || ''}`);
          router.push('/home/\(tabs\)/home');
        } else {
          /*const sendOtpResponse = await fetch(`http://localhost:4000/api/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email}),
          });
          const sendOtpData = await sendOtpResponse.json();
          if(sendOtpResponse.ok) {}*/
          /**************************************
            Alert.alert('New Account Verification', `OTP sent to your mail successfully, ${data.message}`);
            router.push({
              pathname: '/auth/otp-input',
              params:{
                firstName,
                lastName,
                email,
                password,
                phone,
                addressLine1,
                addressLine2,
                city,
                state,
                zipCode
              }
            });
           ********************************/
          Alert.alert(data.message);
          console.log("New User created successfully"+ firstName);
          //router.push("/auth")
          setIsLogin(true);
        }
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
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={isLogin ? styles.tabTextActive : styles.tabTextInactive}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={!isLogin ? styles.tabTextActive : styles.tabTextInactive}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {isLogin ? (
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
            ) : (
              <> 
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor={COLORS.secondary}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.secondary}
                      style={styles.inputIcon}
                  />
                  <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor={COLORS.secondary}
                      value={lastName}
                      onChangeText={setLastName}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={COLORS.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
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
                    placeholder="Create Password"
                    placeholderTextColor={COLORS.secondary}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons
                      name="call-outline"
                      size={20}
                      color={COLORS.secondary}
                      style={styles.inputIcon}
                  />
                  <TextInput
                      style={styles.input}
                      placeholder="Phone Number"
                      placeholderTextColor={COLORS.secondary}
                      keyboardType="number-pad"
                      value={phone}
                      onChangeText={setPhone}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons
                      name="home-outline"
                      size={20}
                      color={COLORS.secondary}
                      style={styles.inputIcon}
                  />
                  <TextInput
                      style={styles.input}
                      placeholder="Address Line 1"
                      placeholderTextColor={COLORS.secondary}
                      value={addressLine1}
                      onChangeText={setAddressLine1}
                  />
                </View>
                {/****************************************
                <View style={styles.inputWrapper}>
                  <Ionicons
                      name="home-outline"
                      size={20}
                      color={COLORS.secondary}
                      style={styles.inputIcon}
                  />
                  <TextInput
                      style={styles.input}
                      placeholder="Address Line 2"
                      placeholderTextColor={COLORS.secondary}
                      value={addressLine2}
                      onChangeText={setAddressLine2}
                  />
                </View>
                ******************************************/}
                <View style={styles.inputWrapper}>
                  <Ionicons
                      name="home-outline"
                      size={20}
                      color={COLORS.secondary}
                      style={styles.inputIcon}
                  />
                  <TextInput
                      style={styles.input}
                      placeholder="City"
                      placeholderTextColor={COLORS.secondary}
                      value={city}
                      onChangeText={setCity}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons
                      name="home-outline"
                      size={20}
                      color={COLORS.secondary}
                      style={styles.inputIcon}
                  />
                  <TextInput
                      style={styles.input}
                      placeholder="State"
                      placeholderTextColor={COLORS.secondary}
                      value={state}
                      onChangeText={setState}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Ionicons
                      name="home-outline"
                      size={20}
                      color={COLORS.secondary}
                      style={styles.inputIcon}
                  />
                  <TextInput
                      style={styles.input}
                      placeholder="Zip Code"
                      placeholderTextColor={COLORS.secondary}
                      keyboardType="number-pad"
                      value={zipCode}
                      onChangeText={setZipCode}
                  />
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => handleSubmit({firstName, email, password})}
              activeOpacity={0.85}
              //disabled={loading}
            >
              <Text style={styles.submitText}>
                {isLogin ? 'Log In' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity>
                <Text style={styles.link}>Forgot password?</Text>
              </TouchableOpacity>
            )}
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
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  tabActive: {
    backgroundColor: COLORS.white,
  },
  tabTextActive: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.muted,
  },
  tabTextInactive: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  form: { marginTop: 0 },
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
