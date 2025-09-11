//Button that route to login page to test.
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import COLORS from "../../constants/theme";

export default function AuthTestButton({ route }) {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Use route prop first, then fall back to URL params, then default
    const targetRoute = route || params.route || "/auth/index";

    const handleDevMode = () => {
        // Navigate to specified route using push
        router.push(targetRoute);
    };

    // Only show in development
    if (!__DEV__) return null;

    return (
        <TouchableOpacity style={styles.devButton} onPress={handleDevMode}>
            <Text style={styles.devButtonText}>AuthTest</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    devButton: {
        position: "absolute",
        top: 50,
        right: 20,
        backgroundColor: COLORS.danger,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        zIndex: 1000,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    devButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "600",
    },
});