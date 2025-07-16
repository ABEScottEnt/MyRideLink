// components/common/SectionTitle.jsx
import { Text, View, StyleSheet } from 'react-native'

export default function SectionTitle({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 16,
    alignItems: 'center', // ✅ center horizontally
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center', // ✅ also center the text itself
  },
})
