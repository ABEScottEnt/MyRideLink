// This page will swap between login and signup based on the user state(if they click login or signup)
//export default () => null;
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    if (isLogin) {
      // handle login
    } else {
      // handle signup
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>🚗 MyRideLink</Text>
      <Text style={styles.subtitle}>Your journey, simplified</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, isLogin && styles.activeTab]}
          onPress={() => setIsLogin(true)}
        >
          <Text style={isLogin ? styles.activeText : styles.inactiveText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !isLogin && styles.activeTab]}
          onPress={() => setIsLogin(false)}
        >
          <Text style={!isLogin ? styles.activeText : styles.inactiveText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder={isLogin ? 'Enter your password' : 'Create a password'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isLogin ? 'Sign in' : 'Create account'}
          </Text>
        </TouchableOpacity>

        {isLogin && (
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot password?</Text>
          </TouchableOpacity>
        )}

        {!isLogin && (
          <Text style={styles.tos}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: 'bold', marginTop: 40 },
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 20,
    width: '100%',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  activeText: {
    fontWeight: 'bold',
    color: '#111827',
  },
  inactiveText: {
    color: '#6b7280',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#f3f4f6',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  forgot: {
    marginTop: 12,
    color: '#ef4444',
    textAlign: 'center',
  },
  tos: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 12,
  },
});
