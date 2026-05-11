import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SubscriptionScreen({ route }) {
  const navigation = useNavigation();
  const { nombreVisitesEffectuees = 1, property } = route.params || {};

  const handlePayVisit = () => {
    navigation.navigate('VisitPayment', {
      nombreVisitesEffectuees,
      property
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#3B2A1B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement Visite 3D</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Info Message */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#FF9500" />
          <Text style={styles.infoText}>
            Vous avez effectué <Text style={styles.bold}>{nombreVisitesEffectuees}</Text> visite
            {nombreVisitesEffectuees > 1 ? 's' : ''} 3D.
            {'\n'}
            Payez 200 FCFA pour continuer à explorer nos logements en 3D !
          </Text>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <Ionicons name="cube" size={48} color="#FF9500" />
            <Text style={styles.pricingTitle}>Visite 3D à la demande</Text>
            <Text style={styles.pricingSubtitle}>Simple et flexible</Text>
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.currency}>FCFA</Text>
            <Text style={styles.price}>200</Text>
            <Text style={styles.duration}>/visite</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Première visite gratuite</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>200 FCFA par visite ensuite</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Payez uniquement ce que vous utilisez</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Paiement sécurisé via Wave</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Accès immédiat après validation</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayVisit}
          >
            <Ionicons name="card-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.payButtonText}>Payer 200 FCFA</Text>
          </TouchableOpacity>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Pourquoi payer par visite ?</Text>

          <View style={styles.benefitRow}>
            <Ionicons name="wallet-outline" size={32} color="#3B2A1B" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Économique</Text>
              <Text style={styles.benefitDesc}>
                Ne payez que pour les visites que vous faites
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Ionicons name="flash-outline" size={32} color="#3B2A1B" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Sans engagement</Text>
              <Text style={styles.benefitDesc}>
                Aucun abonnement, aucune période d'engagement
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Ionicons name="cube-outline" size={32} color="#3B2A1B" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Visites 3D immersives</Text>
              <Text style={styles.benefitDesc}>
                Explorez les logements comme si vous y étiez
              </Text>
            </View>
          </View>

          <View style={styles.benefitRow}>
            <Ionicons name="time-outline" size={32} color="#3B2A1B" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Gain de temps</Text>
              <Text style={styles.benefitDesc}>
                Visitez plusieurs logements sans vous déplacer
              </Text>
            </View>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.howItWorksContainer}>
          <Text style={styles.howItWorksTitle}>Comment ça marche ?</Text>

          <View style={styles.stepContainer}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Première visite gratuite</Text>
              <Text style={styles.stepDesc}>Découvrez une visite 3D gratuitement</Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Payez 200 FCFA par visite</Text>
              <Text style={styles.stepDesc}>Pour chaque visite suivante via Wave</Text>
            </View>
          </View>

          <View style={styles.stepContainer}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Accès instantané</Text>
              <Text style={styles.stepDesc}>Explorez le logement en 3D immédiatement</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E7CC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B2A1B',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#3B2A1B',
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: '#FF9500',
  },
  pricingCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    borderWidth: 3,
    borderColor: '#FF9500',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pricingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pricingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B2A1B',
    marginTop: 12,
    marginBottom: 4,
  },
  pricingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#FFF8EC',
    borderRadius: 12,
  },
  currency: {
    fontSize: 16,
    color: '#666',
    marginRight: 6,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  duration: {
    fontSize: 18,
    color: '#666',
    marginLeft: 6,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#3B2A1B',
  },
  payButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  benefitsContainer: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B2A1B',
    marginBottom: 20,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  benefitContent: {
    flex: 1,
    marginLeft: 15,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B2A1B',
    marginBottom: 5,
  },
  benefitDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  howItWorksContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 15,
  },
  howItWorksTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B2A1B',
    marginBottom: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  stepNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3B2A1B',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
