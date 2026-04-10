
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, FlatList, Image } from 'react-native';
import { User, MoreVertical, Heart, Calendar, ChevronRight, Mail, Phone, Lock, Globe } from 'lucide-react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useReservations } from '../context/ReservationContext';
import { useUser } from '../context/UserContext';

const LANGUAGES = [
  { label: 'Français', value: 'fr' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
  { label: 'العربية', value: 'ar' },
];

export default function ProfileScreen() {
  const { favorites } = useFavorites();
  const { reservations } = useReservations();
  const { user: contextUser } = useUser();

  const [user, setUser] = useState({
    name: contextUser?.fullName || 'Utilisateur',
    email: contextUser?.email || '',
    phone: contextUser?.phone || '',
    avatar: null,
    language: 'Français',
    languageValue: 'fr',
  });
  const [langModal, setLangModal] = useState(false);
  const [favModal, setFavModal] = useState(false);
  const [resModal, setResModal] = useState(false);

  return (
    <View style={styles.container}>
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
      </View>

      {/* Modal Favoris */}
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

      {/* Modal Réservations */}
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

      {/* Modal de sélection de langue */}
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
                <Text style={[
                  styles.langOptionText,
                  user.languageValue === item.value && styles.langOptionTextActive,
                ]}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
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
  sectionLabel: {
    color: '#3B2A1B',
    fontWeight: '600',
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
});
