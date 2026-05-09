import React, { useState, useEffect } from 'react';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ReservationProvider } from './src/context/ReservationContext';
import { UserProvider, useUser } from './src/context/UserContext';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import OnboardingConfirmScreen from './src/screens/OnboardingConfirmScreen';
import OnboardingWelcomeScreen from './src/screens/OnboardingWelcomeScreen';
import { login as loginService, register as registerService, getCurrentUser, logout as logoutService } from './src/services/authService';

enableScreens();

function AppContent() {
  const [route, setRoute] = useState('splash');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();

  // Vérifier l'utilisateur au démarrage de l'app
  useEffect(() => {
    let isComponentMounted = true;

    async function initializeApp() {
      try {
        // Attendre que AsyncStorage soit prêt
        await new Promise(resolve => setTimeout(resolve, 1000));

        const currentUser = await getCurrentUser();

        if (isComponentMounted) {
          if (currentUser) {
            setUser(currentUser);
            setRoute('home');
          } else {
            // Pas d'utilisateur, continuer avec le flow normal
            setRoute('onboarding');
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        // En cas d'erreur, continuer avec le flow normal
        if (isComponentMounted) {
          setRoute('onboarding');
        }
      }
    }

    initializeApp();

    return () => {
      isComponentMounted = false;
    };
  }, []);

  const handleFinishSplash = () => {
    setRoute('onboarding');
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const result = await loginService(credentials.email, credentials.password);

      // Le backend retourne { data: { utilisateur, access_token }, success, timestamp }
      const userData = result.data?.utilisateur || result.utilisateur;

      if (userData) {
        setUser(userData);
        setRoute('home');
      } else {
        Alert.alert('Erreur', 'Connexion réussie mais données utilisateur manquantes');
      }
    } catch (error) {
      console.error('Erreur login:', error);
      Alert.alert('Erreur de connexion', error.message || 'Impossible de se connecter. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data) => {
    try {
      setLoading(true);

      const userData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      const result = await registerService(userData);

      // Le backend retourne { data: { utilisateur, access_token }, success, timestamp }
      const userInfo = result.data?.utilisateur || result.utilisateur;

      if (userInfo) {
        setUser(userInfo);
        Alert.alert(
          'Inscription réussie',
          'Votre compte a été créé avec succès.',
          [{ text: 'OK', onPress: () => setRoute('home') }]
        );
      } else {
        Alert.alert('Erreur', 'Inscription réussie mais données utilisateur manquantes');
      }
    } catch (error) {
      console.error('Erreur register:', error);
      Alert.alert('Erreur d\'inscription', error.message || 'Impossible de créer le compte. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutService();
      setUser(null);
      setRoute('login');
    } catch (error) {
      console.error('Erreur logout:', error);
      Alert.alert('Erreur', 'Impossible de se déconnecter.');
    }
  };

  const renderCurrentScreen = () => {
    if (loading) {
      return (
        <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color="#3B2A1B" />
        </View>
      );
    }

    switch (route) {
      case 'splash':
        return <SplashScreen onFinish={handleFinishSplash} />;
      case 'onboarding':
        if (onboardingStep === 1) {
          return (
            <OnboardingWelcomeScreen
              onNext={() => setOnboardingStep(2)}
              onSkip={() => setRoute('login')}
            />
          );
        } else if (onboardingStep === 2) {
          return (
            <OnboardingScreen
              onNext={() => setOnboardingStep(3)}
              onBack={() => setOnboardingStep(1)}
            />
          );
        } else if (onboardingStep === 3) {
          return (
            <OnboardingConfirmScreen
              onStart={() => setRoute('login')}
            />
          );
        }
        break;
      case 'login':
        return <LoginScreen onLogin={handleLogin} onGoToRegister={() => setRoute('register')} />;
      case 'register':
        return <RegisterScreen onRegister={handleRegister} onGoToLogin={() => setRoute('login')} />;
      case 'home':
        return <MainTabNavigator onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  return <View style={styles.root}>{renderCurrentScreen()}</View>;
}

export default function App() {
  return (
    <UserProvider>
      <FavoritesProvider>
        <ReservationProvider>
          <AppContent />
        </ReservationProvider>
      </FavoritesProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5E7CC',
  },
});
