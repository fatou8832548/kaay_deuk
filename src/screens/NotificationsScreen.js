
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { Bell, Home, Calendar, Star, X, ArrowLeft } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const initialNotifications = [
  {
    id: '1',
    icon: <Home size={18} color="#B98C5E" style={{ marginRight: 10 }} />,
    title: 'Nouveau logement disponible',
    message: 'Un appartement à Dakar vient d’être ajouté.',
    date: 'Aujourd’hui',
  },
  {
    id: '2',
    icon: <Calendar size={18} color="#B98C5E" style={{ marginRight: 10 }} />,
    title: 'Rappel de réservation',
    message: 'Votre visite est prévue demain à 10h.',
    date: 'Hier',
  },
  {
    id: '3',
    icon: <Star size={18} color="#B98C5E" style={{ marginRight: 10 }} />,
    title: 'Favori disponible',
    message: 'Un de vos logements favoris est à nouveau libre.',
    date: 'Il y a 2 jours',
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const renderRightActions = (progress, dragX, id) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(id)}
        activeOpacity={0.7}
      >
        <X color="#fff" size={22} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f7f3" />

      {/* Header avec bouton retour */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#3B2A1B" />
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <Bell size={20} color="#7c715a" style={{ marginRight: 8 }} />
          <Text style={styles.header}>Notifications</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
            overshootRight={false}
          >
            <View style={styles.card}>
              <View style={styles.iconCol}>{item.icon}</View>
              <View style={styles.textCol}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>{item.date}</Text>
              </View>
            </View>
          </Swipeable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune notification pour le moment.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f7f3',
    paddingTop: 12,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#f9f7f3',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    color: '#7c715a',
    fontSize: 18,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    marginHorizontal: 16,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  iconCol: {
    marginRight: 10,
    marginTop: 2,
  },
  textCol: {
    flex: 1,
  },
  title: {
    color: '#3B2A1B',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  message: {
    color: '#6E6258',
    fontSize: 13,
    marginBottom: 4,
  },
  date: {
    color: '#b6a98c',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#B98C5E',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: '90%',
    borderRadius: 14,
    marginVertical: 7,
    marginRight: 4,
    elevation: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#b6a98c',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
