import React, { useMemo, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MapPin, Bell, Search, Filter, Settings } from 'lucide-react-native';
import SettingsScreen from './SettingsScreen';
import { useNavigation } from '@react-navigation/native';
import FilterScreen from './FilterScreen';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const categories = ['Tout', 'Appartement', 'Maison', 'Chambre', 'Studio', 'Villa'];

const recommended = [
  {
    id: '1',
    title: 'Maison Sénégalaise Traditionnelle',
    location: 'Grand Standing (Thiès)',
    price: '180 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    rooms: ['Salon', 'Chambre parentale', 'Chambre enfants', 'Cuisine', 'Cour', 'Salle de bain'],
  },
  {
    id: '2',
    title: 'Villa Moderne',
    location: 'Hersent (Thiès)',
    price: '350 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    rooms: ['Salon', 'Cuisine', 'Chambre 1', 'Chambre 2', 'Salle de bain', 'Garage'],
  },
  {
    id: '3',
    title: 'Case en banco',
    location: 'Nguinth (Thiès)',
    price: '90 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
    rooms: ['Pièce principale', 'Cuisine extérieure', 'Douche'],
  },
  {
    id: '4',
    title: 'Appartement Standing',
    location: 'Cité Lamy (Thiès)',
    price: '200 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80',
    rooms: ['Salon', 'Cuisine', 'Chambre', 'Salle de bain', 'Balcon'],
  },
  {
    id: '5',
    title: 'Studio Thiès',
    location: 'Thialy (Thiès)',
    price: '120 000 FCFA/mois',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=400&q=80',
    rooms: ['Pièce à vivre', 'Salle d’eau', 'Kitchenette'],
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const filtered = useMemo(() => {
    if (activeCategory === 'Tout') return recommended;
    return recommended.filter((item) => item.title.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [activeCategory]);

  const renderCard = ({ item }) => {
    const favorite = isFavorite(item.id);
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PropertyDetailScreen', { property: item })}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.location}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>{item.price}</Text>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={e => {
                e.stopPropagation();
                favorite ? removeFavorite(item.id) : addFavorite(item);
              }}
            >
              <Text style={[styles.favoriteText, favorite && { color: '#C48A5A' }]}>{favorite ? '♥' : '♡'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />

      <View style={styles.topBar}>
        <View style={styles.logoWrapper}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>KAAY DËK</Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}
            onPress={() => navigation.navigate('LocationScreen')}
          >
            <MapPin color="#050505" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Paramètres')}
          >
            <Settings color="#3B2A1B" size={18} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell color="#3B2A1B" size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search color="#8A7F74" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une zone, ville..."
            placeholderTextColor="#8A7F74"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton} 
          activeOpacity={0.7}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter color="#3B2A1B" size={18} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Catégories</Text>
      </View>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const active = item === activeCategory;
          return (
            <TouchableOpacity
              style={[styles.categoryPill, active && styles.categoryPillActive]}
              onPress={() => setActiveCategory(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
  // ...le reste du code inchangé...
}

      <View style={styles.recommendedHeader}>
        <Text style={styles.recommendedTitle}>Recommandés</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        contentContainerStyle={styles.cardsList}
        showsVerticalScrollIndicator={false}
      />

      <FilterScreen 
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={(filters) => {
          console.log('Filtres appliqués depuis HomeScreen:', filters);
          setFilterModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5E7CC',
    paddingTop: 38,
    paddingHorizontal: 18,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 46,
    height: 46,
  },
  appName: {
    marginLeft: 10,
    fontWeight: '700',
    fontSize: 16,
    color: '#3B2A1B',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    fontSize: 18,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#8A7F74',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#3B2A1B',
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: 44,
    height: 44,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 18,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: { 
    fontSize: 16,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  categories: {
    marginBottom: 18,
    height: 48,
    minHeight: 48,
  },
  categoriesContent: {
    paddingRight: 16,
    paddingLeft: 2,
    alignItems: 'center',
    minHeight: 48,
  },
  categoryPill: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 40,
    marginRight: 16,
    minHeight: 36,
    minWidth: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59,42,27,0.08)',
    alignSelf: 'flex-start',
  },
  categoryPillActive: {
    backgroundColor: '#3B2A1B',
    borderColor: '#3B2A1B',
  },
  categoryText: {
    fontSize: 15,
    color: '#6E6258',
    fontWeight: '700',
    letterSpacing: 0.2,
    flexShrink: 1,
    textAlign: 'center',
  },
  categoryTextActive: {
    color: '#fff',
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  cardsList: {
    paddingBottom: 120,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 18,
    marginBottom: 14,
    marginRight: 14,
    overflow: 'hidden',
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 110,
  },
  cardContent: {
    padding: 11,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6E6258',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  favoriteButton: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  favoriteText: {
    fontSize: 14,
    color: '#3B2A1B',
  },
});
