import COLORS from "../../constants/theme";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import PersonalInfo from "../../app/settings/personal-info";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HOSTADDRESSCONFIG from "../../config/hostAddressConfig";


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
    const router = useRouter();

    const logout = async() => {
        //console.logout("Logout")\

        const token = await AsyncStorage.getItem("token");

        //Change the host address w.r.t. your backend device address
        try{
            const response = await fetch(`http://${HOSTADDRESSCONFIG.hostAddress}:${HOSTADDRESSCONFIG.port}/api/auth/logout`,{
                method: "POST",
                headers: {"Authorization": `Bearer ${token}`},
            });
            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.removeItem("token");
                Alert.alert('Logged out', 'You have been logged out successfully.', [
                    { text: 'OK', onPress: () => router.replace('/entry') }
                ]);
            }

            else{
                Alert.alert('Error', data.message || 'Logout failed.');
            }
        }
        catch(error){
            console.log(error);
        }
        finally {

        }
    }

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
        <SettingItem
          icon="user"
          label="Personal Information"
          onPress={() => router.push("/settings/personal-info")}
        />
        <SettingItem
          icon="credit-card"
          label="Payment Method"
          onPress={() => router.push("/settings/payment-method")}
        />
        <SettingItem icon="settings" label="Preferences" onPress={() => router.push("/settings/Preferences")} />
        <SettingItem icon="clock" label="Trip History" onPress={() => router.push("/settings/Trip-History")} />
        <SettingItem icon="heart" label="Favorite Places" onPress={() => router.push("/settings/FavoritePlaces")}/>
        <SettingItem icon="help-circle" label="Help & Support" />
        <SettingItem
        icon="shield"
        label="Privacy & Security"
        onPress={() => router.push("/settings/privacy-and-security")}
        />
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
                      logout();
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
