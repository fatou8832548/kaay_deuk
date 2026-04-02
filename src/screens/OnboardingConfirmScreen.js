import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function OnboardingConfirmScreen({ onStart }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Remplacer par l'image réelle plus tard */}
        <Image source={require('../../assets/key_house_hand.png')} style={styles.image} />
      </View>
      <Text style={styles.title}>
        Visite<Text style={styles.highlight}>Confirmée !</Text>
      </Text>
      <Text style={styles.subtitle}>
        Découvrez votre futur logement en 3D dès maintenant et profitez de l'expérience Kaay Déuk.
      </Text>
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.dotInactive} />
      </View>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>Commencer l'aventure  🗝️</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C18B6B',
    marginHorizontal: 2,
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5D3C0',
    marginHorizontal: 2,
  },
  button: {
    backgroundColor: '#4B372B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
