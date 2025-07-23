import {View, StyleSheet, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react';
import SectionTitle from "../../../components/common/SectionTitle";
import RecentActivity from "../../../components/home/RecentActivity";
import SettingCard from "../../../components/account/SettingCard";
import ProfileCard from "../../../components/account/ProfileCard";
import StatsCard from "../../../components/account/StatsCard";


export default function Account() {
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView>
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
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        width: "90%",
        alignSelf: "center",
    },
})
