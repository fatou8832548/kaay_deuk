import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Search, Filter } from 'lucide-react-native';
import { getLogements } from '../services/logementService';
import { API_CONFIG } from '../config/apiConfig';

const ListingsScreen = () => {
  const [logementsData, setLogementsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchVille, setSearchVille] = useState('');
  const [prixMin, setPrixMin] = useState('');
  const [prixMax, setPrixMax] = useState('');
  const [page, setPage] = useState(1);
  const navigation = useNavigation();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Charger les logements au montage
  useEffect(() => {
    fetchLogements();
  }, []);

  const fetchLogements = async () => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        page: 1,
        limit: 20,
        disponible: true,
      };

      if (searchVille.trim()) {
        options.ville = searchVille.trim();
      }

      if (prixMin.trim()) {
        options.prixMin = parseInt(prixMin);
      }

      if (prixMax.trim()) {
        options.prixMax = parseInt(prixMax);
      }

      const response = await getLogements(options);

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
        throw new Error('Format de réponse invalide');
      }

      const transformed = data.map(logement => ({
        id: logement.id.toString(),
        title: logement.titre,
        location: `${logement.adresse}`,
        ville: logement.ville,
        prix: logement.prix,
        price: `${logement.prix.toLocaleString('fr-FR')} FCFA/mois`,
        image: `${API_CONFIG.BASE_URL}${logement.images && logement.images.length > 0 ? logement.images[0].url : ''}`,
        superficie: logement.superficie,
        nombrePieces: logement.nombrePieces,
        disponible: logement.disponible,
        original: logement,
      }));

      setLogementsData(transformed);
    } catch (err) {
      console.error('Erreur lors de la récupération des logements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchLogements();
  };

  const renderCard = ({ item }) => {
    const favorite = isFavorite(item.id);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PropertyDetailScreen', { property: item })}
      >
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color="#6E6258" />
                <Text style={styles.cardLocation}>{item.location}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                favorite ? removeFavorite(item.id) : addFavorite(item);
              }}
              style={styles.favoriteButton}
            >
              <Text style={[styles.favoriteText, favorite && { color: '#C48A5A' }]}>
                {favorite ? '♥' : '♡'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Pièces</Text>
              <Text style={styles.detailValue}>{item.nombrePieces}</Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailLabel}>Surface</Text>
              <Text style={styles.detailValue}>{item.superficie} m²</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardPrice}>{item.price}</Text>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate('PropertyDetailScreen', { property: item })}
            >
              <Text style={styles.viewButtonText}>Voir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Annonces</Text>
      </View>

      {/* Barre de recherche et filtres */}
      <ScrollView
        style={styles.filterSection}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBox}>
          <Search size={18} color="#8A7F74" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ville..."
            placeholderTextColor="#8A7F74"
            value={searchVille}
            onChangeText={setSearchVille}
          />
        </View>

        <View style={styles.priceFilterRow}>
          <View style={[styles.priceInput, { marginRight: 8 }]}>
            <Text style={styles.priceLabel}>Prix min</Text>
            <TextInput
              style={styles.priceField}
              placeholder="0"
              placeholderTextColor="#8A7F74"
              value={prixMin}
              onChangeText={setPrixMin}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.priceInput}>
            <Text style={styles.priceLabel}>Prix max</Text>
            <TextInput
              style={styles.priceField}
              placeholder="1000000"
              placeholderTextColor="#8A7F74"
              value={prixMax}
              onChangeText={setPrixMax}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyFilters}
        >
          <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Liste des logements */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C48A5A" />
          <Text style={styles.loadingText}>Chargement des annonces...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur: {error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchLogements}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : logementsData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune annonce trouvée</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSearchVille('');
              setPrixMin('');
              setPrixMax('');
              fetchLogements();
            }}
          >
            <Text style={styles.resetButtonText}>Réinitialiser les filtres</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={logementsData}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E7CC',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5E7CC',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 180,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#3B2A1B',
  },
  priceFilterRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  priceInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: '#6E6258',
    marginBottom: 4,
  },
  priceField: {
    fontSize: 14,
    color: '#3B2A1B',
    padding: 0,
  },
  applyButton: {
    backgroundColor: '#C48A5A',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#E5D4C1',
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardLocation: {
    fontSize: 12,
    color: '#6E6258',
    marginLeft: 4,
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
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detail: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: 'rgba(196, 138, 90, 0.08)',
    borderRadius: 8,
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 11,
    color: '#6E6258',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C48A5A',
  },
  viewButton: {
    backgroundColor: '#3B2A1B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6E6258',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6E6258',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#C48A5A',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default ListingsScreen;
