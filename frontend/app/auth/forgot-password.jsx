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

// simple email validator
const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [resetPassword, setResetPassword] = useState(false);
  const [disableButton, setDisableButton] = useState(false);

  const handleReset = async() => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    setDisableButton(true);
    setError('');
    // TODO: trigger password reset email
    // navigate to verification or confirmation screen
    try {
      const payload = {email};
      //Change the host address w.r.t. your backend device address
      const response = await fetch(`http://100.110.167.198:4000/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setError("Password reset request sent. Please check your email.") // Try and find a different way to present this message.
      //router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.log("API call error:", error);
        setError(error);
      }
    setDisableButton(false);
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
            <Text style={styles.title}>Forgot Password</Text>
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
                placeholder="Email Address"
                placeholderTextColor={COLORS.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <LinearGradient
              colors={GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.buttonWrapper, disableButton && styles.buttonDisabled]}
            >
              <TouchableOpacity
                style={styles.button}
                onPress={handleReset}
                disabled={disableButton}
                activeOpacity={0.85}
              >
                <Text style={styles.buttonText}>Reset Password</Text>
              </TouchableOpacity>
            </LinearGradient>

            <TouchableOpacity
                onPress={() => router.push("/auth")}>
                <Text style={styles.link}>DEV: Return to login</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/auth/update-password")}>
                <Text style={styles.link}>DEV: Go to update password</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/auth/verify-email")}>
                <Text style={styles.link}>DEV: Go to OTP Input</Text>
            </TouchableOpacity>
            
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
