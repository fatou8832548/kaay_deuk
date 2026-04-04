import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Animated, PanResponder } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function VirtualTourScreen({ route }) {
  const { property } = route.params || {};
  const [selectedRoom, setSelectedRoom] = useState('Salon');
  const [lastDirection, setLastDirection] = useState(null);
  const rooms = ['Salon', 'Cuisine', 'Chambre', 'SDB'];
  const exampleImage = 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80';
  const window = Dimensions.get('window');
  const [imageOffset] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

  const slideImage = (dx, dy) => {
    Animated.spring(imageOffset, {
      toValue: { x: dx, y: dy },
      useNativeDriver: true,
      friction: 7,
    }).start(() => {
      // Revenir à la position initiale après le slide
      Animated.spring(imageOffset, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        friction: 7,
      }).start();
    });
  };

  // Images pour chaque pièce (à remplacer par vos propres images si besoin)
  const roomImages = {
    Salon: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    Cuisine: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80',
    Chambre: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    SDB: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  };

  // Fonction pour changer de pièce avec les flèches
  const changeRoom = (direction) => {
    const idx = rooms.indexOf(selectedRoom);
    let newIdx = idx;
    if (direction === 'left' || direction === 'up') newIdx = (idx - 1 + rooms.length) % rooms.length;
    if (direction === 'right' || direction === 'down') newIdx = (idx + 1) % rooms.length;
    setSelectedRoom(rooms[newIdx]);
  };

  // PanResponder pour déplacer l'image avec le doigt
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: imageOffset.x, dy: imageOffset.y }
    ], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      Animated.spring(imageOffset, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: true,
        friction: 7,
      }).start();
    },
  });

  // Ne pas changer de pièce dans handleDpad, juste déplacer l'image
  const handleDpad = (direction) => {
    setLastDirection(direction);
    if (direction === 'up') slideImage(0, -80);
    if (direction === 'down') slideImage(0, 80);
    if (direction === 'left') slideImage(-80, 0);
    if (direction === 'right') slideImage(80, 0);
  };

  // Exemple d'URL d'image panoramique libre de droits
  const panoramaUrl = 'https://images.pexels.com/photos/210243/pexels-photo-210243.jpeg?auto=compress&w=1600&h=800&fit=crop';

  // HTML pour Photo Sphere Viewer (libre et open source)
  const panoramaHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Panorama 360</title>
      <style>html,body,#viewer{width:100%;height:100%;margin:0;padding:0;overflow:hidden;background:transparent;}</style>
      <link rel="stylesheet" href="https://unpkg.com/photo-sphere-viewer@5/dist/photo-sphere-viewer.css" />
    </head>
    <body>
      <div id="viewer"></div>
      <script src="https://unpkg.com/uevent@2/browser.js"></script>
      <script src="https://unpkg.com/three@0.150.1/build/three.min.js"></script>
      <script src="https://unpkg.com/photo-sphere-viewer@5/dist/photo-sphere-viewer.js"></script>
      <script>
        new PhotoSphereViewer.Viewer({
          container: document.getElementById('viewer'),
          panorama: '${panoramaUrl}',
          defaultYaw: 0,
          defaultPitch: 0,
          navbar: ['zoom', 'fullscreen'],
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: roomImages[selectedRoom] }}
        style={[styles.image, { transform: imageOffset.getTranslateTransform() }]} {...panResponder.panHandlers} />

      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Text style={styles.headerBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Visite Guidée 3D</Text>
          <Text style={styles.headerSubtitle}>Salon Principal - Villa Nguinth</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <Ionicons name="settings" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Bloc central navigation */}

      {/* Bloc central : cercle overlay en haut */}

      <View style={styles.centerBlock}>
        <View style={styles.centralOverlayWrapper}>
          <View style={styles.centralCircleLarge} />
          <View style={styles.centralCircleSmall} />
        </View>
      </View>


      {/* Carré navigation centré sur la table */}

      <View style={styles.dpadContainerMaquette}>
        <View style={styles.dpadGridRow}>
          <View style={styles.dpadGridCell} />
          <TouchableOpacity style={styles.dpadBtnMaquette} onPress={() => handleDpad('up')}><Text style={styles.dpadBtnArrow}>▲</Text></TouchableOpacity>
          <View style={styles.dpadGridCell} />
        </View>
        <View style={styles.dpadGridRow}>
          <TouchableOpacity style={styles.dpadBtnMaquette} onPress={() => handleDpad('left')}><Text style={styles.dpadBtnArrow}>◀</Text></TouchableOpacity>
          <TouchableOpacity style={styles.dpadBtnCenter}><Text style={styles.dpadBtnCenterText}>360°</Text></TouchableOpacity>
          <TouchableOpacity style={styles.dpadBtnMaquette} onPress={() => handleDpad('right')}><Text style={styles.dpadBtnArrow}>▶</Text></TouchableOpacity>
        </View>
        <View style={styles.dpadGridRow}>
          <View style={styles.dpadGridCell} />
          <TouchableOpacity style={styles.dpadBtnMaquette} onPress={() => handleDpad('down')}><Text style={styles.dpadBtnArrow}>▼</Text></TouchableOpacity>
          <View style={styles.dpadGridCell} />
        </View>
      </View>
      {lastDirection && (
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 8 }}>
          {lastDirection === 'up' && 'Vous avez appuyé sur la flèche du haut'}
          {lastDirection === 'down' && 'Vous avez appuyé sur la flèche du bas'}
          {lastDirection === 'left' && 'Vous avez appuyé sur la flèche de gauche'}
          {lastDirection === 'right' && 'Vous avez appuyé sur la flèche de droite'}
        </Text>
      )}
      <Text style={styles.swipeText}>Glisser pour naviguer</Text>

      {/* Boutons pièces juste sous le carré */}
      <View style={styles.roomsRowMaquette}>
        {rooms.map((room, idx) => (
          <TouchableOpacity
            key={room}
            style={[styles.roomPill, selectedRoom === room ? styles.roomPillActive : styles.roomPillInactive, idx === 0 ? styles.roomPillFirst : null]}
            onPress={() => setSelectedRoom(room)}
            activeOpacity={0.8}
          >
            <Text style={[styles.roomPillText, selectedRoom === room ? styles.roomPillTextActive : styles.roomPillTextInactive]}>{room}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Encart réservation */}
      <View style={styles.bottomRow}>
        <View style={styles.readyBox}>
          <Text style={styles.readyTitle}>Prêt à réserver ?</Text>
          <Text style={styles.readyDesc}>Visitez, craquez, emménagez.</Text>
        </View>
        <TouchableOpacity style={styles.reserveBtn} activeOpacity={0.8}>
          <Text style={styles.reserveBtnText}>Réserver</Text>
        </TouchableOpacity>
      </View>

      {/* Panorama 360° Salon */}
      <View style={{flex: 1, width: '100%', height: 320, marginTop: 16, borderRadius: 18, overflow: 'hidden'}}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: panoramaHtml }}
          style={{flex: 1, backgroundColor: 'transparent'}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    marginHorizontal: 18,
    zIndex: 2,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.32)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  headerBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15.5,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.85,
  },
  centerBlock: {
    alignItems: 'center',
    marginTop: 38,
    marginBottom: 16,
    zIndex: 1,
    position: 'relative',
    minHeight: 260,
    justifyContent: 'center',
  },
  centralOverlayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 220,
    height: 220,
  },
  centralCircleLarge: {
    position: 'absolute',
    top: 100,
    left: 10,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.18)',
    zIndex: 0,
  },
  centralCircleSmall: {
    position: 'absolute',
    top: 175,
    left: 85,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.22)',
    zIndex: 2,
  },
  dpadContainerMaquette: {
    backgroundColor: 'rgba(60,40,20,0.55)',
    borderRadius: 32,
    width: 146,
    height: 146,
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  dpadGridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  dpadGridCell: {
    flex: 1,
  },
  dpadBtnMaquette: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 1,
  },
  dpadBtnArrow: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dpadBtnCenter: {
    backgroundColor: '#7B4B2A',
    borderRadius: 14,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 1,
  },
  dpadBtnCenterText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  roomsRowMaquette: {
    flexDirection: 'row',
    marginBottom: 18,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  dpadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dpadBtn: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 4,
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 1,
  },
  dpadBtn360: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 4,
    minWidth: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 1,
  },
  dpadBtnText: {
    color: '#3B2A1B',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  swipeText: {
    color: '#fff',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 2,
    textAlign: 'center',
    opacity: 0.8,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  roomsRow: {
    flexDirection: 'row',
    marginBottom: 18,
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  roomPill: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  roomPillFirst: {
    marginLeft: 8,
  },
  roomPillActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  roomPillInactive: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  roomPillText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  roomPillTextActive: {
    color: '#3B2A1B',
  },
  roomPillTextInactive: {
    color: '#fff',
    opacity: 0.7,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 24,
    left: 18,
    right: 18,
    backgroundColor: 'rgba(34, 22, 13, 0.75)',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  readyBox: {
    flex: 1,
  },
  readyTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  readyDesc: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  reserveBtn: {
    backgroundColor: '#C48A5A',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginLeft: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  reserveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
