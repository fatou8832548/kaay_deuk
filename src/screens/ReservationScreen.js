import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Smartphone, CreditCard } from 'lucide-react-native';

const paymentOptions = [
  { id: 'wave', label: 'Wave', icon: require('../../assets/wave.png') },
  { id: 'orange', label: 'Orange', icon: require('../../assets/orange.png') },
  { id: 'visa', label: 'Visa', icon: require('../../assets/visa.png') },
  { id: 'mastercard', label: 'Mastercard', icon: require('../../assets/mastercard.png') },
];

export default function ReservationScreen({ route, navigation }) {
  const property = route?.params?.property;
  const [selectedPayment, setSelectedPayment] = useState('wave');
  const [housingFee, setHousingFee] = useState('');
  const [reservationFee, setReservationFee] = useState('');

  // Calcul du total (en nombre)
  const total = (parseInt(housingFee) || 0) + (parseInt(reservationFee) || 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom: 32}} showsVerticalScrollIndicator={false}>
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

          {/* Fees */}
          <View style={{marginHorizontal: 0, marginBottom: 8}}>
            <Text style={styles.feeLabel}>Frais de logement</Text>
            <View style={styles.inputCard}>
              <View style={styles.feeBox}>
                <TextInput
                  style={{fontSize: 16, color: '#3B2A1B', minWidth: 80}}
                  placeholder="Montant en XOF"
                  value={housingFee}
                  onChangeText={setHousingFee}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
          <View style={{marginHorizontal: 0, marginBottom: 8}}>
            <Text style={styles.feeLabel}>Frais de réservation</Text>
            <View style={styles.inputCard}>
              <View style={styles.feeBox}>
                <TextInput
                  style={{fontSize: 16, color: '#3B2A1B', minWidth: 80}}
                  placeholder="Montant en XOF"
                  value={reservationFee}
                  onChangeText={setReservationFee}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Total aligné à droite, label au-dessus et en dehors */}
          <View style={{marginBottom: 0, marginTop: 2}}>
            <Text style={[styles.totalLabel, {textAlign: 'right', alignSelf: 'flex-end', color: '#3B2A1B', marginBottom: 2}]}>FRAIS TOTAL</Text>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <View style={styles.totalCard}>
                <Text style={styles.totalValue}>{total.toLocaleString()} XOF</Text>
              </View>
            </View>
          </View>

          {/* Payment options */}
          <View style={{alignItems: 'center', marginBottom: 0}}>
            <Text style={[styles.paymentTitle, {textAlign: 'center', alignSelf: 'center'}]}>Options de paiement</Text>
          </View>
          <View style={[styles.paymentRow, {justifyContent: 'center'}]}>
            {paymentOptions.map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.paymentOption, selectedPayment === opt.id && styles.paymentOptionActive]}
                onPress={() => setSelectedPayment(opt.id)}
              >
                <Image source={opt.icon} style={styles.paymentImg} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue button */}
        <TouchableOpacity style={styles.continueBtn} onPress={() => navigation.navigate('ReservationPaymentScreen')}>
          <Text style={styles.continueText}>Continuer</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    marginHorizontal: 2,
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
  paymentImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 14,
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
  continueText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 1,
  },
});
