import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Image,
  Clipboard,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

// Numéro de réception des paiements Kaay Dëk
const KAAY_DEUK_WAVE_NUMBER = '77 000 00 00'; // ← À remplacer par votre numéro Wave
const KAAY_DEUK_OM_NUMBER = '77 000 00 00';   // ← À remplacer par votre numéro Orange Money

function generateReference(userId, planId) {
  const ts = Date.now().toString(36).toUpperCase();
  return `KD-${planId}-${userId || '0'}-${ts}`;
}

export default function SubscriptionPaymentScreen({ route }) {
  const navigation = useNavigation();
  const { user } = useUser();
  const { plan } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState(null); // 'wave' | 'om'
  const [confirmed, setConfirmed] = useState(false);

  const reference = React.useMemo(
    () => generateReference(user?.id, plan?.id),
    [user?.id, plan?.id]
  );

  const openWave = async () => {
    setSelectedMethod('wave');

    // Essayer plusieurs deep links Wave pour Android
    const waveUrls = [
      'wavemobile://',
      'wave://',
      'https://pay.wave.com/m/M_sn_KzQdzbz_xnrU/c/sn/'
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
        'Téléchargez l\'application Wave pour effectuer le paiement.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Télécharger Wave',
            onPress: () =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.wave.money'
              ),
          },
        ]
      );
    }
  };

  const openOrangeMoney = async () => {
    setSelectedMethod('om');
    // Tente d'ouvrir l'app Orange Money Sénégal
    const omUrl = 'orangemoney://';
    const canOpen = await Linking.canOpenURL(omUrl).catch(() => false);
    if (canOpen) {
      Linking.openURL(omUrl);
    } else {
      // Fallback : USSD via le composeur téléphonique
      Alert.alert(
        'Ouvrir Orange Money',
        `Composez le #144# sur votre téléphone ou téléchargez l'application Orange Money.`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Composer #144#',
            onPress: () => Linking.openURL('tel:*144%23'),
          },
          {
            text: 'Télécharger l\'app',
            onPress: () =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.orange.orangemoney.senegal'
              ),
          },
        ]
      );
    }
  };

  const copyReference = () => {
    Clipboard.setString(reference);
    Alert.alert('Copié !', `Référence "${reference}" copiée dans le presse-papier.`);
  };

  const handleConfirm = () => {
    if (!selectedMethod) {
      Alert.alert(
        'Choisissez un moyen de paiement',
        'Sélectionnez Wave ou Orange Money puis effectuez le virement avant de confirmer.'
      );
      return;
    }
    setConfirmed(true);
  };

  if (confirmed) {
    return <ConfirmationScreen navigation={navigation} plan={plan} reference={reference} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#3B2A1B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Récapitulatif du plan */}
        <View style={styles.planSummary}>
          <Text style={styles.planSummaryLabel}>Plan sélectionné</Text>
          <Text style={styles.planSummaryName}>{plan?.name}</Text>
          <Text style={styles.planSummaryPrice}>
            {plan?.price} FCFA
            <Text style={styles.planSummaryDuration}> {plan?.duration}</Text>
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comment payer ?</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>1</Text></View>
            <Text style={styles.stepText}>Choisissez votre moyen de paiement ci-dessous</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepBadge}><Text style={styles.stepNumber}>2</Text></View>
            <Text style={styles.stepText}>
              Envoyez exactement <Text style={styles.highlight}>{plan?.price} FCFA</Text> au numéro indiqué
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

        {/* Référence */}
        <TouchableOpacity style={styles.referenceBox} onPress={copyReference} activeOpacity={0.7}>
          <View>
            <Text style={styles.referenceLabel}>Référence de paiement</Text>
            <Text style={styles.referenceValue}>{reference}</Text>
          </View>
          <Ionicons name="copy-outline" size={22} color="#FF9500" />
        </TouchableOpacity>
        <Text style={styles.referenceTip}>Appuyez pour copier • Indispensable pour l'activation</Text>

        {/* Choix du moyen de paiement */}
        <Text style={styles.sectionTitle}>Choisir le moyen de paiement</Text>

        {/* Wave */}
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

        {/* Orange Money - Désactivé */}
        <TouchableOpacity
          style={[styles.payCard, selectedMethod === 'om' && styles.payCardSelected, styles.payCardDisabled]}
          onPress={() => Alert.alert('Bientôt disponible', 'Orange Money sera disponible prochainement. Utilisez Wave pour le moment.')}
          activeOpacity={0.8}
          disabled={true}
        >
          <View style={styles.payCardLeft}>
            <View style={[styles.payLogo, { backgroundColor: '#FF6200' }]}>
              <Text style={styles.payLogoText}>OM</Text>
            </View>
            <View>
              <Text style={[styles.payName, styles.textDisabled]}>Orange Money</Text>
              <Text style={[styles.payNumber, styles.textDisabled]}>Bientôt disponible</Text>
            </View>
          </View>
          <View style={styles.disabledBadgeCard}>
            <Text style={styles.disabledBadgeTextCard}>Bientôt</Text>
          </View>
        </TouchableOpacity>

        {/* Info activation */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#3B2A1B" />
          <Text style={styles.infoText}>
            Une fois votre virement reçu, notre équipe activera votre plan manuellement.
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
    </View>
  );
}

function ConfirmationScreen({ navigation, plan, reference }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />
      <ScrollView contentContainerStyle={styles.confirmScreen}>

        <View style={styles.confirmIconWrap}>
          <Ionicons name="time" size={72} color="#FF9500" />
        </View>

        <Text style={styles.confirmTitle}>Paiement soumis !</Text>
        <Text style={styles.confirmSubtitle}>
          Merci pour votre paiement. Notre équipe va vérifier votre virement et activer votre abonnement.
        </Text>

        <View style={styles.confirmCard}>
          <Row label="Plan" value={plan?.name} />
          <Row label="Montant" value={`${plan?.price} FCFA${plan?.duration}`} />
          <Row label="Référence" value={reference} highlight />
          <Row label="Statut" value="En attente de validation" status />
        </View>

        <View style={styles.confirmTipBox}>
          <Ionicons name="bulb-outline" size={20} color="#FF9500" />
          <Text style={styles.confirmTip}>
            Conservez la référence <Text style={styles.bold}>{reference}</Text>{' '}
            en cas de question. Vous recevrez une notification dès que votre plan est activé.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.homeBtnText}>Retour à l'accueil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtnSecondary}
          onPress={() => navigation.navigate('Profil')}
        >
          <Text style={styles.homeBtnSecondaryText}>Voir mon profil</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function Row({ label, value, highlight, status }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text
        style={[
          styles.rowValue,
          highlight && styles.rowValueHighlight,
          status && styles.rowValueStatus,
        ]}
      >
        {value}
      </Text>
    </View>
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

  // Plan summary
  planSummary: {
    backgroundColor: '#3B2A1B',
    borderRadius: 14,
    padding: 20,
    marginBottom: 22,
    alignItems: 'center',
  },
  planSummaryLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 },
  planSummaryName: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  planSummaryPrice: { color: '#FF9500', fontSize: 26, fontWeight: 'bold' },
  planSummaryDuration: { color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 'normal' },

  // Steps
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#3B2A1B', marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  stepBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#3B2A1B',
    alignItems: 'center', justifyContent: 'center',
    marginRight: 10, marginTop: 1, flexShrink: 0,
  },
  stepNumber: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  stepText: { flex: 1, fontSize: 14, color: '#3B2A1B', lineHeight: 20 },
  highlight: { color: '#FF9500', fontWeight: 'bold' },

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
  referenceValue: { fontSize: 18, fontWeight: 'bold', color: '#3B2A1B', letterSpacing: 1 },
  referenceTip: { fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 22 },

  // Payment cards
  payCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E0D5C5',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  payCardSelected: { borderColor: '#4CAF50', backgroundColor: '#F0FFF4' },
  payCardDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D0D0D0',
    opacity: 0.6,
  },
  payCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  payCardRight: {},
  payLogo: {
    width: 46, height: 46, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  payLogoText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  payName: { fontSize: 16, fontWeight: 'bold', color: '#3B2A1B' },
  payNumber: { fontSize: 13, color: '#666', marginTop: 2 },
  textDisabled: {
    color: '#999',
  },
  disabledBadgeCard: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  disabledBadgeTextCard: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  // Info
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8EC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 22,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9500',
    gap: 10,
  },
  infoText: { flex: 1, fontSize: 13, color: '#3B2A1B', lineHeight: 19 },
  bold: { fontWeight: 'bold' },

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
    marginBottom: 12,
  },
  homeBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  homeBtnSecondary: {
    borderWidth: 2,
    borderColor: '#3B2A1B',
    borderRadius: 14,
    paddingVertical: 13,
    width: '100%',
    alignItems: 'center',
  },
  homeBtnSecondaryText: { color: '#3B2A1B', fontWeight: 'bold', fontSize: 15 },
});
