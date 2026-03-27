import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

export default function RegisterScreen({ onRegister, onGoToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    password.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Logo, titre et sous-titre en dehors de la carte */}
      <View style={styles.headerTop}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heading}>Créer un compte</Text>
      </View>
      <Text style={styles.outsideSubheading}>Commencez votre recherche immobilière</Text>
      <View style={styles.card}>
        {/* Logo, titre et sous-titre déplacés en dehors de la carte */}

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Nom complet"
            placeholderTextColor="#8A7F74"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Adresse e-mail"
            placeholderTextColor="#8A7F74"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            placeholderTextColor="#8A7F74"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#8A7F74"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          disabled={!canSubmit}
          onPress={() => onRegister({ fullName, email, phone, password })}
        >
          <Text style={styles.primaryButtonText}>S'inscrire gratuitement</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToLogin} style={styles.secondaryLink}>
          <Text style={styles.secondaryText}>
            Déjà un compte ? <Text style={styles.linkText}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 30,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5E7CC',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B2A1B',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#6E6258',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 14,
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#F6F1E7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#3B2A1B',
    borderWidth: 1,
    borderColor: '#E6D9C7',
  },
  primaryButton: {
    backgroundColor: '#3B2A1B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
    width: '100%',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#6E6258',
    fontSize: 13,
  },
  linkText: {
    color: '#3B2A1B',
    fontWeight: '700',
  },
  outsideSubheading: {
    fontSize: 15,
    color: '#3B2A1B',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
});
