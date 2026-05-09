

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { X, MapPin } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigation } from '@react-navigation/native';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />
      <Text style={styles.pageTitle}>Mes favoris</Text>
      <Text style={styles.subTitle}>{favorites.length} mis en favoris</Text>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => navigation.navigate('PropertyDetailScreen', { property: item })}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <TouchableOpacity style={styles.closeBtn} onPress={() => removeFavorite(item.id)}>
                  <X color="#3B2A1B" size={18} />
                </TouchableOpacity>
              </View>
              <View style={styles.cardLocationRow}>
                <MapPin color="#6E6258" size={13} style={{ marginRight: 4 }} />
                <Text style={styles.cardLocation}>{item.location}</Text>
              </View>
              <Text style={styles.cardPrice}>{item.price}</Text>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.visitBtn} onPress={() => navigation.navigate('PropertyDetailScreen', { property: item })}>
                  <Text style={styles.visitBtnText}>Visiter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.reserveBtn}
                // disabled={item.reserved} // Optionnel : à activer si la réservation est dynamique
                >
                  <Text style={styles.reserveBtnText}>Réserver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E7CC',
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B2A1B',
    textAlign: 'center',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#6E6258',
    textAlign: 'center',
    marginBottom: 18,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'flex-start',
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B2A1B',
    flex: 1,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  cardLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: '#6E6258',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2A1B',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  visitBtn: {
    flex: 1,
    backgroundColor: '#3B2A1B',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: 6,
  },
  visitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  reserveBtn: {
    flex: 1,
    backgroundColor: '#F5E7CC',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B2A1B',
  },
  reserveBtnDisabled: {
    backgroundColor: '#E5DED2',
    borderColor: '#B8A98A',
  },
  reserveBtnText: {
    color: '#3B2A1B',
    fontWeight: '700',
    fontSize: 13,
  },
  reserveBtnTextDisabled: {
    color: '#B8A98A',
  },
});
