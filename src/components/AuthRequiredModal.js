import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Lock, LogIn, X } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function AuthRequiredModal({ visible, onClose, onLogin, feature = 'cette fonctionnalité' }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleLogin = () => {
    onClose();
    setTimeout(() => {
      onLogin();
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.modalContent}>
            {/* Header avec bouton fermer */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X color="#6E6258" size={24} />
            </TouchableOpacity>

            {/* Icône principale */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Lock color="#C48A5A" size={48} strokeWidth={2} />
              </View>
            </View>

            {/* Titre */}
            <Text style={styles.title}>Connexion requise</Text>
            <Text style={styles.subtitle}>
              Pour {feature}, vous devez être connecté à votre compte Kaay Dëk.
            </Text>

            {/* Message additionnel */}
            <View style={styles.messageContainer}>
              <Text style={styles.message}>
                Connectez-vous pour profiter de toutes les fonctionnalités : réservations, favoris sauvegardés, visites illimitées et bien plus !
              </Text>
            </View>

            {/* Boutons d'action */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
                activeOpacity={0.8}
              >
                <LogIn color="#FFF" size={20} strokeWidth={2.5} />
                <Text style={styles.primaryButtonText}>Se connecter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Plus tard</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  modalContent: {
    padding: 32,
    paddingTop: 24,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFE4CC',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3B2A1B',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#6E6258',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  messageContainer: {
    backgroundColor: '#FFF5EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
    borderLeftWidth: 4,
    borderLeftColor: '#C48A5A',
  },
  message: {
    fontSize: 14,
    color: '#3B2A1B',
    lineHeight: 20,
    textAlign: 'left',
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#C48A5A',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#C48A5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#8A7F74',
    fontSize: 16,
    fontWeight: '600',
  },
});
