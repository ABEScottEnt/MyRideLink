// app/auth/verify-email.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import COLORS, { GRADIENT } from '../../constants/theme';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email = 'you@example.com' } = useLocalSearchParams();
  const [code, setCode] = useState('');

  const handleConfirm = () => {
    router.push('/home/home');
  };

  const isValid = code.length === 6;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.card}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            Enter the 6‑digit code sent to{' '}
            <Text style={styles.highlight}>{email}</Text>
          </Text>

          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={text => setCode(text.replace(/[^0-9]/g, ''))}
            placeholder="------"
            placeholderTextColor={COLORS.muted}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
            editable={true}
            selectTextOnFocus={true}
          />

          <LinearGradient
            colors={GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.buttonWrapper,
              !isValid && styles.buttonWrapperDisabled,
            ]}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={handleConfirm}
              disabled={!isValid}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 200,
    height: 200,
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
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  highlight: {
    color: COLORS.gradientEnd,
    fontWeight: '600',
  },
  codeInput: {
    width: '80%',
    height: 56,
    borderColor: COLORS.gradientEnd,
    borderWidth: 2,
    borderRadius: 12,
    fontSize: 24,
    letterSpacing: 12,
    color: COLORS.text,
    marginBottom: 24,
    backgroundColor: COLORS.background,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  buttonWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonWrapperDisabled: {
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
