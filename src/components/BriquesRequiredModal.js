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
import { Coins, ShoppingBag, X, Gift } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function BriquesRequiredModal({
  visible,
  onClose,
  onBuyBriques,
  nombreVisites = 0,
  briquesRequises = 200,
  briquesActuelles = 0
}) {
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

  const handleBuy = () => {
    if (onBuyBriques) {
      onBuyBriques();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.modal}>
          {/* Bouton fermer */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#8B7355" />
          </TouchableOpacity>

          {/* Icône principale */}
          <View style={styles.iconContainer}>
            <Coins size={48} color="#C48A5A" strokeWidth={2} />
          </View>

          {/* Titre */}
          <Text style={styles.title}>Briques requises</Text>

          {/* Message personnalisé */}
          <View style={styles.messageContainer}>
            {nombreVisites > 0 && (
              <View style={styles.infoRow}>
                <Gift size={16} color="#C48A5A" />
                <Text style={styles.infoText}>
                  Vous avez effectué {nombreVisites} visite{nombreVisites > 1 ? 's' : ''} 3D
                </Text>
              </View>
            )}

            <Text style={styles.message}>
              Votre première visite 3D était gratuite !{'\n'}
              Pour continuer à explorer, il vous faut :
            </Text>

            {/* Briques requises */}
            <View style={styles.priceContainer}>
              <Coins size={24} color="#C48A5A" />
              <Text style={styles.priceAmount}>{briquesRequises}</Text>
              <Text style={styles.priceLabel}>Briques</Text>
            </View>

            {/* Solde actuel */}
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Solde actuel :</Text>
              <View style={styles.balanceValue}>
                <Coins size={18} color={briquesActuelles >= briquesRequises ? '#4CAF50' : '#E74C3C'} />
                <Text style={[
                  styles.balanceAmount,
                  { color: briquesActuelles >= briquesRequises ? '#4CAF50' : '#E74C3C' }
                ]}>
                  {briquesActuelles}
                </Text>
                <Text style={styles.balanceText}>Briques</Text>
              </View>
            </View>

            {/* Message encourageant */}
            {briquesActuelles < briquesRequises && (
              <View style={styles.encouragementBox}>
                <Text style={styles.encouragementText}>
                  💡 Achetez des Briques pour débloquer toutes les visites 3D
                </Text>
              </View>
            )}
          </View>

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Plus tard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleBuy}
              activeOpacity={0.8}
            >
              <ShoppingBag size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.primaryButtonText}>Acheter des Briques</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5EB',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B2A1B',
    textAlign: 'center',
    marginBottom: 16,
  },
  messageContainer: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5EB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#8B7355',
    marginLeft: 8,
    fontWeight: '500',
  },
  message: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5EB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#C48A5A',
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#C48A5A',
    marginLeft: 8,
  },
  priceLabel: {
    fontSize: 18,
    color: '#8B7355',
    marginLeft: 8,
    fontWeight: '600',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  balanceValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  balanceText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  encouragementBox: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#C48A5A',
  },
  encouragementText: {
    fontSize: 13,
    color: '#8B7355',
    lineHeight: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#C48A5A',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C48A5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
