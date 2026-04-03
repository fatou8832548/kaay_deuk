import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function OnboardingWelcomeScreen({ onNext, onSkip }) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Remplacer par l'image réelle plus tard */}
        <Image source={require('../../assets/360_house.png')} style={styles.image} />
        <Text style={styles.degree}>360°</Text>
      </View>

      <Text style={styles.title}>
        Découvrez des
        <Text style={styles.highlight}> logements </Text>
        <Text style={styles.accent}>facilement</Text>
      </Text>
      <Text style={styles.subtitle}>
        Explorez des maisons et appartements d’exception à travers des visites virtuelles immersives.
      </Text>
      <View style={styles.pagination}>
        <View style={styles.dotActive} />
        <View style={styles.dotInactive} />
        <View style={styles.dotInactive} />
      </View>
      <TouchableOpacity style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Suivant  ▶</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSkip}>
        <Text style={styles.skip}>Passer l’introduction</Text>
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
    position: 'relative',
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  degree: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -30 }],
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5C2B',
    zIndex: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
  },
  highlight: {
    color: '#8B5C2B',
    fontWeight: 'bold',
  },
  accent: {
    color: '#C48A5A',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    color: '#7A6A58',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5C3A1E',
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CFC2B0',
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#5C3A1E',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skip: {
    color: '#7A6A58',
    fontSize: 13,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
