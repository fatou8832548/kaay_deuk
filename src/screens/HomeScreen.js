import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  ActivityIndicator,
} from 'react-native';
import { MapPin, Bell, Search, Filter, Settings } from 'lucide-react-native';
import SettingsScreen from './SettingsScreen';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import FilterScreen from './FilterScreen';
import { getLogementsRecommandes, getLogements } from '../services/logementService';
import { API_CONFIG } from '../config/apiConfig';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const categories = ['Tout', 'Appartement', 'Maison', 'Chambre', 'Studio', 'Villa'];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [logementsData, setLogementsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Récupérer les logements recommandés au montage du composant
  useEffect(() => {
    fetchLogementsRecommandes();
  }, []);

  // Refetcher les données chaque fois qu'on revient sur l'écran
  useFocusEffect(
    React.useCallback(() => {
      fetchLogementsRecommandes();
    }, [])
  );

  const fetchLogementsRecommandes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLogementsRecommandes(12);
      console.log('Logements recommandés récupérés:', response);

      // Déterminer la structure de la réponse (peut être imbriquée)
      let data = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response.data) {
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data; // Structure imbriquée
        }
      }

      // Vérifier que data est bien un array
      if (!Array.isArray(data)) {
        data = [];
      }

      // Si pas de données, on affiche juste l'écran vide
      if (data.length === 0) {
        setLogementsData([]);
      } else {
        // Transformer les données de l'API pour correspondre au format attendu
        const transformed = data.map(logement => ({
          id: logement.id.toString(),
          title: logement.titre,
          location: `${logement.adresse} (${logement.ville})`,
          price: `${logement.prix.toLocaleString('fr-FR')} FCFA/mois`,
          image: `${API_CONFIG.BASE_URL}${logement.images && logement.images.length > 0 ? logement.images[0].url : ''}`,
          rooms: [],
          original: logement, // Garder les données originales
        }));
        setLogementsData(transformed);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des logements:', err);
      setError(err.message);
      setLogementsData([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    if (activeCategory === 'Tout') return logementsData;
    return logementsData.filter((item) =>
      item.title.toLowerCase().includes(activeCategory.toLowerCase())
    );
  }, [activeCategory, logementsData]);

  const renderCard = ({ item }) => {
    const favorite = isFavorite(item.id);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PropertyDetailScreen', { property: item })}
      >
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
    <SafeAreaView style={styles.screen} edges={["top"]}>
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

      <View style={styles.recommendedHeader}>
        <Text style={styles.recommendedTitle}>Recommandés</Text>
        <TouchableOpacity onPress={fetchLogementsRecommandes}>
          <Text style={styles.seeAll}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C48A5A" />
          <Text style={styles.loadingText}>Chargement des logements...</Text>
        </View>
      ) : logementsData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>Aucun logement disponible</Text>
          <Text style={styles.emptySubtext}>Revenez bientôt pour découvrir de nouvelles annonces</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          numColumns={2}
          contentContainerStyle={styles.cardsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FilterScreen
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={(filters) => {
          console.log('Filtres appliqués depuis HomeScreen:', filters);
          setFilterModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5E7CC',
    paddingTop: 8,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6E6258',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B2A1B',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8A7F74',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#C1272D',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#C48A5A',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
