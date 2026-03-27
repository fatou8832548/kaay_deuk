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

export default function LoginScreen({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = email.trim().length > 0 && password.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.headerTop}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heading}>Bon retour !</Text>
      </View>
      {/* Ajout du texte en dehors de la carte */}
      <Text style={styles.outsideSubheading}>Connectez-vous pour continuer</Text>
      <View style={styles.card}>
        {/* Le texte est maintenant en dehors de la carte */}

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
            placeholder="Mot de passe"
            placeholderTextColor="#8A7F74"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.forgotLink} onPress={() => null}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryButton, !canSubmit && styles.disabledButton]} disabled={!canSubmit} onPress={() => onLogin({ email, password })}>
          <Text style={styles.primaryButtonText}>Se connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onGoToRegister} style={styles.secondaryLink}>
          <Text style={styles.secondaryText}>
            Nouveau sur Kaay Dëk ? <Text style={styles.linkText}>Créer un compte</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  headerTop: {
    alignItems: 'center',
    marginBottom: 18,
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
  logo: {
    width: 110,
    height: 110,
    alignSelf: 'center',
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: '#3B2A1B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
    width: '100%',
  },
  disabledButton: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    color: '#3B2A1B',
    fontSize: 12,
    fontWeight: '600',
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
