import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Supprime le warning texture size
THREE.TextureLoader = TextureLoader;

const ROOMS = [
  { key: 'Salon',   icon: 'home-outline',      asset: require('../../assets/360.jpg'), label: 'Salon Principal' },
  { key: 'Cuisine', icon: 'restaurant-outline', asset: require('../../assets/360.jpg'), label: 'Cuisine Ouverte' },
  { key: 'Chambre', icon: 'bed-outline',        asset: require('../../assets/360.jpg'), label: 'Chambre Parentale' },
  { key: 'SDB',     icon: 'water-outline',      asset: require('../../assets/360.jpg'), label: 'Salle de Bain' },
];

export default function VirtualTourScreen({ route }) {
  const navigation = useNavigation();
  const [roomIndex, setRoomIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [glKey, setGlKey] = useState(0);

  // Three.js refs
  const rendererRef = useRef(null);
  const sceneRef    = useRef(null);
  const cameraRef   = useRef(null);
  const meshRef     = useRef(null);
  const animRef     = useRef(null);
  const phiRef      = useRef(Math.PI / 2);   // elevation
  const thetaRef    = useRef(0);              // horizontal
  const dragging    = useRef(false);
  const lastPos     = useRef({ x: 0, y: 0 });

  // PanResponder pour tourner la vue
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant: (_, gs) => {
      dragging.current = true;
      lastPos.current  = { x: gs.x0, y: gs.y0 };
    },
    onPanResponderMove: (_, gs) => {
      if (!dragging.current) return;
      var dx = gs.moveX - lastPos.current.x;
      var dy = gs.moveY - lastPos.current.y;
      lastPos.current = { x: gs.moveX, y: gs.moveY };
      thetaRef.current -= dx * 0.005;
      phiRef.current    = Math.max(0.1, Math.min(Math.PI - 0.1, phiRef.current + dy * 0.005));
      updateCamera();
    },
    onPanResponderRelease: () => { dragging.current = false; },
  });

  function updateCamera() {
    if (!cameraRef.current) return;
    var phi   = phiRef.current;
    var theta = thetaRef.current;
    cameraRef.current.target = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta),
    );
    cameraRef.current.lookAt(cameraRef.current.target);
  }

  async function onContextCreate(gl) {
    setLoading(true);

    // Renderer
    var renderer = new Renderer({ gl, clearColor: 0x000000 });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    rendererRef.current = renderer;

    // Scene
    var scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    var camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      500,
    );
    camera.position.set(0, 0, 0);
    camera.target = new THREE.Vector3(1, 0, 0);
    camera.lookAt(camera.target);
    cameraRef.current = camera;

    // Sphere (inside-out) avec la texture 360
    var loader  = new TextureLoader();
    var texture = await new Promise(function(resolve, reject) {
      loader.load(
        ROOMS[roomIndex].asset,
        function(tex) { resolve(tex); },
        undefined,
        function(err) { reject(err); },
      );
    });

    texture.mapping = THREE.EquirectangularReflectionMapping;

    var geometry = new THREE.SphereGeometry(200, 60, 40);
    geometry.scale(-1, 1, 1); // retourner la sphere de l interieur
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var mesh     = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    setLoading(false);

    // Boucle de rendu
    function animate() {
      animRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    animate();
  }

  function cleanup() {
    if (animRef.current) { cancelAnimationFrame(animRef.current); }
    if (rendererRef.current) { rendererRef.current.dispose(); }
    rendererRef.current = null;
    sceneRef.current    = null;
    cameraRef.current   = null;
    meshRef.current     = null;
  }

  function goToRoom(i) {
    if (i === roomIndex) return;
    cleanup();
    setRoomIndex(i);
    setLoading(true);
    setGlKey(function(k) { return k + 1; });
  }

  return (
    <View style={styles.container}>
      <GLView
        key={glKey}
        style={StyleSheet.absoluteFill}
        onContextCreate={onContextCreate}
        {...panResponder.panHandlers}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#C48A5A" />
          <Text style={styles.loadingText}>Chargement du panorama...</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header} pointerEvents="box-none">
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}
          onPress={function() { cleanup(); navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Visite 360deg</Text>
          <Text style={styles.headerSubtitle}>{ROOMS[roomIndex].label}</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}
          onPress={function() { navigation.navigate('Parametres'); }}>
          <Ionicons name="settings-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Indice glisser */}
      {!loading && (
        <View style={styles.swipeHint} pointerEvents="none">
          <Ionicons name="hand-left-outline" size={14} color="rgba(255,255,255,0.85)" />
          <Text style={styles.swipeHintText}>Glissez pour explorer</Text>
        </View>
      )}

      {/* Pills rooms */}
      <View style={styles.roomsRow} pointerEvents="box-none">
        {ROOMS.map(function(room, i) {
          var active = i === roomIndex;
          return (
            <TouchableOpacity
              key={room.key}
              style={[styles.roomPill, active ? styles.roomPillActive : styles.roomPillInactive]}
              onPress={function() { goToRoom(i); }}
              activeOpacity={0.8}
            >
              <Ionicons name={room.icon} size={12}
                color={active ? '#3B2A1B' : '#fff'} style={styles.roomIcon} />
              <Text style={[styles.roomPillText,
                active ? styles.roomPillTextActive : styles.roomPillTextInactive]}>
                {room.key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Carte bas */}
      <View style={styles.bottomCard} pointerEvents="box-none">
        <View style={styles.readyBox}>
          <Text style={styles.readyTitle}>Pret a reserver ?</Text>
          <Text style={styles.readyDesc}>Visitez, craquez, emmenagez.</Text>
        </View>
        <TouchableOpacity
          style={styles.reserveBtn}
          activeOpacity={0.8}
          onPress={function() {
            cleanup();
            navigation.navigate('ReservationScreen',
              { property: route && route.params ? route.params.property : null });
          }}
        >
          <Text style={styles.reserveBtnText}>Reserver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

var styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center', justifyContent: 'center', zIndex: 99,
  },
  loadingText: { color: '#fff', marginTop: 12, fontSize: 14 },
  header: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: 48, paddingBottom: 12, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 20,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  swipeHint: {
    position: 'absolute', top: '48%', alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7, zIndex: 10,
  },
  swipeHintText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginLeft: 7 },
  roomsRow: {
    position: 'absolute', bottom: 110, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center',
    zIndex: 15, paddingHorizontal: 16,
  },
  roomPill: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginHorizontal: 4, borderWidth: 1.5,
  },
  roomPillActive:   { backgroundColor: '#fff',            borderColor: '#fff' },
  roomPillInactive: { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.25)' },
  roomIcon: { marginRight: 5 },
  roomPillText:         { fontWeight: '700', fontSize: 12 },
  roomPillTextActive:   { color: '#3B2A1B' },
  roomPillTextInactive: { color: '#fff' },
  bottomCard: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(30,18,8,0.9)', borderRadius: 20,
    padding: 16, zIndex: 20,
  },
  readyBox:       { flex: 1 },
  readyTitle:     { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 3 },
  readyDesc:      { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  reserveBtn:     { backgroundColor: '#C48A5A', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 22, marginLeft: 12 },
  reserveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});