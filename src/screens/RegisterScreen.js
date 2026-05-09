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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ onRegister, onGoToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation du téléphone
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{9,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Validation du mot de passe
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Validation lors de la soumission
  const handleSubmit = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    } else if (fullName.trim().length < 3) {
      newErrors.fullName = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!email.trim()) {
      newErrors.email = 'L\'adresse e-mail est requise';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Format d\'e-mail invalide';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Le numéro doit contenir au moins 9 chiffres';
    }

    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onRegister({ fullName, email, phone, password });
    }
  };

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Logo, titre et sous-titre déplacés en dehors de la carte */}

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="Nom complet"
              placeholderTextColor="#8A7F74"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors({ ...errors, fullName: null });
                }
              }}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Adresse e-mail"
              placeholderTextColor="#8A7F74"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: null });
                }
              }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Téléphone"
              placeholderTextColor="#8A7F74"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) {
                  setErrors({ ...errors, phone: null });
                }
              }}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.passwordInput, errors.password && styles.inputError]}
                placeholder="Mot de passe (min. 6 caractères)"
                placeholderTextColor="#8A7F74"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: null });
                  }
                }}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={22}
                  color="#8A7F74"
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            disabled={!canSubmit}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>S'inscrire gratuitement</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onGoToLogin} style={styles.secondaryLink}>
            <Text style={styles.secondaryText}>
              Déjà un compte ? <Text style={styles.linkText}>Se connecter</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    backgroundColor: '#F6F1E7',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 15,
    color: '#3B2A1B',
    borderWidth: 1,
    borderColor: '#E6D9C7',
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  inputError: {
    borderColor: '#D32F2F',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
