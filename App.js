import React, { useState } from 'react';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { ReservationProvider } from './src/context/ReservationContext';
import { UserProvider, useUser } from './src/context/UserContext';
import { StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import OnboardingConfirmScreen from './src/screens/OnboardingConfirmScreen';
import OnboardingWelcomeScreen from './src/screens/OnboardingWelcomeScreen';

enableScreens();

function AppContent() {
  const [route, setRoute] = useState('splash');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const { setUser } = useUser();

  const handleFinishSplash = () => {
    setRoute('onboarding');
  };

  const handleLogin = (credentials) => {
    setUser({ fullName: credentials.email, email: credentials.email, phone: '' });
    setRoute('home');
  };

  const handleRegister = (data) => {
    setUser({ fullName: data.fullName, email: data.email, phone: data.phone });
    setRoute('home');
  };

  const renderCurrentScreen = () => {
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
        return <MainTabNavigator onLogout={() => { setUser(null); setRoute('login'); }} />;
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
