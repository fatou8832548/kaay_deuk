import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, SafeAreaView, ScrollView } from 'react-native';

const steps = [
  { label: 'Réservation' },
  { label: 'Options' },
  { label: 'Paiement' },
  { label: 'Validation' },
];

export default function ReservationPaymentScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const refs = {};
  const handleChange = (value, idx) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[idx] = value;
      setCode(newCode);
      if (value && idx < 5) {
        refs[`input${idx + 1}`]?.focus();
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5E7CC' }}>
      <View style={styles.headerBg}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Réservation</Text>
        <Text style={styles.subtitle}>Phase de réservation</Text>
      </View>
      <View style={styles.card}>
        {/* Étapes en cercles */}
        <View style={styles.stepsRow}>
          <StepCircle label="Réservation" active={false} />
          <StepCircle label="Options" active={false} />
          <StepCircle label="Paiement" active={true} />
          <StepCircle label="Validation" active={false} />
        </View>
        {/* Instructions Orange Money */}
        <Text style={styles.sectionTitle}>Payez simplement vos achats avec Orange MONEY</Text>
        <View style={styles.instructionsBox}>
          <Text style={styles.instruction}><Text style={styles.bullet}>• </Text>Composer le <Text style={styles.orange}>#144#391#</Text></Text>
          <Text style={styles.instruction}><Text style={styles.bullet}>• </Text>Entrez votre code secret Orange Money</Text>
          <Text style={styles.instruction}><Text style={styles.bullet}>• </Text>Vous allez recevoir un SMS avec un code de paiement utilisable pendant <Text style={styles.orange}>15 mn</Text></Text>
          <Text style={styles.instructionItalic}>
            <Text style={styles.bullet}>• </Text>
            <Text style={styles.italic}>Conservez ce code puis revenez sur cette page pour renseigner votre code de paiement.</Text>
          </Text>
        </View>
        {/* Saisie du code */}
        <Text style={styles.inputLabel}>Saisissez votre code de paiement</Text>
        <View style={styles.codeInputContainer}>
          {code.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={ref => refs[`input${idx}`] = ref}
              style={styles.codeInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={value => handleChange(value, idx)}
              returnKeyType="next"
            />
          ))}
        </View>
        {/* Bouton continuer */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Confirmer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function StepCircle({ label, active }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <View style={[stepStyles.circle, active && stepStyles.circleActive]} />
      <Text style={[stepStyles.label, active && stepStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const stepStyles = StyleSheet.create({
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E6D9C7',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: '#E6D9C7',
  },
  circleActive: {
    backgroundColor: '#3B2A1B',
    borderColor: '#3B2A1B',
  },
  label: {
    fontSize: 11,
    color: '#A89B8B',
    fontWeight: '600',
    textAlign: 'center',
  },
  labelActive: {
    color: '#3B2A1B',
    fontWeight: 'bold',
  },
});
const styles = StyleSheet.create({
  headerBg: {
    backgroundColor: '#E9D9BC',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 18,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: -32,
    zIndex: 2,
  },
  logo: { width: 60, height: 60, marginBottom: 6 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#3B2A1B', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#b6a98c', marginBottom: 0, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    marginHorizontal: 12,
    marginTop: -32,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 1,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 18,
    marginHorizontal: 8,
    marginTop: 2,
  },
  sectionTitle: { fontWeight: 'bold', fontSize: 16, color: '#3B2A1B', marginBottom: 10, marginTop: 0, textAlign: 'left', width: '100%' },
  instructionsBox: { backgroundColor: '#F6F1E7', borderRadius: 14, padding: 14, marginBottom: 18, width: '100%' },
  instruction: { fontSize: 13, color: '#3B2A1B', marginBottom: 4 },
  instructionItalic: { fontSize: 13, color: '#3B2A1B', marginBottom: 0 },
  bullet: { color: '#C97A2B', fontWeight: 'bold' },
  orange: { color: '#C97A2B', fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  inputLabel: { fontWeight: 'bold', fontSize: 15, color: '#3B2A1B', marginBottom: 8, width: '100%' },
  codeInputContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 18, width: '100%' },
  codeInput: { width: 38, height: 38, borderRadius: 8, borderWidth: 1, borderColor: '#E6D9C7', backgroundColor: '#fff', textAlign: 'center', fontSize: 18, marginHorizontal: 4, color: '#3B2A1B', fontWeight: 'bold' },
  button: { backgroundColor: '#3B2A1B', borderRadius: 14, paddingVertical: 14, alignItems: 'center', width: '100%', marginBottom: 0, marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
