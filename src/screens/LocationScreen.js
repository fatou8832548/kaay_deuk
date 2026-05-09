import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 14.7167; // Thiès
const LONGITUDE = -16.9333;
const LATITUDE_DELTA = 0.09;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function LocationScreen({ onApply }) {
  const [selectedRegion, setSelectedRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
  };

  const handleApply = () => {
    console.log('Zone sélectionnée:', {
      latitude: selectedRegion.latitude,
      longitude: selectedRegion.longitude,
      name: selectedRegion.name || 'Zone personnalisée',
    });

    if (onApply) onApply(selectedRegion);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <MapView
        style={styles.map}
        initialRegion={selectedRegion}
        region={selectedRegion}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass
        toolbarEnabled={false}
      />

      <View style={styles.footer}>
        <View style={styles.handle} />
        <Text style={styles.title}>Sélectionnez votre zone</Text>
        <Text style={styles.subtitle}>Déplacez la carte pour choisir une localisation.</Text>

        <TouchableOpacity style={styles.button} onPress={handleApply}>
          <Text style={styles.buttonText}>Appliquer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.floatingPin}>
        <MapPin color="#3B2A1B" size={30} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E7CC',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingPin: {
    position: 'absolute',
    top: '38%',
    left: '50%',
    marginLeft: -15,
    marginTop: -30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  handle: {
    width: 56,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#D9CBB7',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B2A1B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#6E6258',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#3B2A1B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
