import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useReservations } from '../context/ReservationContext';

const paymentOptions = [
  { id: 'wave', label: 'Wave', icon: require('../../assets/wave.png'), enabled: true },
  { id: 'orange', label: 'Orange', icon: require('../../assets/orange.png'), enabled: false },
  { id: 'visa', label: 'Visa', icon: require('../../assets/visa.png'), enabled: false },
  { id: 'mastercard', label: 'Mastercard', icon: require('../../assets/mastercard.png'), enabled: false },
];

export default function ReservationScreen({ route, navigation }) {
  const property = route?.params?.property;
  const [selectedPayment, setSelectedPayment] = useState('wave');
  const { addReservation } = useReservations();

  // Extraire le prix du logement depuis les données reçues
  // Le prix peut être dans property.price, property.prixMensuel, ou extraire d'une chaîne comme "150 000 XOF/mois"
  const extractPrice = (property) => {
    if (!property) return 0;

    // Si le prix est déjà un nombre
    if (property.prixMensuel && typeof property.prixMensuel === 'number') {
      return property.prixMensuel;
    }

    // Si c'est une chaîne comme "150000" ou "150 000"
    if (property.price) {
      const priceStr = property.price.toString().replace(/\s/g, '').replace(/XOF.*$/i, '').replace(/FCFA.*$/i, '').replace(/\/.*$/i, '');
      const numPrice = parseInt(priceStr);
      if (!isNaN(numPrice)) return numPrice;
    }

    // Si prixMensuel est une chaîne
    if (property.prixMensuel) {
      const priceStr = property.prixMensuel.toString().replace(/\s/g, '').replace(/XOF.*$/i, '').replace(/FCFA.*$/i, '').replace(/\/.*$/i, '');
      const numPrice = parseInt(priceStr);
      if (!isNaN(numPrice)) return numPrice;
    }

    // Valeur par défaut
    return 0;
  };

  const housingFee = extractPrice(property);
  const cautionFee = housingFee > 0 ? housingFee * 2 : 0;
  const total = housingFee + cautionFee;

  const canContinue = total > 0;

  // Fonction pour ouvrir l'application de paiement
  const handlePaymentIconClick = async (paymentId) => {
    // Vérifier si l'option est activée
    const option = paymentOptions.find(opt => opt.id === paymentId);
    if (!option?.enabled) {
      Alert.alert(
        'Bientôt disponible',
        'Cette option de paiement sera disponible prochainement. Utilisez Wave pour le moment.',
        [{ text: 'OK' }]
      );
      return;
    }

    setSelectedPayment(paymentId);

    if (paymentId === 'wave') {
      // Essayer plusieurs deep links Wave (wavemobile:// puis wave://)
      const waveSchemes = [
        `https://pay.wave.com/m/M_sn_KzQdzbz_xnrU/c/sn/?amount=${total}`,
        'wavemobile://',
        'wave://',
      ];
      let opened = false;

      for (const scheme of waveSchemes) {
        try {
          await Linking.openURL(scheme);
          opened = true;
          break;
        } catch (error) {
          console.log(`Échec avec ${scheme}:`, error.message);
        }
      }

      if (!opened) {
        // Aucun scheme n'a fonctionné, proposer de télécharger l'app
        Alert.alert(
          'Wave non installé',
          'Téléchargez l\'application Wave pour effectuer le paiement.',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Télécharger Wave',
              onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.wave.money')
            }
          ]
        );
      }
    } else if (paymentId === 'orange') {
      try {
        const canOpen = await Linking.canOpenURL('maxit://');
        if (canOpen) {
          await Linking.openURL('orangemoney://');
        } else {
          Alert.alert(
            'Orange Money non installé',
            'L\'application Orange Money n\'est pas installée. Voulez-vous la télécharger ?',
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Télécharger', onPress: () => Linking.openURL('') }
            ]
          );
        }
      } catch (error) {
        console.error('Erreur ouverture Orange Money:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header avec bouton retour */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#3B2A1B" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Réservation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Réservation</Text>
          <Text style={styles.subtitle}>Phase de réservation</Text>
        </View>

        {/* Bloc englobant étapes, frais, total, options paiement */}
        <View style={styles.cardContainer}>
          {/* Stepper */}
          <View style={styles.stepperRow}>
            <View style={[styles.step, styles.stepActive]} />
            <View style={styles.step} />
            <View style={styles.step} />
            <View style={styles.step} />
          </View>
          <View style={styles.stepperLabels}>
            <Text style={styles.stepLabel}>Réservation</Text>
            <Text style={styles.stepLabel}>Options</Text>
            <Text style={styles.stepLabel}>Paiement</Text>
            <Text style={styles.stepLabel}>Validation</Text>
          </View>

          {/* Fees - Affichage des prix (non modifiables) */}
          <View style={{ marginHorizontal: 0, marginBottom: 8 }}>
            <Text style={styles.feeLabel}>Frais de logement</Text>
            <View style={styles.displayCard}>
              <View style={styles.feeBox}>
                <Text style={styles.feeValue}>{housingFee.toLocaleString()} XOF</Text>
              </View>
            </View>
          </View>
          <View style={{ marginHorizontal: 0, marginBottom: 8 }}>
            <Text style={styles.feeLabel}>Frais de caution (x2)</Text>
            <View style={styles.displayCard}>
              <View style={styles.feeBox}>
                <Text style={styles.feeValue}>{cautionFee.toLocaleString()} XOF</Text>
              </View>
            </View>
          </View>

          {/* Total aligné à droite, label au-dessus et en dehors */}
          <View style={{ marginBottom: 0, marginTop: 2 }}>
            <Text style={[styles.totalLabel, { textAlign: 'right', alignSelf: 'flex-end', color: '#3B2A1B', marginBottom: 2 }]}>FRAIS TOTAL</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <View style={styles.totalCard}>
                <Text style={styles.totalValue}>{total.toLocaleString()} XOF</Text>
              </View>
            </View>
          </View>

          {/* Payment options */}
          <View style={{ alignItems: 'center', marginBottom: 0 }}>
            <Text style={[styles.paymentTitle, { textAlign: 'center', alignSelf: 'center' }]}>Options de paiement</Text>
          </View>
          <View style={[styles.paymentRow, { justifyContent: 'center' }]}>
            {paymentOptions.map(opt => (
              <View key={opt.id} style={{ position: 'relative', marginHorizontal: 2 }}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPayment === opt.id && styles.paymentOptionActive,
                    !opt.enabled && styles.paymentOptionDisabled
                  ]}
                  onPress={() => handlePaymentIconClick(opt.id)}
                  disabled={!opt.enabled}
                >
                  <Image source={opt.icon} style={[styles.paymentImg, !opt.enabled && styles.paymentImgDisabled]} />
                </TouchableOpacity>
                {!opt.enabled && (
                  <View style={styles.disabledBadge}>
                    <Text style={styles.disabledBadgeText}>Bientôt</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#F5E7CC',
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
  topHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 12,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5E7CC',
    padding: 0,
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 18,
  },
  logo: {
    width: 54,
    height: 54,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B2A1B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#b6a98c',
    marginBottom: 8,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 2,
  },
  step: {
    width: 38,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ede3cb',
    marginHorizontal: 2,
  },
  stepActive: {
    backgroundColor: '#b6a98c',
  },
  stepperLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginBottom: 18,
  },
  stepLabel: {
    color: '#b6a98c',
    fontSize: 11,
    fontWeight: '600',
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 28,
    marginBottom: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  displayCard: {
    backgroundColor: 'transparent',
    borderRadius: 18,
    marginHorizontal: 28,
    marginBottom: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  feeLabel: {
    color: '#b6a98c',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  feeBox: {
    backgroundColor: '#f9f7f3',
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  feeValue: {
    color: '#b6a98c',
    fontWeight: '700',
    fontSize: 16,
  },
  totalCard: {
    alignSelf: 'center',
    backgroundColor: '#3B2A1B',
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 8,
    marginBottom: 18,
    marginTop: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  totalLabel: {
    color: '#F5E6D3',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  totalValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  paymentTitle: {
    color: '#3B2A1B',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 28,
    marginBottom: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 28,
    marginBottom: 18,
  },
  paymentOption: {
    backgroundColor: '#ede3cb',
    borderRadius: 16,
    padding: 0,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 52,
    overflow: 'hidden',
  },
  paymentOptionActive: {
    borderColor: '#9B8B75',
    backgroundColor: '#fef9f3',
  },
  paymentOptionDisabled: {
    backgroundColor: '#e5e1d6',
    opacity: 0.5,
  },
  paymentImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 14,
  },
  paymentImgDisabled: {
    opacity: 0.4,
  },
  disabledBadge: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: [{ translateX: -25 }],
    backgroundColor: '#FF9500',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  disabledBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  continueBtn: {
    backgroundColor: '#3B2A1B',
    borderRadius: 18,
    marginHorizontal: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
    elevation: 2,
  },
  continueBtnDisabled: {
    backgroundColor: '#B0A595',
    opacity: 0.6,
  },
  continueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 1,
  },
});
