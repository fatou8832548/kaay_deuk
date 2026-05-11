import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Clipboard,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const KAAY_DEUK_WAVE_NUMBER = '77 000 00 00';
const VISIT_PRICE = 200; // Prix par visite en FCFA

function generateReference(userId) {
  const ts = Date.now().toString(36).toUpperCase();
  return `KD-VISIT-${userId || '0'}-${ts}`;
}

export default function VisitPaymentScreen({ route }) {
  const navigation = useNavigation();
  const { user } = useUser();
  const { property, nombreVisitesEffectuees = 1 } = route?.params || {};

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const reference = React.useMemo(
    () => generateReference(user?.id),
    [user?.id]
  );

  const openWave = async () => {
    setSelectedMethod('wave');

    // Essayer plusieurs deep links Wave pour Android
    const waveUrls = [
      `https://pay.wave.com/m/M_sn_KzQdzbz_xnrU/c/sn/?amount=${VISIT_PRICE}`,
      'wavemobile://',
      'wave://',
    ];

    let opened = false;

    for (const url of waveUrls) {
      try {
        const canOpen = await Linking.canOpenURL(url).catch(() => false);
        if (canOpen) {
          await Linking.openURL(url);
          opened = true;
          break;
        }
      } catch (error) {
        console.log(`Échec avec ${url}:`, error.message);
      }
    }

    if (!opened) {
      Alert.alert(
        'Wave non installé',
        "Téléchargez l'application Wave pour effectuer le paiement.",
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Télécharger Wave',
            onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.wave.money'),
          },
        ]
      );
    }
  };

  const copyReference = () => {
    Clipboard.setString(reference);
    Alert.alert('Copié !', `Référence "${reference}" copiée.`);
  };

  const handleConfirm = () => {
    if (!selectedMethod) {
      Alert.alert('Attention', 'Veuillez sélectionner un moyen de paiement.');
      return;
    }
    setConfirmed(true);
  };

  if (confirmed) {
    return <ConfirmationScreen navigation={navigation} reference={reference} property={property} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#3B2A1B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement Visite 3D</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Info box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={24} color="#3B2A1B" />
          <Text style={styles.infoText}>
            Vous avez déjà effectué <Text style={styles.bold}>{nombreVisitesEffectuees}</Text> visite
            {nombreVisitesEffectuees > 1 ? 's' : ''} 3D gratuite{nombreVisitesEffectuees > 1 ? 's' : ''}.
            {'\n\n'}
            Pour continuer à explorer nos logements en 3D, payez <Text style={styles.highlight}>200 FCFA</Text> par visite.
          </Text>
        </View>

        {/* Montant */}
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>Montant à payer</Text>
          <Text style={styles.amountValue}>
            {VISIT_PRICE} <Text style={styles.amountCurrency}>FCFA</Text>
          </Text>
          <Text style={styles.amountSubtext}>Par visite 3D</Text>
        </View>

        {/* Référence */}
        <TouchableOpacity style={styles.referenceBox} onPress={copyReference} activeOpacity={0.75}>
          <View>
            <Text style={styles.referenceLabel}>Référence de paiement</Text>
            <Text style={styles.referenceValue}>{reference}</Text>
          </View>
          <Ionicons name="copy-outline" size={22} color="#FF9500" />
        </TouchableOpacity>
        <Text style={styles.referenceTip}>Appuyez pour copier • Indispensable pour l'activation</Text>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comment payer ?</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>1</Text></View>
            <Text style={styles.stepText}>Cliquez sur Wave ci-dessous pour ouvrir l'application</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>2</Text></View>
            <Text style={styles.stepText}>
              Envoyez exactement <Text style={styles.highlight}>200 FCFA</Text> au numéro indiqué
            </Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>3</Text></View>
            <Text style={styles.stepText}>
              Mentionnez la référence <Text style={styles.highlight}>{reference}</Text> dans le motif
            </Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>4</Text></View>
            <Text style={styles.stepText}>Revenez ici et cliquez sur "J'ai envoyé le paiement"</Text>
          </View>
        </View>

        {/* Moyen de paiement - Wave uniquement */}
        <Text style={styles.sectionTitle}>Moyen de paiement</Text>

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
              <Text style={styles.payNumber}>Envoyer à : {KAAY_DEUK_WAVE_NUMBER}</Text>
            </View>
          </View>
          <View style={styles.payCardRight}>
            {selectedMethod === 'wave'
              ? <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              : <Ionicons name="open-outline" size={22} color="#1652F0" />}
          </View>
        </TouchableOpacity>

        {/* Info activation */}
        <View style={styles.activationBox}>
          <Ionicons name="time-outline" size={20} color="#3B2A1B" />
          <Text style={styles.activationText}>
            Une fois votre paiement reçu, votre visite sera activée manuellement.
            L'activation se fait généralement dans les <Text style={styles.bold}>24h ouvrées</Text>.
          </Text>
        </View>

        {/* Bouton confirmation */}
        <TouchableOpacity
          style={[styles.confirmBtn, !selectedMethod && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.confirmBtnText}>J'ai envoyé le paiement</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function ConfirmationScreen({ navigation, reference, property }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />
      <ScrollView contentContainerStyle={styles.confirmScreen}>
        <View style={styles.confirmIconWrap}>
          <Ionicons name="checkmark-circle" size={72} color="#4CAF50" />
        </View>

        <Text style={styles.confirmTitle}>Paiement en attente</Text>
        <Text style={styles.confirmSubtitle}>
          Votre demande de visite a été enregistrée. Notre équipe validera votre paiement et activera votre accès.
        </Text>

        <View style={styles.confirmCard}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Référence</Text>
            <Text style={[styles.rowValue, styles.rowValueHighlight]}>{reference}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Montant</Text>
            <Text style={styles.rowValue}>200 FCFA</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Type</Text>
            <Text style={styles.rowValue}>Visite 3D</Text>
          </View>
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowLabel}>Statut</Text>
            <Text style={[styles.rowValue, styles.rowValueStatus]}>En attente de validation</Text>
          </View>
        </View>

        <View style={styles.confirmTipBox}>
          <Ionicons name="bulb-outline" size={20} color="#3B2A1B" />
          <Text style={styles.confirmTip}>
            <Text style={styles.bold}>Astuce :</Text> Conservez votre référence de paiement Wave pour toute réclamation.
            Vous recevrez une notification dès l'activation de votre visite.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
        >
          <Text style={styles.homeBtnText}>Retour à l'accueil</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E7CC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#3B2A1B' },
  scroll: { padding: 20, paddingBottom: 40 },

  // Info box
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8EC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
    gap: 10,
  },
  infoText: { flex: 1, fontSize: 13, color: '#3B2A1B', lineHeight: 19 },
  bold: { fontWeight: 'bold' },
  highlight: { color: '#FF9500', fontWeight: 'bold' },

  // Amount box
  amountBox: {
    backgroundColor: '#3B2A1B',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 },
  amountValue: { color: '#FF9500', fontSize: 36, fontWeight: 'bold' },
  amountCurrency: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: 'normal' },
  amountSubtext: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },

  // Reference
  referenceBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF9500',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  referenceLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  referenceValue: { fontSize: 17, fontWeight: 'bold', color: '#3B2A1B', letterSpacing: 1 },
  referenceTip: { fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 22 },

  // Steps
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#3B2A1B', marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B2A1B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumber: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  stepText: { flex: 1, fontSize: 14, color: '#3B2A1B', lineHeight: 20 },

  // Payment card
  payCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0D5C5',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  payCardSelected: { borderColor: '#4CAF50', backgroundColor: '#F0FFF4' },
  payCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  payCardRight: {},
  payLogo: {
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payLogoText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  payName: { fontSize: 16, fontWeight: 'bold', color: '#3B2A1B' },
  payNumber: { fontSize: 13, color: '#666', marginTop: 2 },

  // Activation info
  activationBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8EC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
    gap: 10,
  },
  activationText: { flex: 1, fontSize: 13, color: '#3B2A1B', lineHeight: 19 },

  // Confirm button
  confirmBtn: {
    backgroundColor: '#3B2A1B',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmBtnDisabled: { opacity: 0.45 },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  // Confirmation screen
  confirmScreen: { padding: 28, paddingBottom: 48, alignItems: 'center' },
  confirmIconWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF8EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  confirmTitle: { fontSize: 26, fontWeight: 'bold', color: '#3B2A1B', marginBottom: 12 },
  confirmSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    maxWidth: 320,
  },
  confirmCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAE0',
  },
  rowLabel: { fontSize: 14, color: '#888' },
  rowValue: { fontSize: 14, fontWeight: '600', color: '#3B2A1B', maxWidth: '55%', textAlign: 'right' },
  rowValueHighlight: { color: '#FF9500', letterSpacing: 0.5 },
  rowValueStatus: { color: '#E88A00', fontStyle: 'italic' },
  confirmTipBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8EC',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 28,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
    gap: 10,
  },
  confirmTip: { flex: 1, fontSize: 13, color: '#3B2A1B', lineHeight: 19 },
  homeBtn: {
    backgroundColor: '#3B2A1B',
    borderRadius: 14,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  homeBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});
