import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function OnboardingScreen({ onNext, onBack }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Remplacer par l'image réelle plus tard */}
        <Image source={require('../../assets/calendar_hand.png')} style={styles.image} />
      </View>
      <Text style={styles.title}>
        Réservez en <Text style={styles.highlight}>quelques{"\n"}clics</Text>
      </Text>
      <Text style={styles.subtitle}>
        Choisissez une date, confirmez votre visite et planifiez votre futur emménagement en toute simplicité.
      </Text>
      <View style={styles.pagination}>
        <View style={styles.dot} />
      </View>
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Suivant  ▶</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.retour}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7E9D6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  imageContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    color: '#C18B6B',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#8C7B6B',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 32,
    marginHorizontal: 12,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C18B6B',
  },
  button: {
    backgroundColor: '#4B372B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 48,
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  retour: {
    color: '#8C7B6B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
