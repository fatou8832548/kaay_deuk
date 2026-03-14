import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ListingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réservation</Text>
      <Text style={styles.note}>Ici, vous pourrez gérer vos réservations et en créer de nouvelles.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E7CC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B2A1B',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#6E6258',
    textAlign: 'center',
  },
});
