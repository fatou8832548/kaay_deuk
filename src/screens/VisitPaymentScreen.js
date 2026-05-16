import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Ce screen redirige vers BuyBriques — les visites 3D utilisent maintenant des Briques
export default function VisitPaymentScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Rediriger automatiquement vers l'achat de briques
    const timer = setTimeout(() => {
      navigation.replace('BuyBriques');
    }, 100);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🧱</Text>
        <Text style={styles.title}>Les visites 3D utilisent des Briques</Text>
        <Text style={styles.subtitle}>200 Briques par visite • 1 Brique = 1 FCFA</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('BuyBriques')}>
          <Ionicons name="add-circle-outline" size={20} color="#FFF" />
          <Text style={styles.btnText}>Acheter des Briques</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E7CC' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#3B2A1B', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6E6258', textAlign: 'center', marginBottom: 32 },
  btn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#C48A5A', borderRadius: 14, paddingVertical: 14, paddingHorizontal: 28,
    marginBottom: 12,
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  backBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  backBtnText: { color: '#6E6258', fontSize: 15 },
});
