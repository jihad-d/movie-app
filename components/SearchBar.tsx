import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Rechercher un film..."
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#000',
    marginTop: 60,
    paddingTop: 15,
    paddingBottom: 15,
  },
  input: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 15,
  },
});