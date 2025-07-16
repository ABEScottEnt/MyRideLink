import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SectionTitle from '../../../components/common/SectionTitle'

export default function Rides() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <SectionTitle title="Transit" />
        <Text style={styles.subtitle}>Compare transit.</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',     // ⬅️ Center vertically (optional)
    alignItems: 'center',         // ⬅️ Center everything horizontally
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',          // ⬅️ Center the text inside Text
  },
})
