// File: app/auth/forgot-password.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import COLORS, { GRADIENT } from '../../constants/theme';

// simple email validator // Temporarily keeping this for reference
//const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
//const validatePassword = (password) => // TODO: Make simple password validator

export default function UpdatePassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleReset = async() => {
    //const token = await AsyncStorage.getItem("token");
    setError('');
    
    if (password != confirmPassword) {
        setError('Passwords do not match');
        return;
    }
    /*
    if (!validatePassword(password)) {
      setError('Please enter a valid password');
      return;
    }
    */

    try {
      const payload = {password};
      console.log(password);
      //Change the host address w.r.t. your backend device address
      const response = await fetch(`http://100.110.167.198:4000/api/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      //console.log(firstName, email);
      console.log("API call success??");
      alert("PASSWORD CHANGED SUCCESSFULLY");
      //const data = await response.json();
    } catch (error) {
        console.log("API call error:", error);
      }
    //router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.card}>
            <Text style={styles.title}>Update Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address to receive a password reset link.
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor={COLORS.secondary}
                keyboardType="password"
                autoCapitalize="none"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.secondary}
                keyboardType="password"
                autoCapitalize="none"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <LinearGradient
              colors={GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.buttonWrapper, !password && styles.buttonDisabled]}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={handleReset}
                disabled={!password}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputWrapper: {
    width: '100%',
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
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 44,
    alignSelf: 'flex-start',
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  button: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
