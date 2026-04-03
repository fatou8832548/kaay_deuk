
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

export default function VirtualTourScreen({ route }) {
  const { property } = route.params;
  const [selectedRoom, setSelectedRoom] = useState(property.rooms ? property.rooms[0] : 'Salon');

  return (
    <View style={styles.container}>
      <Image source={{ uri: property.image }} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.roomTitle}>{selectedRoom} - {property.title}</Text>
        {/* Liste des pièces */}
        <View style={styles.roomsRow}>
          {property.rooms && property.rooms.map((room) => (
            <TouchableOpacity
              key={room}
              style={[styles.roomPill, selectedRoom === room ? styles.roomPillActive : styles.roomPillInactive]}
              onPress={() => setSelectedRoom(room)}
              disabled={selectedRoom === room}
            >
              <Text style={[styles.roomPillText, selectedRoom === room ? styles.roomPillTextActive : styles.roomPillTextInactive]}>{room}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Contrôles de navigation 3D */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn}><Text style={styles.controlText}>↑</Text></TouchableOpacity>
        </View>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn}><Text style={styles.controlText}>←</Text></TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}><Text style={styles.controlText}>360°</Text></TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}><Text style={styles.controlText}>→</Text></TouchableOpacity>
        </View>
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn}><Text style={styles.controlText}>↓</Text></TouchableOpacity>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.readyText}>Prêt à réserver ?</Text>
          <TouchableOpacity style={styles.reserveBtn}><Text style={styles.reserveBtnText}>Réserver</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#222' },
  image: { width: '100%', height: '100%', position: 'absolute', opacity: 0.7 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  roomTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  roomsRow: { flexDirection: 'row', marginBottom: 12, marginTop: 4, justifyContent: 'center', alignItems: 'center' },
  roomPill: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8, minWidth: 80, alignItems: 'center', justifyContent: 'center' },
  roomPillActive: { backgroundColor: '#fff', borderWidth: 0 },
  roomPillInactive: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: '#3B2A1B' },
  roomPillText: { fontWeight: 'bold', fontSize: 14 },
  roomPillTextActive: { color: '#3B2A1B' },
  roomPillTextInactive: { color: '#bdbdbd' },
  controlsRow: { flexDirection: 'row', marginBottom: 4 },
  controlBtn: { backgroundColor: '#3B2A1B', borderRadius: 8, padding: 12, marginHorizontal: 8 },
  controlText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  bottomRow: { position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' },
  readyText: { color: '#fff', fontSize: 15, marginBottom: 8 },
  reserveBtn: { backgroundColor: '#C48A5A', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 },
  reserveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
