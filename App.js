import React, { useState } from 'react';
import { FavoritesProvider } from './src/context/FavoritesContext';
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

export default function App() {
  const [route, setRoute] = useState('splash');
  const [onboardingStep, setOnboardingStep] = useState(1);

  const handleFinishSplash = () => {
    setRoute('onboarding');
  };

  const handleLogin = (credentials) => {
    // TODO: Replace this with real auth (API call)
    console.log('Login attempt', credentials);
    setRoute('home');
  };

  const handleRegister = (data) => {
    // TODO: Replace this with signup logic / API call
    console.log('Register attempt', data);
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
        return <MainTabNavigator onLogout={() => setRoute('login')} />;
      default:
        return null;
    }
  };

  return (
    <FavoritesProvider>
      <View style={styles.root}>{renderCurrentScreen()}</View>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5E7CC',
  },
});
