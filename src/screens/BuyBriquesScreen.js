import React, { useState, useMemo } from 'react';
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
  Platform,
  TextInput,
} from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { API_CONFIG } from '../config/apiConfig';
import * as SecureStore from 'expo-secure-store';

const KAAY_DEUK_WAVE_NUMBER = '77 471 91 08';
const COUT_VISITE = 200; // briques par visite

const PACKS = [
  { briques: 200, label: '1 Visite', description: '200 Briques = 200 FCFA' },
  { briques: 500, label: '2 Visites +', description: '500 Briques = 500 FCFA' },
  { briques: 1000, label: '5 Visites', description: '1 000 Briques = 1 000 FCFA' },
  { briques: 2000, label: '10 Visites', description: '2 000 Briques = 2 000 FCFA' },
];

function generateReference(userId) {
  const ts = Date.now().toString(36).toUpperCase();
  return `KD-BRQ-${userId || '0'}-${ts}`;
}

export default function BuyBriquesScreen({ route }) {
  const navigation = useNavigation();
  const { user } = useUser();

  const [selectedPack, setSelectedPack] = useState(null);
  const [montantCustom, setMontantCustom] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const montantFinal = selectedPack
    ? selectedPack.briques
    : parseInt(montantCustom) || 0;

  const reference = useMemo(
    () => generateReference(user?.id || user?.chercheur?.utilisateurId),
    [user]
  );

  const openWave = async () => {
    setSelectedMethod('wave');
    if (montantFinal <= 0) {
      Alert.alert('Montant invalide', 'Veuillez sélectionner un pack ou entrer un montant.');
      return;
    }

    let opened = false;

    if (Platform.OS === 'android') {
      try {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: `https://pay.wave.com/m/M_sn_KzQdzbz_xnrU/c/sn/?amount=${montantFinal}`,
          packageName: 'com.wave.money',
          flags: 268435456,
        });
        opened = true;
      } catch {
        try {
          const fallback = encodeURIComponent('https://play.google.com/store/apps/details?id=com.wave.money');
          const intentUrl = `intent://pay.wave.com/m/M_sn_KzQdzbz_xnrU/c/sn/?amount=${montantFinal}#Intent;scheme=https;package=com.wave.money;S.browser_fallback_url=${fallback};end`;
          await Linking.openURL(intentUrl);
          opened = true;
        } catch (_) { }
      }
    } else {
      const urls = [
        `https://pay.wave.com/m/M_sn_KzQdzbz_xnrU/c/sn/?amount=${montantFinal}`,
        'wavemobile://',
        'wave://',
      ];
      for (const url of urls) {
        try {
          if (await Linking.canOpenURL(url).catch(() => false)) {
            await Linking.openURL(url);
            opened = true;
            break;
          }
        } catch { }
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

  const handleConfirm = async () => {
    if (!selectedMethod) {
      Alert.alert('Attention', 'Veuillez sélectionner un moyen de paiement.');
      return;
    }
    if (montantFinal <= 0) {
      Alert.alert('Attention', 'Veuillez sélectionner un pack ou entrer un montant valide.');
      return;
    }

    const chercheurId = user?.chercheur?.id;
    if (!chercheurId) {
      setConfirmed(true);
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const res = await fetch(`${API_CONFIG.API_ENDPOINT}/briques/acheter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chercheurId,
          montant: montantFinal,
          referenceWave: reference,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        Alert.alert('Erreur', err?.message || 'Impossible d\'enregistrer la demande.');
        setLoading(false);
        return;
      }
    } catch (e) {
      console.error('Erreur enregistrement achat briques:', e);
    }
    setLoading(false);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />
        <ScrollView contentContainerStyle={styles.confirmScreen}>
          <View style={styles.confirmIconWrap}>
            <Ionicons name="checkmark-circle" size={72} color="#4CAF50" />
          </View>
          <Text style={styles.confirmTitle}>Demande enregistrée !</Text>
          <Text style={styles.confirmSubtitle}>
            Votre achat de <Text style={styles.bold}>{montantFinal} Briques</Text> a été enregistré.
            Notre équipe créditera votre compte après réception du paiement Wave.
          </Text>
          <View style={styles.confirmCard}>
            <Row label="Montant Wave" value={`${montantFinal} FCFA`} />
            <Row label="Briques à recevoir" value={`${montantFinal} 🧱`} />
            <Row label="Référence" value={reference} highlight />
            <Row label="Statut" value="En attente de validation" status />
          </View>
          <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={20} color="#3B2A1B" />
            <Text style={styles.tipText}>
              Conservez la référence <Text style={styles.bold}>{reference}</Text> pour toute réclamation.
            </Text>
          </View>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.homeBtnText}>Retour au profil</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#3B2A1B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Acheter des Briques</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🧱</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>C'est quoi les Briques ?</Text>
            <Text style={styles.infoText}>
              1 Brique = 1 FCFA.{'\n'}
              Chaque visite virtuelle 3D coûte <Text style={styles.bold}>{COUT_VISITE} Briques</Text>.
              Achetez via Wave, notre équipe crédite votre compte.
            </Text>
          </View>
        </View>

        {/* Packs */}
        <Text style={styles.sectionTitle}>Choisir un pack</Text>
        <View style={styles.packsGrid}>
          {PACKS.map((pack) => (
            <TouchableOpacity
              key={pack.briques}
              style={[styles.packCard, selectedPack?.briques === pack.briques && styles.packCardSelected]}
              onPress={() => { setSelectedPack(pack); setMontantCustom(''); }}
              activeOpacity={0.8}
            >
              <Text style={styles.packBriques}>🧱 {pack.briques}</Text>
              <Text style={styles.packLabel}>{pack.label}</Text>
              <Text style={styles.packDesc}>{pack.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Montant personnalisé */}
        <Text style={styles.sectionTitle}>Ou entrez un montant libre</Text>
        <View style={styles.customInputRow}>
          <TextInput
            style={styles.customInput}
            placeholder="Ex: 300"
            keyboardType="numeric"
            value={montantCustom}
            onChangeText={(v) => { setMontantCustom(v); setSelectedPack(null); }}
          />
          <Text style={styles.customUnit}>FCFA = Briques</Text>
        </View>

        {/* Montant récapitulatif */}
        {montantFinal > 0 && (
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Vous achetez</Text>
            <Text style={styles.amountValue}>
              🧱 {montantFinal} <Text style={styles.amountSub}>Briques</Text>
            </Text>
            <Text style={styles.amountFcfa}>{montantFinal} FCFA à payer via Wave</Text>
          </View>
        )}

        {/* Référence */}
        <TouchableOpacity style={styles.referenceBox} onPress={copyReference} activeOpacity={0.75}>
          <View>
            <Text style={styles.referenceLabel}>Référence de paiement</Text>
            <Text style={styles.referenceValue}>{reference}</Text>
          </View>
          <Ionicons name="copy-outline" size={22} color="#FF9500" />
        </TouchableOpacity>
        <Text style={styles.referenceTip}>Appuyez pour copier • À mentionner dans le motif Wave</Text>

        {/* Étapes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
          {[
            'Sélectionnez un pack ou entrez un montant',
            `Cliquez sur Wave pour ouvrir l'application`,
            `Envoyez le montant au ${KAAY_DEUK_WAVE_NUMBER} avec la référence`,
            'Revenez ici et confirmez — vos briques seront créditées sous 24h',
          ].map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepBadge}><Text style={styles.stepNum}>{i + 1}</Text></View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Moyen de paiement */}
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
          {selectedMethod === 'wave'
            ? <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            : <Ionicons name="open-outline" size={22} color="#1652F0" />}
        </TouchableOpacity>

        {/* Bouton confirmation */}
        <TouchableOpacity
          style={[styles.confirmBtn, (!selectedMethod || montantFinal <= 0 || loading) && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          activeOpacity={0.85}
          disabled={!selectedMethod || montantFinal <= 0 || loading}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
          <Text style={styles.confirmBtnText}>
            {loading ? 'Enregistrement...' : "J'ai envoyé le paiement"}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, highlight, status }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, highlight && rowStyles.highlight, status && rowStyles.status]}>
        {value}
      </Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0E8DC' },
  label: { color: '#888', fontSize: 13 },
  value: { color: '#3B2A1B', fontWeight: '600', fontSize: 13 },
  highlight: { color: '#FF9500' },
  status: { color: '#C48A5A' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E7CC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#3B2A1B' },
  scroll: { padding: 20, paddingBottom: 40 },
  infoBox: {
    flexDirection: 'row', backgroundColor: '#FFF8EC', borderRadius: 12,
    padding: 14, marginBottom: 22, borderLeftWidth: 3, borderLeftColor: '#FF9500', gap: 12,
  },
  infoIcon: { fontSize: 24, alignSelf: 'flex-start' },
  infoTitle: { fontWeight: 'bold', color: '#3B2A1B', marginBottom: 4, fontSize: 14 },
  infoText: { fontSize: 13, color: '#3B2A1B', lineHeight: 19 },
  bold: { fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#3B2A1B', marginBottom: 12, marginTop: 4 },
  packsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  packCard: {
    backgroundColor: '#FFF', borderRadius: 14, borderWidth: 2, borderColor: '#E0D5C5',
    padding: 14, width: '47%', alignItems: 'center',
  },
  packCardSelected: { borderColor: '#C48A5A', backgroundColor: '#FFF8EC' },
  packBriques: { fontSize: 18, fontWeight: 'bold', color: '#3B2A1B', marginBottom: 4 },
  packLabel: { fontSize: 13, fontWeight: '600', color: '#3B2A1B' },
  packDesc: { fontSize: 11, color: '#888', marginTop: 2 },
  customInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  customInput: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 2, borderColor: '#E0D5C5',
    padding: 14, fontSize: 16, color: '#3B2A1B',
  },
  customUnit: { fontSize: 13, color: '#888', flexShrink: 1 },
  amountBox: {
    backgroundColor: '#3B2A1B', borderRadius: 14, padding: 18, alignItems: 'center', marginBottom: 16,
  },
  amountLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 },
  amountValue: { color: '#FF9500', fontSize: 30, fontWeight: 'bold' },
  amountSub: { color: 'rgba(255,255,255,0.7)', fontSize: 16, fontWeight: 'normal' },
  amountFcfa: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },
  referenceBox: {
    backgroundColor: '#FFF', borderRadius: 12, borderWidth: 2, borderColor: '#FF9500',
    padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4,
  },
  referenceLabel: { fontSize: 11, color: '#888', marginBottom: 2 },
  referenceValue: { fontSize: 15, fontWeight: 'bold', color: '#3B2A1B', letterSpacing: 1 },
  referenceTip: { fontSize: 11, color: '#888', textAlign: 'center', marginBottom: 22 },
  section: { marginBottom: 18 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  stepBadge: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#3B2A1B',
    alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 1, flexShrink: 0,
  },
  stepNum: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  stepText: { flex: 1, fontSize: 14, color: '#3B2A1B', lineHeight: 20 },
  payCard: {
    backgroundColor: '#FFF', borderRadius: 14, borderWidth: 2, borderColor: '#E0D5C5',
    padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
  },
  payCardSelected: { borderColor: '#4CAF50', backgroundColor: '#F0FFF4' },
  payCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  payLogo: { width: 46, height: 46, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  payLogoText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  payName: { fontSize: 16, fontWeight: 'bold', color: '#3B2A1B' },
  payNumber: { fontSize: 13, color: '#666', marginTop: 2 },
  confirmBtn: {
    backgroundColor: '#3B2A1B', borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  confirmBtnDisabled: { opacity: 0.45 },
  confirmBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  confirmScreen: { padding: 24, alignItems: 'center' },
  confirmIconWrap: { marginBottom: 16, marginTop: 20 },
  confirmTitle: { fontSize: 24, fontWeight: 'bold', color: '#3B2A1B', textAlign: 'center', marginBottom: 10 },
  confirmSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  confirmCard: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 16, width: '100%', marginBottom: 16,
  },
  tipBox: {
    flexDirection: 'row', backgroundColor: '#FFF8EC', borderRadius: 12,
    padding: 14, marginBottom: 24, borderLeftWidth: 3, borderLeftColor: '#FF9500', gap: 10, width: '100%',
  },
  tipText: { flex: 1, fontSize: 13, color: '#3B2A1B', lineHeight: 19 },
  homeBtn: {
    backgroundColor: '#3B2A1B', borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 40, alignItems: 'center',
  },
  homeBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});
