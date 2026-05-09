import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Linking,
  Alert,
  Image,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const KAAY_DEUK_WAVE_NUMBER = '77 000 00 00';
const KAAY_DEUK_OM_NUMBER = '77 000 00 00';

function generateReference(userId) {
  const ts = Date.now().toString(36).toUpperCase();
  return KD-RES-+ (userId || '0') + - + ts;
}

const STEPS = ['Reservation', 'Options', 'Paiement', 'Validation'];

export default function ReservationPaymentScreen({ route }) {
  const navigation = useNavigation();
  const { user } = useUser();
  const { reservation } = route?.params || {};

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const reference = React.useMemo(
    () => generateReference(user?.id),
    [user?.id]
  );

  const montant = reservation?.montantTotal ?? reservation?.acompte ?? '--';

  const openWave = async () => {
    setSelectedMethod('wave');
    const url = 'wavemobile://';
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert('Wave non installe', "Telechargez l'application Wave pour payer.", [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Telecharger Wave',
          onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.wave.money'),
        },
      ]);
    }
  };

  const openOrangeMoney = async () => {
    setSelectedMethod('om');
    const url = 'orangemoney://';
    const canOpen = await Linking.canOpenURL(url).catch(() => false);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert('Orange Money', 'Composez le #144# ou telechargez l\'app.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Composer #144#', onPress: () => Linking.openURL('tel:*144%23') },
        {
          text: 'Telecharger l\'app',
          onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.orange.orangemoney.senegal'),
        },
      ]);
    }
  };

  const copyReference = () => {
    Clipboard.setString(reference);
    Alert.alert('Copie !', 'Reference "' + reference + '" copiee.');
  };

  const handleConfirm = () => {
    if (!selectedMethod) {
      Alert.alert('Choisissez un moyen de paiement', 'Selectionnez Wave ou Orange Money avant de confirmer.');
      return;
    }
    setConfirmed(true);
  };

  if (confirmed) {
    return <ConfirmationScreen navigation={navigation} montant={montant} reference={reference} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBg}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.headerTitle}>Reservation</Text>
        <Text style={styles.headerSubtitle}>Phase de paiement</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.stepsRow}>
          {STEPS.map((s, i) => (
            <StepCircle key={s} label={s} active={i === 2} />
          ))}
        </View>

        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Montant a payer</Text>
          <Text style={styles.amountValue}>
            {montant} <Text style={styles.amountCurrency}>FCFA</Text>
          </Text>
        </View>

        <TouchableOpacity style={styles.referenceBox} onPress={copyReference} activeOpacity={0.75}>
          <View>
            <Text style={styles.referenceLabel}>Reference de paiement</Text>
            <Text style={styles.referenceValue}>{reference}</Text>
          </View>
          <Ionicons name="copy-outline" size={22} color="#FF9500" />
        </TouchableOpacity>
        <Text style={styles.referenceTip}>Appuyez pour copier - Indiquez cette reference dans le motif du virement</Text>

        <Text style={styles.sectionTitle}>Choisir le moyen de paiement</Text>

        <TouchableOpacity
          style={[styles.payCard, selectedMethod === 'wave' && styles.payCardSelected]}
          onPress={openWave}
          activeOpacity={0.8}
        >
          <View style={styles.payCardLeft}>
            <View style={[styles.payLogo, { backgroundColor: '#1652F0' }]}>
              <Text style={styles.payLogoText}>W</Text>
            </View>
            <View>
              <Text style={styles.payName}>Wave</Text>
              <Text style={styles.payNumber}>Envoyer a : {KAAY_DEUK_WAVE_NUMBER}</Text>
            </View>
          </View>
          {selectedMethod === 'wave'
            ? <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            : <Ionicons name="open-outline" size={22} color="#1652F0" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.payCard, selectedMethod === 'om' && styles.payCardSelected]}
          onPress={openOrangeMoney}
          activeOpacity={0.8}
        >
          <View style={styles.payCardLeft}>
            <View style={[styles.payLogo, { backgroundColor: '#FF6200' }]}>
              <Text style={styles.payLogoText}>OM</Text>
            </View>
            <View>
              <Text style={styles.payName}>Orange Money</Text>
              <Text style={styles.payNumber}>Envoyer a : {KAAY_DEUK_OM_NUMBER}</Text>
            </View>
          </View>
          {selectedMethod === 'om'
            ? <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            : <Ionicons name="open-outline" size={22} color="#FF6200" />}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#3B2A1B" />
          <Text style={styles.infoText}>
            Effectuez le virement depuis votre application Wave ou Orange Money,
            puis revenez ici et confirmez. Notre equipe validera votre reservation
            dans les 24h ouvrees.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, !selectedMethod && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.confirmBtnText}>J'ai envoye le paiement</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ConfirmationScreen({ navigation, montant, reference }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.confirmScreen}>
        <View style={styles.confirmIconWrap}>
          <Ionicons name="time" size={72} color="#FF9500" />
        </View>
        <Text style={styles.confirmTitle}>Paiement soumis !</Text>
        <Text style={styles.confirmSubtitle}>
          Votre demande a ete enregistree. Notre equipe confirmera votre reservation apres reception du paiement.
        </Text>

        <View style={styles.confirmCard}>
          <Row label="Montant" value={montant + ' FCFA'} />
          <Row label="Reference" value={reference} highlight />
          <Row label="Statut" value="En attente de validation" status />
        </View>

        <View style={styles.confirmTipBox}>
          <Ionicons name="bulb-outline" size={20} color="#FF9500" />
          <Text style={styles.confirmTip}>
            Conservez la reference <Text style={styles.bold}>{reference}</Text>.
            Vous serez notifie des validation.
          </Text>
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Text style={styles.homeBtnText}>Retour a l'accueil</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, highlight, status }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[
        styles.rowValue,
        highlight && styles.rowValueHighlight,
        status && styles.rowValueStatus,
      ]}>{value}</Text>
    </View>
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
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#E6D9C7', marginBottom: 4,
    borderWidth: 2, borderColor: '#E6D9C7',
  },
  circleActive: { backgroundColor: '#3B2A1B', borderColor: '#3B2A1B' },
  label: { fontSize: 11, color: '#A89B8B', fontWeight: '600', textAlign: 'center' },
  labelActive: { color: '#3B2A1B', fontWeight: 'bold' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E7CC' },
  headerBg: {
    backgroundColor: '#E9D9BC',
    alignItems: 'center',
    paddingTop: 24, paddingBottom: 18,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  logo: { width: 60, height: 60, marginBottom: 6 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#3B2A1B' },
  headerSubtitle: { fontSize: 13, color: '#b6a98c' },
  scroll: { padding: 20, paddingBottom: 40 },
  stepsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 20, marginTop: 4,
  },
  amountBox: {
    backgroundColor: '#3B2A1B', borderRadius: 14,
    padding: 18, alignItems: 'center', marginBottom: 16,
  },
  amountLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 },
  amountValue: { color: '#FF9500', fontSize: 30, fontWeight: 'bold' },
  amountCurrency: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 'normal' },
  referenceBox: {
    backgroundColor: '#FFF', borderRadius: 12,
    borderWidth: 2, borderColor: '#FF9500',
    padding: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', marginBottom: 4,
  },
  referenceLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  referenceValue: { fontSize: 17, fontWeight: 'bold', color: '#3B2A1B', letterSpacing: 1 },
  referenceTip: { fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#3B2A1B', marginBottom: 12 },
  payCard: {
    backgroundColor: '#FFF', borderRadius: 14,
    borderWidth: 2, borderColor: '#E0D5C5',
    padding: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,
  },
  payCardSelected: { borderColor: '#4CAF50', backgroundColor: '#F0FFF4' },
  payCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  payLogo: {
    width: 46, height: 46, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  payLogoText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  payName: { fontSize: 16, fontWeight: 'bold', color: '#3B2A1B' },
  payNumber: { fontSize: 13, color: '#666', marginTop: 2 },
  infoBox: {
    flexDirection: 'row', backgroundColor: '#FFF8EC',
    borderRadius: 12, padding: 14, marginBottom: 22, marginTop: 4,
    borderLeftWidth: 3, borderLeftColor: '#FF9500', gap: 10,
  },
  infoText: { flex: 1, fontSize: 13, color: '#3B2A1B', lineHeight: 19 },
  bold: { fontWeight: 'bold' },
  confirmBtn: {
    backgroundColor: '#3B2A1B', borderRadius: 14,
    paddingVertical: 16, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  confirmScreen: { padding: 28, paddingBottom: 48, alignItems: 'center' },
  confirmIconWrap: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#FFF8EC',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, marginTop: 20,
  },
  confirmTitle: { fontSize: 26, fontWeight: 'bold', color: '#3B2A1B', marginBottom: 12 },
  confirmSubtitle: {
    fontSize: 15, color: '#666', textAlign: 'center',
    lineHeight: 22, marginBottom: 28, maxWidth: 320,
  },
  confirmCard: {
    backgroundColor: '#FFF', borderRadius: 16,
    padding: 20, width: '100%', marginBottom: 20,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0EAE0',
  },
  rowLabel: { fontSize: 14, color: '#888' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#3B2A1B', maxWidth: '55%', textAlign: 'right' },
  rowValueHighlight: { color: '#FF9500', letterSpacing: 0.5 },
  rowValueStatus: { color: '#E88A00', fontStyle: 'italic' },
  confirmTipBox: {
    flexDirection: 'row', backgroundColor: '#FFF8EC',
    borderRadius: 12, padding: 14, width: '100%',
    marginBottom: 28, borderLeftWidth: 3, borderLeftColor: '#FF9500', gap: 10,
  },
  confirmTip: { flex: 1, fontSize: 13, color: '#3B2A1B', lineHeight: 19 },
  homeBtn: {
    backgroundColor: '#3B2A1B', borderRadius: 14,
    paddingVertical: 15, width: '100%', alignItems: 'center',
  },
  homeBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
