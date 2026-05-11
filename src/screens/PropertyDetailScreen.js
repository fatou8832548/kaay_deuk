import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { Linking } from 'react-native';
import { API_CONFIG } from '../config/apiConfig';
import { Ionicons } from '@expo/vector-icons';

export default function PropertyDetailScreen({ route, navigation }) {
  const { property } = route.params;
  const { height } = Dimensions.get('window');
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(property.id);

  // Récupérer les données de l'API (original) ou les données transformées
  const data = property.original || property;

  // Extraire les informations
  const titre = data.titre || property.title || 'Maison Familiale';
  const description = data.description || property.description || 'Propriété magnifique';
  const prix = data.prix || parseInt(property.price) || 250000;
  const priceFormatted = `${prix.toLocaleString('fr-FR')} FCFA/mois`;
  const adresse = data.adresse || property.location || 'Adresse non disponible';
  const ville = data.ville || '';
  const fullLocation = ville ? `${adresse} (${ville})` : adresse;
  const superficie = data.superficie || property.superficie || 'N/A';
  const nombrePieces = data.nombrePieces || property.nombrePieces || 'N/A';
  const disponible = data.disponible !== false;
  const caution = data.caution || 'N/A';

  // Récupérer l'image principale
  const mainImage = data.images && data.images[0]?.url
    ? `${API_CONFIG.BASE_URL}${data.images[0].url}`
    : property.image;

  // Récupérer les équipements de la première image
  const equipements = data && data.equipements ? data.equipements : {};

  // Fonction pour ouvrir Google Maps
  const openMaps = () => {
    const address = encodeURIComponent(fullLocation);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(url);
  };

  // Afficher les équipements disponibles
  const equipementsArray = [
    { key: 'wifiHauteVitesse', label: 'WiFi Haute Vitesse' },
    { key: 'garagePrivé', label: 'Garage Privé' },
    { key: 'sécurité24h7', label: 'Sécurité 24/7' },
    { key: 'climatisation', label: 'Climatisation' },
  ].filter(item => equipements[item.key]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={{ flex: 1 }}>
        <Image source={{ uri: mainImage }} style={[styles.image, { height: height * 0.42 }]} />

        {/* Bouton retour flottant */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#3B2A1B" />
        </TouchableOpacity>
        <View style={styles.detailsOverlay}>
          <ScrollView style={styles.panelScroll} contentContainerStyle={styles.panelContent} showsVerticalScrollIndicator={false}>
            <View style={styles.panel}>
              {/* Titre, lieu, favori */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{titre}</Text>
                  <Text style={styles.location}>{fullLocation}</Text>
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

              {/* Prix, caractéristiques et badge */}
              <View style={styles.priceRow}>
                <Text style={styles.price}>{priceFormatted}</Text>
                {disponible && <View style={styles.statusBadge}><Text style={styles.statusText}>Disponible</Text></View>}
              </View>

              {/* Caractéristiques */}
              <View style={styles.featureRow}>
                <View style={styles.featureBox}>
                  <Text style={styles.featureLabel}>Pièces</Text>
                  <Text style={styles.featureValue}>{nombrePieces}</Text>
                </View>
                <View style={styles.featureBox}>
                  <Text style={styles.featureLabel}>Superficie</Text>
                  <Text style={styles.featureValue}>{superficie} m²</Text>
                </View>
                <View style={styles.featureBox}>
                  <Text style={styles.featureLabel}>Caution</Text>
                  <Text style={styles.featureValue}>{typeof caution === 'number' ? `${caution.toLocaleString('fr-FR')} F` : caution}</Text>
                </View>
              </View>

              {/* Boutons Visite 3D et Réserver */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.visitBtn}
                  onPress={() => navigation.navigate('VirtualTourScreen', { property })}
                >
                  <Text style={styles.visitBtnText}>Visite 3D</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reserveBtn}
                  onPress={() => navigation.navigate('ReservationScreen', { property })}
                >
                  <Text style={styles.reserveBtnText}>Réserver</Text>
                </TouchableOpacity>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description du bien</Text>
                <Text style={styles.description}>{description}</Text>
              </View>

              {/* Équipements inclus */}
              {equipementsArray.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Équipements inclus</Text>
                  <View style={styles.equipmentRow}>
                    {equipementsArray.map((item) => (
                      <View key={item.key} style={styles.equipmentPill}>
                        <Text style={styles.equipmentText}>{item.label}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Localisation */}
              <View style={styles.section}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.sectionTitle}>Localisation</Text>
                  <TouchableOpacity onPress={openMaps}>
                    <Text style={{ color: '#B8A98A', fontWeight: 'bold', fontSize: 12 }}>Ouvrir Maps</Text>
                  </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7E9D6' },
  image: { width: '100%', resizeMode: 'cover' },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
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
  featureRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  featureBox: { flex: 1, backgroundColor: '#F5EBE0', borderRadius: 10, padding: 12, marginHorizontal: 4, alignItems: 'center' },
  featureLabel: { fontSize: 12, color: '#6E6258', marginBottom: 4 },
  featureValue: { fontSize: 16, fontWeight: 'bold', color: '#3B2A1B' },
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
