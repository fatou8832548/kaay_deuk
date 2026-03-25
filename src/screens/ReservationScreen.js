
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Smartphone, CreditCard } from 'lucide-react-native';

const paymentOptions = [
  { id: 'wave', label: 'Wave', icon: require('../../assets/wave.png') },
  { id: 'orange', label: 'Orange', icon: require('../../assets/orange.png') },
  { id: 'visa', label: 'Visa', icon: require('../../assets/visa.png') },
  { id: 'mastercard', label: 'Mastercard', icon: require('../../assets/mastercard.png') },
];

export default function ReservationScreen() {
  const [selectedPayment, setSelectedPayment] = useState('wave');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Réservation</Text>
        <Text style={styles.subtitle}>Phase de réservation</Text>
      </View>

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
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Frais de logement"
          placeholderTextColor="#b6a98c"
          value={''}
          editable={false}
        />
        <Text style={styles.xof}>XOF</Text>
      </View>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Frais de réservation"
          placeholderTextColor="#b6a98c"
          value={''}
          editable={false}
        />
        <Text style={styles.xof}>XOF</Text>
      </View>

      {/* Total */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>FRAIS TOTAL</Text>
        <Text style={styles.totalValue}>xxxx XOF</Text>
      </View>

      {/* Payment options */}
      <Text style={styles.paymentTitle}>Options de paiement</Text>
      <View style={styles.paymentRow}>
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

      {/* Continue button */}
      <TouchableOpacity style={styles.continueBtn}>
        <Text style={styles.continueText}>Continuer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f7f3',
    padding: 0,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  logo: {
    width: 54,
    height: 54,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3B2A1B',
    marginBottom: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 28,
    marginBottom: 12,
    paddingHorizontal: 18,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#3B2A1B',
    fontWeight: '600',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 8,
  },
  xof: {
    color: '#b6a98c',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
  totalCard: {
    alignSelf: 'center',
    backgroundColor: '#3B2A1B',
    borderRadius: 18,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginBottom: 18,
    marginTop: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  totalValue: {
    color: '#fff',
    fontSize: 18,
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
    borderRadius: 12,
    padding: 0,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 48,
    overflow: 'hidden',
  },
  paymentOptionActive: {
    borderColor: '#b6a98c',
    backgroundColor: '#fff',
  },
  paymentImg: {
    width: 56,
    height: 36,
    resizeMode: 'contain',
    alignSelf: 'center',
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
