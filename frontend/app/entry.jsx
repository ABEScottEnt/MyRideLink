import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS, { GRADIENT } from "../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Car, Train, Key } from "lucide-react-native";

export default function EntryPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top Section */}
        <View style={styles.topSection}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          {/* <Text style={styles.title}>MyRideLink</Text> */}
          <Text style={styles.subtitle}>
            Compare Uber, Lyft, transit, and car rentals.
          </Text>
          <Text style={styles.tagline}>Find the best ride for every trip.</Text>
          {/* Feature Icons */}
          <View style={styles.featuresRow}>
            <View style={styles.featureItem}>
              <LinearGradient
                colors={["#dbeafe", "#f0f9ff"]}
                style={styles.featureIconBg}
              >
                <Car size={24} color={COLORS.gradientEnd} />
              </LinearGradient>
              <Text style={styles.featureLabel}>Rideshare</Text>
            </View>
            <View style={styles.featureItem}>
              <LinearGradient
                colors={["#dbeafe", "#f0f9ff"]}
                style={styles.featureIconBg}
              >
                <Train size={24} color={COLORS.gradientEnd} />
              </LinearGradient>
              <Text style={styles.featureLabel}>Transit</Text>
            </View>
            <View style={styles.featureItem}>
              <LinearGradient
                colors={["#dbeafe", "#f0f9ff"]}
                style={styles.featureIconBg}
              >
                <Key size={24} color={COLORS.gradientEnd} />
              </LinearGradient>
              <Text style={styles.featureLabel}>Rentals</Text>
            </View>
          </View>
        </View>
        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonRow}>
            {/* Login Button with gradient border */}
            <LinearGradient
              colors={GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradientBorder}
            >
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/auth")}
                activeOpacity={0.85}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </LinearGradient>
            {/* Sign Up Button with full gradient */}
            <LinearGradient
              colors={GRADIENT}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradientFill}
            >
              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => router.push("/auth")}
                activeOpacity={0.85}
              >
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <Text style={styles.termsText}>
            By continuing, you agree to our{" "}
            <Text style={styles.termsLink}>Terms & Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    marginTop: 64,
  },
  logo: {
    width: 260,
    height: 260,
    borderRadius: 80,
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.gradientEnd,
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
    fontWeight: "600",
  },
  tagline: {
    fontSize: 15,
    color: COLORS.muted,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 18,
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  featureItem: {
    flex: 1,
    alignItems: "center",
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  featureLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },
  bottomSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 10,
  },
  buttonGradientBorder: {
    borderRadius: 9999,
    padding: 2,
    marginRight: 8,
  },
  loginButton: {
    width: 120,
    backgroundColor: COLORS.white,
    borderRadius: 9999,
    alignItems: "center",
    paddingVertical: 12,
  },
  loginButtonText: {
    color: COLORS.gradientEnd,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonGradientFill: {
    borderRadius: 9999,
    marginLeft: 8,
  },
  signupButton: {
    width: 120,
    borderRadius: 9999,
    alignItems: "center",
    paddingVertical: 12,
  },
  signupButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  termsText: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  termsLink: {
    textDecorationLine: "underline",
    color: COLORS.gradientEnd,
  },
});
