
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, MoreVertical, Heart, Calendar, ChevronRight, Mail, Phone, Lock, Globe, LogOut } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import { useReservations } from '../context/ReservationContext';
import { useUser } from '../context/UserContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_CONFIG } from '../config/apiConfig';
import * as SecureStore from 'expo-secure-store';

const LANGUAGES = [
  { label: 'Français', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'العربية', value: 'ar' },
];

export default function ProfileScreen({ onLogout }) {
  const { favorites } = useFavorites();
  const { reservations } = useReservations();
  const { user: contextUser } = useUser();
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: contextUser?.nom || contextUser?.fullName || 'Utilisateur',
    email: contextUser?.email || '',
    phone: contextUser?.telephone || contextUser?.phone || '',
    avatar: null,
    language: 'Français',
    languageValue: 'fr',
  });
  const [langModal, setLangModal] = useState(false);
  const [favModal, setFavModal] = useState(false);
  const [resModal, setResModal] = useState(false);
  const [briques, setBriques] = useState(null);

  // Fonction pour fetcher les briques
  const fetchBriques = async () => {
    const chercheurId = contextUser?.chercheur?.id;
    if (!chercheurId) {
      console.warn('Pas de chercheurId disponible');
      return;
    }
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        console.warn('Pas de token disponible');
        return;
      }

      // Ajouter un timestamp pour forcer le refetch (cache busting)
      const timestamp = new Date().getTime();
      const res = await fetch(`${API_CONFIG.API_ENDPOINT}/briques/solde/${chercheurId}?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });

      if (!res.ok) {
        console.error('Erreur fetch briques - Status:', res.status);
        return;
      }

      const json = await res.json();
      console.log('Briques response:', json);

      const data = json?.data || json;
      const nouveauSolde = typeof data?.briques === 'number' ? data.briques : 0;

      console.log('Nouveau solde de briques:', nouveauSolde);
      setBriques(nouveauSolde);
    } catch (e) {
      console.error('Erreur chargement briques:', e.message);
    }
  };

  // Fonction pour mettre à jour les infos utilisateur
  const updateUserInfo = () => {
    if (contextUser) {
      setUser(prev => ({
        ...prev,
        name: contextUser.nom || contextUser.fullName || 'Utilisateur',
        email: contextUser.email || '',
        phone: contextUser.telephone || contextUser.phone || '',
      }));
    }
  };

  // Mettre à jour les données utilisateur quand le contexte change
  useEffect(() => {
    updateUserInfo();
  }, [contextUser]);

  // Charger le solde de briques au montage
  useEffect(() => {
    console.log('ProfileScreen montage - Fetching briques pour chercheur:', contextUser?.chercheur?.id);
    fetchBriques();
  }, [contextUser?.chercheur?.id]);

  // Refetcher les briques et infos utilisateur à chaque focus sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      console.log('ProfileScreen focus - Refetching briques');
      updateUserInfo();
      fetchBriques();
    }, [contextUser?.chercheur?.id])
  );

  const handleLogoutPress = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: () => {
            if (typeof onLogout === 'function') {
              onLogout();
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <User color="#fff" size={38} />
            </View>
          </View>
          <TouchableOpacity style={styles.moreBtn}>
            <MoreVertical color="#fff" size={22} />
          </TouchableOpacity>
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => setFavModal(true)}>
            <Heart color="#B98C5E" size={22} />
            <Text style={styles.quickActionTitle}>Favoris</Text>
            <Text style={styles.quickActionSubtitle}>{favorites.length} Logement{favorites.length !== 1 ? 's' : ''}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard} onPress={() => setResModal(true)}>
            <Calendar color="#B98C5E" size={22} />
            <Text style={styles.quickActionTitle}>Réservations</Text>
            <Text style={styles.quickActionSubtitle}>{reservations.length} Active{reservations.length !== 1 ? 's' : ''}</Text>
          </TouchableOpacity>
        </View>

        {/* Briques Section */}
        <Text style={styles.sectionTitle}>Mes Briques 🧱</Text>
        <View style={styles.briquesCard}>
          <View style={styles.briquesLeft}>
            <Text style={styles.briquesEmoji}>🧱</Text>
            <View>
              <Text style={styles.briquesLabel}>Solde actuel</Text>
              <Text style={styles.briquesValue}>
                {briques !== null ? briques : '—'} <Text style={styles.briquesUnit}>Briques</Text>
              </Text>
              <Text style={styles.briquesInfo}>1 visite 3D = 200 Briques • 1 Brique = 1 FCFA</Text>
            </View>
          </View>
          <View style={styles.briquesActions}>
            <TouchableOpacity
              style={styles.refreshBriquesBtn}
              onPress={fetchBriques}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh" size={18} color="#B98C5E" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buyBriquesBtn}
              onPress={() => navigation.navigate('BuyBriques')}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={16} color="#FFF" />
              <Text style={styles.buyBriquesBtnText}>Acheter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Mon Compte</Text>
        <View style={styles.sectionCard}>
          <View style={styles.sectionRow}>
            <Mail color="#B98C5E" size={18} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Informations personnelles</Text>
              <Text style={styles.sectionValue}>{user.email}</Text>
            </View>
            <ChevronRight color="#B98C5E" size={18} />
          </View>
          <View style={styles.sectionRow}>
            <Phone color="#B98C5E" size={18} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Téléphone</Text>
              <Text style={styles.sectionValue}>{user.phone}</Text>
            </View>
            <ChevronRight color="#B98C5E" size={18} />
          </View>
          <View style={styles.sectionRow}>
            <Lock color="#B98C5E" size={18} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Sécurité et mot de passe</Text>
            </View>
            <ChevronRight color="#B98C5E" size={18} />
          </View>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Préférences & Application</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.sectionRow} onPress={() => setLangModal(true)}>
            <Globe color="#B98C5E" size={18} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Langue</Text>
              <Text style={styles.sectionValue}>{user.language}</Text>
            </View>
            <ChevronRight color="#B98C5E" size={18} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sectionRow, styles.logoutRow]} onPress={handleLogoutPress}>
            <LogOut color="#C25B4B" size={18} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.logoutLabel}>Se déconnecter</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal
        visible={favModal}
        transparent
        animationType="slide"
        onRequestClose={() => setFavModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setFavModal(false)} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Mes Favoris</Text>
          {favorites.length === 0 ? (
            <Text style={styles.emptyText}>Aucun logement en favori pour l'instant.</Text>
          ) : (
            <FlatList
              data={favorites}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <View style={styles.propCard}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.propImage} />
                  ) : (
                    <View style={[styles.propImage, { backgroundColor: '#F5E7CC', alignItems: 'center', justifyContent: 'center' }]}>
                      <Heart color="#B98C5E" size={24} />
                    </View>
                  )}
                  <View style={styles.propInfo}>
                    <Text style={styles.propTitle} numberOfLines={1}>{item.title || 'Logement'}</Text>
                    <Text style={styles.propPrice}>{item.price || ''}</Text>
                    {item.location ? <Text style={styles.propLocation}>{item.location}</Text> : null}
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={resModal}
        transparent
        animationType="slide"
        onRequestClose={() => setResModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setResModal(false)} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Mes Réservations</Text>
          {reservations.length === 0 ? (
            <Text style={styles.emptyText}>Aucune réservation pour l'instant.</Text>
          ) : (
            <FlatList
              data={reservations}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <View style={styles.propCard}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.propImage} />
                  ) : (
                    <View style={[styles.propImage, { backgroundColor: '#F5E7CC', alignItems: 'center', justifyContent: 'center' }]}>
                      <Calendar color="#B98C5E" size={24} />
                    </View>
                  )}
                  <View style={styles.propInfo}>
                    <Text style={styles.propTitle} numberOfLines={1}>{item.title || 'Logement'}</Text>
                    <Text style={styles.propPrice}>{item.price || ''}</Text>
                    {item.location ? <Text style={styles.propLocation}>{item.location}</Text> : null}
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </Modal>

      <Modal
        visible={langModal}
        transparent
        animationType="slide"
        onRequestClose={() => setLangModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setLangModal(false)} />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choisir la langue</Text>
          <FlatList
            data={LANGUAGES}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.langOption,
                  user.languageValue === item.value && styles.langOptionActive,
                ]}
                onPress={() => {
                  setUser(u => ({ ...u, language: item.label, languageValue: item.value }));
                  setLangModal(false);
                }}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    user.languageValue === item.value && styles.langOptionTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E7CC',
    paddingTop: 0,
  },
  header: {
    backgroundColor: '#4B3826',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 32,
    marginBottom: 12,
    position: 'relative',
  },
  avatarWrapper: {
    marginBottom: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B98C5E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  moreBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    padding: 6,
  },
  userName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    marginTop: 6,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 0,
    marginBottom: 18,
  },
  quickActionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginHorizontal: 6,
    flex: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  quickActionTitle: {
    fontWeight: '700',
    color: '#3B2A1B',
    fontSize: 15,
    marginTop: 8,
  },
  quickActionSubtitle: {
    color: '#6E6258',
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: '#6E6258',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 18,
    marginTop: 18,
    marginBottom: 6,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 10,
    paddingVertical: 2,
    paddingHorizontal: 6,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5E7CC',
  },
  logoutRow: {
    borderBottomWidth: 0,
  },
  sectionLabel: {
    color: '#3B2A1B',
    fontWeight: '600',
    fontSize: 15,
  },
  logoutLabel: {
    color: '#C25B4B',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionValue: {
    color: '#6E6258',
    fontSize: 13,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 280,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2A1B',
    marginBottom: 18,
    textAlign: 'center',
  },
  langOption: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5E7CC',
    alignItems: 'center',
  },
  langOptionActive: {
    backgroundColor: '#3B2A1B',
  },
  langOptionText: {
    fontSize: 16,
    color: '#3B2A1B',
    fontWeight: '600',
  },
  langOptionTextActive: {
    color: '#fff',
  },
  emptyText: {
    color: '#6E6258',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  propCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E7CC',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
  },
  propImage: {
    width: 80,
    height: 72,
    borderRadius: 10,
    margin: 8,
  },
  propInfo: {
    flex: 1,
    paddingRight: 10,
  },
  propTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#3B2A1B',
    marginBottom: 4,
  },
  propPrice: {
    fontSize: 13,
    color: '#B98C5E',
    fontWeight: '600',
  },
  propLocation: {
    fontSize: 12,
    color: '#6E6258',
    marginTop: 2,
  },
  // --- Briques ---
  briquesCard: {
    backgroundColor: '#3B2A1B',
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  briquesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  briquesEmoji: {
    fontSize: 32,
  },
  briquesLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginBottom: 2,
  },
  briquesValue: {
    color: '#FF9500',
    fontWeight: 'bold',
    fontSize: 22,
  },
  briquesUnit: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 'normal',
  },
  briquesInfo: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    marginTop: 2,
  },
  briquesActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  refreshBriquesBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  buyBriquesBtn: {
    backgroundColor: '#C48A5A',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buyBriquesBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
