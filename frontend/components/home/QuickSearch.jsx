import { View, TextInput, StyleSheet } from 'react-native';

const QuickSearch = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Where from?"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Where to?"
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    color: '#333',
  },
});

export default QuickSearch;
