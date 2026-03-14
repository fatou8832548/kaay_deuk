import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

export default function App() {
  const [route, setRoute] = useState('splash');

  const handleFinishSplash = () => {
    setRoute('login');
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
      case 'login':
        return <LoginScreen onLogin={handleLogin} onGoToRegister={() => setRoute('register')} />;
      case 'register':
        return <RegisterScreen onRegister={handleRegister} onGoToLogin={() => setRoute('login')} />;
      case 'home':
        return (
          <View style={styles.container}>
            <View style={styles.homeCard}>
              <StatusBar style="dark" />
              <View style={styles.homeHeader}>
                <Text style={styles.homeTitle}>Bienvenue !</Text>
                <Text style={styles.homeSubtitle}>Vous êtes connecté(e).</Text>
              </View>
              <Text style={styles.homeHint}>Utilisez le menu ou reconnectez-vous pour continuer.</Text>
              <Text onPress={() => setRoute('login')} style={styles.logoutLink}>
                Se déconnecter
              </Text>
            </View>
          </View>
        );
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#F5E7CC',
  },
  homeCard: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  homeHeader: {
    marginBottom: 12,
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  homeSubtitle: {
    fontSize: 14,
    color: '#6E6258',
    marginTop: 6,
  },
  homeHint: {
    fontSize: 13,
    color: '#6E6258',
    textAlign: 'center',
    marginTop: 12,
  },
  logoutLink: {
    marginTop: 18,
    color: '#3B2A1B',
    fontWeight: '700',
  },
});
