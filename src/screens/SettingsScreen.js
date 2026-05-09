
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import Slider from '@react-native-community/slider';
import { ChevronRight, Music, Move3d, Eye, User, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [verticalAxis, setVerticalAxis] = useState(false);
  const [shadowsEnabled, setShadowsEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [movementSensitivity, setMovementSensitivity] = useState(65);
  const [speed, setSpeed] = useState(40);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E7CC" />

      {/* Header avec bouton retour */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color="#3B2A1B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section Générale */}
        <View style={styles.sectionHeaderRow}>
          <User size={18} color="#7c715a" style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeader}>Général</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Langue de l'application</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Français</Text>
            <ChevronRight size={18} color="#b6a98c" />
          </TouchableOpacity>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e5e1d6', true: '#b6a98c' }}
              thumbColor={notificationsEnabled ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Section Navigation 3D */}
        <View style={styles.sectionHeaderRow}>
          <Move3d size={18} color="#7c715a" style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeader}>Navigation 3D</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.sliderRow}>
            <Text style={styles.label}>Sensibilité des mouvements</Text>
            <Text style={styles.sliderValue}>{movementSensitivity}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={movementSensitivity}
            onValueChange={setMovementSensitivity}
            minimumTrackTintColor="#b6a98c"
            maximumTrackTintColor="#e5e1d6"
            thumbTintColor="#b6a98c"
          />
          <View style={styles.sliderRow}>
            <Text style={styles.label}>Vitesse de déplacement</Text>
            <Text style={styles.sliderValue}>{speed}%</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            value={speed}
            onValueChange={setSpeed}
            minimumTrackTintColor="#b6a98c"
            maximumTrackTintColor="#e5e1d6"
            thumbTintColor="#b6a98c"
          />
          <TouchableOpacity style={styles.rowBetween}>
            <Text style={styles.label}>Mode de contrôle</Text>
            <View style={styles.rowRight}>
              <Text style={styles.subLabel}>Tactile + Gyroscope</Text>
              <ChevronRight size={18} color="#b6a98c" />
            </View>
          </TouchableOpacity>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Inverser l'axe vertical</Text>
            <Switch
              value={verticalAxis}
              onValueChange={setVerticalAxis}
              trackColor={{ false: '#e5e1d6', true: '#b6a98c' }}
              thumbColor={verticalAxis ? '#fff' : '#fff'}
            />
          </View>
        </View>

        {/* Section Graphismes & Son */}
        <View style={styles.sectionHeaderRow}>
          <Eye size={18} color="#7c715a" style={{ marginRight: 6 }} />
          <Text style={styles.sectionHeader}>Graphismes & Son</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity style={styles.rowBetween}>
            <Text style={styles.label}>Qualité d'affichage</Text>
            <View style={styles.rowRight}>
              <Text style={styles.quality}>Moyen</Text>
              <ChevronRight size={18} color="#b6a98c" />
            </View>
          </TouchableOpacity>
          <View style={styles.sliderRow}>
            <Text style={styles.label}>Luminosité</Text>
            <View style={styles.brightnessBar}>
              <View style={styles.brightnessFill} />
            </View>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Activer les ombres</Text>
            <Switch
              value={shadowsEnabled}
              onValueChange={setShadowsEnabled}
              trackColor={{ false: '#e5e1d6', true: '#b6a98c' }}
              thumbColor={shadowsEnabled ? '#fff' : '#fff'}
            />
          </View>
          <View style={styles.rowBetween}>
            <View style={styles.rowRight}>
              <Music size={18} color="#b6a98c" style={{ marginRight: 6 }} />
              <Text style={styles.label}>Musique d'ambiance</Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={setMusicEnabled}
              trackColor={{ false: '#e5e1d6', true: '#b6a98c' }}
              thumbColor={musicEnabled ? '#fff' : '#fff'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f7f3',
    paddingTop: 12,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#F5E7CC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 2, paddingHorizontal: 18,
  },
  sectionHeader: {
    color: '#7c715a',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    marginHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    color: '#7c715a',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: '#ede3cb',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dropdownText: {
    color: '#b6a98c',
    fontSize: 14,
    fontWeight: '600',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subLabel: {
    color: '#b6a98c',
    fontSize: 13,
    marginRight: 4,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 2,
  },
  slider: {
    width: '100%',
    height: 32,
    marginBottom: 8,
  },
  sliderValue: {
    color: '#b6a98c',
    fontSize: 13,
    fontWeight: '600',
  },
  quality: {
    color: '#b6a98c',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  brightnessBar: {
    width: 90,
    height: 6,
    backgroundColor: '#ede3cb',
    borderRadius: 3,
    overflow: 'hidden',
    marginLeft: 8,
  },
  brightnessFill: {
    width: 60,
    height: 6,
    backgroundColor: '#b6a98c',
    borderRadius: 3,
  },
});
