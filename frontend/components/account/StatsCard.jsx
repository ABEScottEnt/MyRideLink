import {View, Text, StyleSheet} from "react-native";
import COLORS from "../../constants/theme";

export default function StatsCard() {

    //Call all the Info from backend here
    let totalRides = "227"
    let moneySaved = "23.48"
    let rating = "5.0"

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.bigNum}>{totalRides}</Text>
                <Text style={styles.bigName}>Total Rides</Text>
            </View>
            <View style={styles.innerContainer}>
                <Text style={styles.bigNum}>${moneySaved}</Text>
                <Text style={styles.bigName}>Money Saved</Text>
            </View>
            <View style={styles.innerContainer}>
                <Text style={styles.bigNum}>{rating}{/* ⭐*/}</Text>
                <Text style={styles.bigName}>Rating</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: COLORS.muted,
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginTop: 10,
        flexDirection: 'row',
    },
    innerContainer: {
        alignItems: "center",
        flex: 1,
    },
    bigNum: {
        fontWeight: "bold",
        fontSize: 24,
    },
    bigName: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
})