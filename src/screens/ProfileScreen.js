import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ onLogout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.note}>Gérez votre compte et vos préférences.</Text>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Se déconnecter</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3B2A1B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
