import COLORS from "../../constants/theme";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";

function SettingItem({
  icon,
  label,
  iconColor = COLORS.primary,
  textColor = "#000",
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 10,
      }}
    >
      <Feather name={icon} size={20} color={iconColor} style={{ width: 30 }} />
      <Text style={{ fontSize: 16, color: textColor }}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function SettingCard() {
  return (
    <View
      style={{
        //paddingHorizontal: 16,
          paddingVertical: 8,
          marginTop: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: COLORS.muted,
        //backgroundColor: COLORS.background,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: 16,
          borderRadius: 12,
          marginBottom: 12,
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            paddingHorizontal: 10,
            paddingBottom: 12,
            color: COLORS.gradientEnd,
          }}
        >
           Settings
        </Text>
        <SettingItem icon="user" label="Personal Information" />
        <SettingItem icon="credit-card" label="Payment Method" />
        <SettingItem icon="settings" label="Preferences" />
        <SettingItem icon="clock" label="Trip History" />
        <SettingItem icon="heart" label="Favorite Places" />
        <SettingItem icon="help-circle" label="Help & Support" />
        <SettingItem icon="shield" label="Privacy & Security" />
        <SettingItem
          icon="log-out"
          label="Sign Out"
          iconColor="red"
          textColor="red"
          onPress={() => {
            Alert.alert(
              "Confirm Sign Out",
              "Are you sure you want to sign out?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Sign Out",
                  style: "destuctive",
                  onPress: () => {
                    console.log("User signed out");
                  },
                },
              ],
              { cancelable: true }
            );
          }}
        />
      </View>
    </View>
  );
}
