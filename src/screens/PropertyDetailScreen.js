import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';

export default function PropertyDetailScreen({ route, navigation }) {
  const { property } = route.params;
  const { height } = Dimensions.get('window');
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  // Fonction pour ouvrir Google Maps
  const openMaps = () => {
    const address = encodeURIComponent(property.location || 'Ngor, Thiès');
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    console.log('MAPS URL:', url); // Debug
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={{ flex: 1 }}>
        <Image source={{ uri: property.image }} style={[styles.image, { height: height * 0.42 }]} />
        <View style={styles.detailsOverlay}>
          <ScrollView style={styles.panelScroll} contentContainerStyle={styles.panelContent} showsVerticalScrollIndicator={false}>
            <View style={styles.panel}>
              {/* Titre, lieu, favori */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{property.title || 'Maison Familiale Lumineuse'}</Text>
                  <Text style={styles.location}>{property.location || 'Ngor, Thiès'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.favoriteBtn}
                  onPress={() => {
                    favorite ? removeFavorite(property.id) : addFavorite(property);
                  }}
                >
                  <Text style={{ color: '#C48A5A', fontWeight: 'bold', fontSize: 20 }}>{favorite ? '♥' : '♡'}</Text>
                </TouchableOpacity>
              </View>
              {/* Prix, badge disponible */}
              <View style={styles.priceRow}>
                <Text style={styles.price}>{property.price || '250 000 FCFA'}</Text>
                <View style={styles.statusBadge}><Text style={styles.statusText}>Disponible</Text></View>
              </View>
              {/* Boutons Visite 3D et Réserver */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.visitBtn} onPress={() => navigation.navigate('VirtualTourScreen', { property })}>
                  <Text style={styles.visitBtnText}>Visite 3D</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reserveBtn} onPress={() => navigation.navigate('ReservationScreen', { property })}>
                  <Text style={styles.reserveBtnText}>Réserver</Text>
                </TouchableOpacity>
              </View>
              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description du bien</Text>
                <Text style={styles.description}>
                  Cette superbe maison vous séduira dans le quartier calme de Ngor, grâce à la qualité de ses matériaux, son grand salon lumineux, sa piscine et ses équipements modernes. Idéale pour une famille à la recherche de confort et de tranquillité dans un quartier résidentiel.
                </Text>
              </View>
              {/* Équipements inclus */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Équipements inclus</Text>
                <View style={styles.equipmentRow}>
                  <View style={styles.equipmentPill}><Text style={styles.equipmentText}>WiFi Haute Vitesse</Text></View>
                  <View style={styles.equipmentPill}><Text style={styles.equipmentText}>Garage Privé</Text></View>
                  <View style={styles.equipmentPill}><Text style={styles.equipmentText}>Sécurité 24/7</Text></View>
                  <View style={styles.equipmentPill}><Text style={styles.equipmentText}>Climatisation</Text></View>
                </View>
              </View>
              {/* Localisation */}
              <View style={styles.section}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.sectionTitle}>Localisation</Text>
                  <TouchableOpacity onPress={openMaps}><Text style={{ color: '#B8A98A', fontWeight: 'bold', fontSize: 12 }}>Ouvrir Maps</Text></TouchableOpacity>
                </View>
                <View style={styles.mapPlaceholder}>
                  <View style={styles.mapCircle}>
                    <Text style={styles.mapPin}>📍</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E9D6' },
  image: { width: '100%', resizeMode: 'cover' },
  detailsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: '36%',
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  panelScroll: { flex: 1 },
  panelContent: { paddingTop: 0 },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: 400,
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 8,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#3B2A1B' },
  location: { fontSize: 13, color: '#7A6A58', marginTop: 2 },
  favoriteBtn: { padding: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: 'bold', color: '#5C3A1E', marginRight: 12 },
  statusBadge: { backgroundColor: '#E6F4EA', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 13, color: '#4CAF50', fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', marginTop: 8 },
  visitBtn: { flex: 1, backgroundColor: '#F7E9D6', borderRadius: 8, padding: 12, marginRight: 8, alignItems: 'center', borderWidth: 1, borderColor: '#C48A5A' },
  visitBtnText: { color: '#3B2A1B', fontWeight: 'bold' },
  reserveBtn: { flex: 1, backgroundColor: '#C48A5A', borderRadius: 8, padding: 12, alignItems: 'center' },
  reserveBtnText: { color: '#fff', fontWeight: 'bold' },
  section: { marginTop: 18 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#3B2A1B', marginBottom: 6 },
  description: { fontSize: 13, color: '#7A6A58', marginBottom: 8 },
  equipmentRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  equipmentPill: { backgroundColor: '#EFE6D9', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 8 },
  equipmentText: { color: '#5C3A1E', fontSize: 12, fontWeight: 'bold' },
  mapPlaceholder: { height: 60, backgroundColor: '#E5DED2', borderRadius: 12, marginTop: 8, alignItems: 'center', justifyContent: 'center' },
  mapCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 1 },
  mapPin: { fontSize: 22 },
});
