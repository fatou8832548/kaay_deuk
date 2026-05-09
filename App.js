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

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Si l'utilisateur est déjà connecté, aller directement à home
        if (route === 'login' || route === 'register') {
          setRoute('home');
        }
      }
    }

    if (route !== 'splash' && route !== 'onboarding') {
      checkUser();
    }
  }, [route]);

  const handleFinishSplash = () => {
    setRoute('onboarding');
  };

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      const result = await loginService(credentials.email, credentials.password);

      if (result.utilisateur) {
        setUser(result.utilisateur);
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
        nom: data.fullName,
        email: data.email,
        telephone: data.phone,
        motDePasse: data.password,
        typeUtilisateur: 'CHERCHEUR', // Par défaut, les nouveaux utilisateurs sont des chercheurs
      };

      await registerService(userData);

      Alert.alert(
        'Inscription réussie',
        'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
        [{ text: 'OK', onPress: () => setRoute('login') }]
      );
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
