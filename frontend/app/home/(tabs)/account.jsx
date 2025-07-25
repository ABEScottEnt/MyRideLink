import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import SectionTitle from "../../../components/common/SectionTitle";
import RecentActivity from "../../../components/home/RecentActivity";
import SettingCard from "../../../components/account/SettingCard";
import ProfileCard from "../../../components/account/ProfileCard";
import StatsCard from "../../../components/account/StatsCard";
import COLORS from '@/constants/theme';  // import your theme colors

export default function Account() {
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <SectionTitle
                        title="Account"
                        subtitle="Manage your profile and preferences"
                    />
                    <ProfileCard/>
                    <StatsCard/>
                    <RecentActivity/>
                    <SettingCard/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,  // use theme background color
    },
    scrollContent: {
      flexGrow: 1,
      backgroundColor: COLORS.background,  // consistent bg color inside scroll
    },
    container: {
        width: "90%",
        alignSelf: "center",
    },
});
