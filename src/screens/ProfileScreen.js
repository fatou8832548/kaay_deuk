
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { User, MoreVertical, Heart, Calendar, ChevronRight, Mail, Phone, Lock, Globe } from 'lucide-react-native';

export default function ProfileScreen() {
  // Dummy user data
  const user = {
    name: 'Lika Fall',
    email: 'lika.fall@email.com',
    phone: '+221 77 123 45 67',
    avatar: null, // Could be a URL if you want to use an image
    favorites: 12,
    reservations: 2,
    language: 'Français',
  };

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
        <View style={styles.quickActionCard}>
          <Heart color="#B98C5E" size={22} />
          <Text style={styles.quickActionTitle}>Favoris</Text>
          <Text style={styles.quickActionSubtitle}>{user.favorites} Logements</Text>
        </View>
        <View style={styles.quickActionCard}>
          <Calendar color="#B98C5E" size={22} />
          <Text style={styles.quickActionTitle}>Réservations</Text>
          <Text style={styles.quickActionSubtitle}>{user.reservations} Actives</Text>
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
        <View style={styles.sectionRow}>
          <Globe color="#B98C5E" size={18} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionLabel}>Langue</Text>
            <Text style={styles.sectionValue}>{user.language}</Text>
          </View>
          <ChevronRight color="#B98C5E" size={18} />
        </View>
      </View>
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
});
