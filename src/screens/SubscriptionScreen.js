import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SubscriptionScreen({ route }) {
  const navigation = useNavigation();
  const { nombreVisitesEffectuees = 1 } = route.params || {};

  const plans = [
    {
      id: 1,
      name: 'Plan Mensuel',
      price: '5 000',
      duration: '/mois',
      features: [
        'Visites 3D illimitées',
        'Accès prioritaire aux nouveaux logements',
        'Support client 24/7',
        'Sans engagement',
      ],
      popular: false,
    },
    {
      id: 2,
      name: 'Plan Trimestriel',
      price: '12 000',
      duration: '/3 mois',
      features: [
        'Visites 3D illimitées',
        'Accès prioritaire aux nouveaux logements',
        'Support client 24/7',
        'Économisez 20%',
        'Notifications en temps réel',
      ],
      popular: true,
    },
    {
      id: 3,
      name: 'Plan Annuel',
      price: '40 000',
      duration: '/an',
      features: [
        'Visites 3D illimitées',
        'Accès prioritaire aux nouveaux logements',
        'Support client VIP',
        'Économisez 33%',
        'Notifications en temps réel',
        'Conseils personnalisés',
      ],
      popular: false,
    },
  ];

  const handleSubscribe = (plan) => {
    navigation.navigate('SubscriptionPayment', { plan });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#3B2A1B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abonnement</Text>
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
            Abonnez-vous pour continuer à explorer nos logements en 3D !
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View
              key={plan.id}
              style={[styles.planCard, plan.popular && styles.planCardPopular]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>POPULAIRE</Text>
                </View>
              )}

              <Text style={styles.planName}>{plan.name}</Text>

              <View style={styles.priceContainer}>
                <Text style={styles.currency}>FCFA</Text>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.duration}>{plan.duration}</Text>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.subscribeButton, plan.popular && styles.subscribeButtonPopular]}
                onPress={() => handleSubscribe(plan)}
              >
                <Text
                  style={[
                    styles.subscribeButtonText,
                    plan.popular && styles.subscribeButtonTextPopular,
                  ]}
                >
                  S'abonner
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Pourquoi s'abonner ?</Text>

          <View style={styles.benefitRow}>
            <Ionicons name="cube-outline" size={32} color="#3B2A1B" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Visites 3D illimitées</Text>
              <Text style={styles.benefitDesc}>
                Explorez tous nos logements en réalité virtuelle
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

          <View style={styles.benefitRow}>
            <Ionicons name="star-outline" size={32} color="#3B2A1B" />
            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>Accès prioritaire</Text>
              <Text style={styles.benefitDesc}>
                Soyez le premier informé des nouveaux logements
              </Text>
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
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
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
  plansContainer: {
    paddingHorizontal: 20,
  },
  planCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  planCardPopular: {
    borderColor: '#FF9500',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FF9500',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  popularText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  planName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3B2A1B',
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  currency: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3B2A1B',
  },
  duration: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  featuresContainer: {
    marginBottom: 20,
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
  subscribeButton: {
    backgroundColor: '#3B2A1B',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  subscribeButtonPopular: {
    backgroundColor: '#FF9500',
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subscribeButtonTextPopular: {
    color: '#FFF',
  },
  benefitsContainer: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    marginBottom: 40,
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
});
