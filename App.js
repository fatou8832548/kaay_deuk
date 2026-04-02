import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';

enableScreens();

export default function App() {
  const [route, setRoute] = useState('splash');

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
        return <OnboardingScreen onNext={() => setRoute('login')} onBack={() => setRoute('splash')} />;
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

  return <View style={styles.root}>{renderCurrentScreen()}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5E7CC',
  },
});
