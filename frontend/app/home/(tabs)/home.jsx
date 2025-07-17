import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuickSearch from '../../../components/home/QuickSearch';
import QuickAccessCard from '../../../components/home/QuickAccessCard';
import RecentActivity from '../../../components/home/RecentActivity';

export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <QuickSearch />
        
        <View style={styles.accessGrid}>
          <QuickAccessCard label="Rideshare" sublabel="Uber, Lyft & more" iconName="car-outline" />
          <QuickAccessCard label="Transit" sublabel="Bus, train & metro" iconName="train-outline" />
          <QuickAccessCard label="Car Rental" sublabel="Turo, Zipcar & more" iconName="business-outline" />
          <QuickAccessCard label="Account" sublabel="Profile & settings" iconName="person-outline" />
        </View>

        <RecentActivity />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  accessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
