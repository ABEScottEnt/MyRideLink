// components/common/SectionTitle.jsx
import { Text, View, StyleSheet } from "react-native";
import COLORS from "../../constants/theme";

export default function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
    alignItems: "center", // ✅ center horizontally
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: COLORS.gradientEnd,
    textAlign: "center", // ✅ also center the text itself
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 4,
    textAlign: "center",
  },
});
