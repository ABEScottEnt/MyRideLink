import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "@/constants/theme";

export default function LocationSearch({
  fromValue = "",
  toValue = "",
  onChangeFrom = () => {},
  onChangeTo = () => {},
  onClearFrom = () => {},
  onClearTo = () => {},
  onSubmit = () => {},
  submitText = "Search",
  style = {},
  buttons = null,
}) {
  return (
    <View style={[styles.outerContainer, style]}>
      <View style={styles.inputRow}>
        <MaterialIcons
          name="location-on"
          size={20}
          color={COLORS.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="From"
          placeholderTextColor={COLORS.muted}
          value={fromValue}
          onChangeText={onChangeFrom}
        />
        {!!fromValue && (
          <TouchableOpacity onPress={onClearFrom} style={styles.clearBtn}>
            <MaterialIcons name="close" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.inputRow}>
        <MaterialIcons
          name="location-on"
          size={20}
          color={COLORS.primary}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          placeholderTextColor={COLORS.muted}
          value={toValue}
          onChangeText={onChangeTo}
        />
        {!!toValue && (
          <TouchableOpacity onPress={onClearTo} style={styles.clearBtn}>
            <MaterialIcons name="close" size={20} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>
      {Array.isArray(buttons) && buttons.length > 0 ? (
        <View style={styles.buttonRow}>
          {buttons.map((btn, idx) => (
            <TouchableOpacity
              key={btn.label}
              style={[styles.submitBtn, idx > 0 && { marginLeft: 10, flex: 1 }]}
              onPress={btn.onPress}
            >
              <Text style={styles.submitText}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TouchableOpacity style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitText}>{submitText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    borderColor: COLORS.muted,
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 8,
    marginVertical: 16,
    backgroundColor: COLORS.white,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  icon: {
    marginLeft: 4,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 8,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    borderRadius: 10,
    marginVertical: 0,
  },
  clearBtn: {
    marginLeft: 8,
    padding: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: COLORS.gradientEnd,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    flex: 1,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
