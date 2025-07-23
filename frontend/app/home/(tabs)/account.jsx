import COLORS from "@/constants/theme";
import { Text, View } from "react-native";
import SettingCard from "../../../components/account/SettingCard";

export default function Home() {
  return (
    <View style={{ backgroundColor: COLORS.background }}>
      <Text>Account</Text>
      <SettingCard />
    </View>
  );
}
