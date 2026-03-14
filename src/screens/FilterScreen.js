import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { X, Home, DollarSign, Wrench } from 'lucide-react-native';

export default function FilterScreen({ visible, onClose, onApply }) {
  const [propertyType, setPropertyType] = useState('Tout');
  const [minBudget, setMinBudget] = useState(50000);
  const [maxBudget, setMaxBudget] = useState(300000);
  const [facilities, setFacilities] = useState({
    wifi: false,
    furnished: false,
    stairs: false,
  });

  const handleApplyFilters = useCallback(() => {
    const filters = {
      propertyType,
      minBudget,
      maxBudget,
      facilities,
    };
    console.log('Filtres appliqués:', filters);
    if (onApply) onApply(filters);
    if (onClose) onClose();
  }, [propertyType, minBudget, maxBudget, facilities, onApply, onClose]);

  const toggleFacility = (key) => {
    setFacilities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity 
        style={styles.backdropTouchable} 
        activeOpacity={1} 
        onPress={onClose}
      />
      <View style={styles.bottomSheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtres</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#3B2A1B" size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Type de propriété */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Home color="#3B2A1B" size={20} />
            <Text style={styles.sectionTitle}>Type de propriété</Text>
          </View>

          <View style={styles.propertyTypes}>
            {['Tout', 'Studio', 'Appartement'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.propertyButton,
                  propertyType === type && styles.propertyButtonActive,
                ]}
                onPress={() => setPropertyType(type)}
              >
                <Text
                  style={[
                    styles.propertyButtonText,
                    propertyType === type && styles.propertyButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DollarSign color="#3B2A1B" size={20} />
            <Text style={styles.sectionTitle}>Budget (FCFA)</Text>
          </View>

          <View style={styles.budgetContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={500000}
              step={10000}
              value={minBudget}
              onValueChange={setMinBudget}
              minimumTrackTintColor="#3B2A1B"
              maximumTrackTintColor="#D9CBB7"
              thumbTintColor="#3B2A1B"
            />
            <View style={styles.budgetRange}>
              <Text style={styles.budgetText}>{minBudget.toLocaleString()}</Text>
              <Text style={styles.budgetText}>{maxBudget.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Équipements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Wrench color="#3B2A1B" size={20} />
            <Text style={styles.sectionTitle}>Équipements</Text>
          </View>

          <View style={styles.facilitiesContainer}>
            <View style={styles.facilityItem}>
              <Text style={styles.facilityText}>WiFi Haute Vitesse</Text>
              <Switch
                value={facilities.wifi}
                onValueChange={() => toggleFacility('wifi')}
                trackColor={{ false: '#D9CBB7', true: '#3B2A1B' }}
                thumbColor={facilities.wifi ? '#fff' : '#8A7F74'}
              />
            </View>

            <View style={styles.facilityItem}>
              <Text style={styles.facilityText}>Meublé</Text>
              <Switch
                value={facilities.furnished}
                onValueChange={() => toggleFacility('furnished')}
                trackColor={{ false: '#D9CBB7', true: '#3B2A1B' }}
                thumbColor={facilities.furnished ? '#fff' : '#8A7F74'}
              />
            </View>

            <View style={styles.facilityItem}>
              <Text style={styles.facilityText}>Escaliers internes</Text>
              <Switch
                value={facilities.stairs}
                onValueChange={() => toggleFacility('stairs')}
                trackColor={{ false: '#D9CBB7', true: '#3B2A1B' }}
                thumbColor={facilities.stairs ? '#fff' : '#8A7F74'}
              />
            </View>
          </View>
        </View>
        </ScrollView>

        {/* Bouton Appliquer */}
        <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
          <Text style={styles.applyButtonText}>Appliquer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdropTouchable: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheet: {
    backgroundColor: '#F5E7CC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginBottom: 0,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B2A1B',
  },
  propertyTypes: {
    flexDirection: 'row',
    gap: 10,
  },
  propertyButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: '#D9CBB7',
    alignItems: 'center',
  },
  propertyButtonActive: {
    backgroundColor: '#3B2A1B',
    borderColor: '#3B2A1B',
  },
  propertyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B2A1B',
  },
  propertyButtonTextActive: {
    color: '#fff',
  },
  budgetContainer: {
    gap: 12,
  },
  slider: {
    width: '100%',
    height: 4,
    borderRadius: 2,
  },
  budgetRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6E6258',
  },
  facilitiesContainer: {
    gap: 14,
  },
  facilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  facilityText: {
    fontSize: 13,
    color: '#3B2A1B',
    fontWeight: '500',
  },
  applyButton: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
    backgroundColor: '#3B2A1B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
