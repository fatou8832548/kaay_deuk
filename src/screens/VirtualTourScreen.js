import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_CONFIG } from '../config/apiConfig';
import { useUser } from '../context/UserContext';
import { verifierAccesVisite3D, enregistrerVisite3D } from '../services/visite3DService';

// Helpers
async function urlToDataUri(urlPath) {
  try {
    const fullUrl = urlPath.startsWith('http')
      ? urlPath
      : `${API_CONFIG.BASE_URL}${urlPath}`;
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error('Erreur teleChargement');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erreur conversion URL:', error);
    throw error;
  }
}

function buildHtml(dataUri) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { background:#111; overflow:hidden; width:100vw; height:100vh; }
    canvas { display:block; }
  </style>
</head>
<body>
<canvas id="c"></canvas>
<script src="https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js"></script>
<script>
(function() {
  var c = document.getElementById('c');
  c.width  = window.innerWidth;
  c.height = window.innerHeight;
  var renderer = new THREE.WebGLRenderer({ canvas: c, antialias: false });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  var scene  = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
  var geo  = new THREE.SphereGeometry(200, 60, 40);
  geo.scale(-1, 1, 1);
  var mat  = new THREE.MeshBasicMaterial({ color: 0x333333 });
  var mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  var img = new Image();
  img.onload = function() {
    var tex = new THREE.Texture(img);
    tex.needsUpdate = true;
    mat.map   = tex;
    mat.color = new THREE.Color(0xffffff);
    mat.needsUpdate = true;
  };
  img.src = '${dataUri}';
  var lon = 0, lat = 0, px = 0, py = 0, touching = false;
  document.addEventListener('touchstart', function(e) {
    touching = true; px = e.touches[0].clientX; py = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchmove', function(e) {
    if (!touching) return;
    lon -= (e.touches[0].clientX - px) * 0.3;
    lat += (e.touches[0].clientY - py) * 0.15;
    px = e.touches[0].clientX; py = e.touches[0].clientY;
    lat = Math.max(-85, Math.min(85, lat));
  }, { passive: true });
  document.addEventListener('touchend', function() { touching = false; });
  (function animate() {
    requestAnimationFrame(animate);
    var phi   = THREE.MathUtils.degToRad(90 - lat);
    var theta = THREE.MathUtils.degToRad(lon);
    camera.lookAt(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );
    renderer.render(scene, camera);
  })();
})();
</script>
</body>
</html>`;
}

export default function VirtualTourScreen({ route }) {
  var navigation = useNavigation();
  var { user } = useUser();

  var [roomIndex, setRoomIndex] = useState(0);
  var [webviewKey, setWebviewKey] = useState(0);
  var [loading, setLoading] = useState(true);
  var [dataUris, setDataUris] = useState({});
  var [rooms, setRooms] = useState([]);
  var [htmlContent, setHtmlContent] = useState('');

  var [hasAccess, setHasAccess] = useState(false);
  var [checkingAccess, setCheckingAccess] = useState(true);
  var [accessInfo, setAccessInfo] = useState(null);
  var [visitStartTime, setVisitStartTime] = useState(null);
  var [showAccessModal, setShowAccessModal] = useState(false);

  useEffect(function () {
    async function checkAccess() {
      try {
        if (!user || !user.chercheur) {
          Alert.alert(
            'Connexion requise',
            'Vous devez etre connecte pour acceder aux visites 3D.',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
          return;
        }
        setCheckingAccess(true);
        var chercheurId = user.chercheur.id;
        var result = await verifierAccesVisite3D(chercheurId);
        setAccessInfo(result);
        setHasAccess(result.acces);
        if (!result.acces) {
          setShowAccessModal(true);
        } else {
          setVisitStartTime(Date.now());
        }
        setCheckingAccess(false);
      } catch (error) {
        console.error('Erreur verification acces:', error);
        setCheckingAccess(false);
        Alert.alert(
          'Erreur',
          "Impossible de verifier l'acces aux visites 3D.",
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    }
    checkAccess();
  }, [user, navigation]);

  useEffect(function () {
    return function () {
      if (hasAccess && visitStartTime && user && user.chercheur) {
        var property = route && route.params && route.params.property;
        var data = (property && property.original) || property;
        if (data && data.id) {
          var dureeVisite = Math.floor((Date.now() - visitStartTime) / 1000);
          enregistrerVisite3D(user.chercheur.id, data.id, dureeVisite)
            .then(function () { console.log('Visite 3D enregistree'); })
            .catch(function (err) { console.error('Erreur enregistrement visite:', err); });
        }
      }
    };
  }, [hasAccess, visitStartTime, user, route]);

  useEffect(function () {
    if (!hasAccess) return;
    var property = route && route.params && route.params.property;
    var data = (property && property.original) || property;
    if (data && data.images3D && Array.isArray(data.images3D)) {
      var roomDefs = data.images3D.map(function (img, i) {
        return {
          key: img.label || ('Piece ' + (i + 1)),
          label: img.label || ('Piece ' + (i + 1)),
          icon: img.icon || 'home-outline',
          url: img.url,
        };
      });
      setRooms(roomDefs);
    } else {
      setRooms([{ key: 'Salon', label: 'Salon', icon: 'home-outline', url: null }]);
      setLoading(false);
    }
  }, [hasAccess, route]);

  useEffect(function () {
    if (!hasAccess || rooms.length === 0) return;
    var room = rooms[roomIndex];
    if (!room) return;
    if (!room.url) {
      setHtmlContent('');
      setLoading(false);
      return;
    }
    if (dataUris[roomIndex]) {
      setHtmlContent(buildHtml(dataUris[roomIndex]));
      setLoading(false);
      return;
    }
    setLoading(true);
    urlToDataUri(room.url)
      .then(function (uri) {
        setDataUris(function (prev) {
          var next = Object.assign({}, prev);
          next[roomIndex] = uri;
          return next;
        });
        setHtmlContent(buildHtml(uri));
        setLoading(false);
      })
      .catch(function (err) {
        console.error('Erreur chargement panorama:', err);
        setLoading(false);
      });
  }, [hasAccess, rooms, roomIndex]);

  function goToRoom(i) {
    setRoomIndex(i);
    setWebviewKey(function (k) { return k + 1; });
    setLoading(true);
  }

  return (
    <View style={styles.container}>
      <Modal
        visible={showAccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={function () { }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="lock-closed" size={60} color="#FF9500" />
            <Text style={styles.modalTitle}>Paiement requis</Text>
            <Text style={styles.modalMessage}>
              {accessInfo && accessInfo.nombreVisitesEffectuees > 0
                ? 'Vous avez deja effectue ' + accessInfo.nombreVisitesEffectuees + ' visite' + (accessInfo.nombreVisitesEffectuees > 1 ? 's' : '') + ' 3D.\n\n'
                : ''}
              {'Votre premiere visite 3D etait gratuite !\nPayez 200 FCFA pour continuer.'}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={function () {
                  setShowAccessModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.modalButtonSecondaryText}>Retour</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={function () {
                  setShowAccessModal(false);
                  var property = route && route.params && route.params.property;
                  navigation.navigate('VisitPayment', {
                    property: property,
                    nombreVisitesEffectuees: (accessInfo && accessInfo.nombreVisitesEffectuees) || 1,
                  });
                }}
              >
                <Text style={styles.modalButtonPrimaryText}>Payer 200 FCFA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {checkingAccess ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#C48A5A" />
          <Text style={styles.loadingText}>Verification de l'acces...</Text>
        </View>
      ) : hasAccess ? (
        <>
          {htmlContent ? (
            <WebView
              key={webviewKey}
              originWhitelist={['*']}
              source={{ html: htmlContent }}
              style={StyleSheet.absoluteFill}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              mixedContentMode="always"
            />
          ) : (
            <View style={styles.blackBg} />
          )}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#C48A5A" />
              <Text style={styles.loadingText}>Chargement du panorama...</Text>
            </View>
          )}

          {accessInfo && accessInfo.gratuit && (
            <View style={styles.freeVisitBadge}>
              <Ionicons name="gift" size={16} color="#FFF" />
              <Text style={styles.freeVisitText}>Premiere visite gratuite !</Text>
            </View>
          )}

          <View style={styles.header}>
            <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}
              onPress={function () { navigation.goBack(); }}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Visite 360</Text>
              <Text style={styles.headerSubtitle}>
                {rooms[roomIndex] ? rooms[roomIndex].label : 'Panorama'}
              </Text>
            </View>
            <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}
              onPress={function () { navigation.navigate('Parametres'); }}>
              <Ionicons name="settings-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {!loading && (
            <View style={styles.swipeHint} pointerEvents="none">
              <Ionicons name="hand-left-outline" size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.swipeHintText}>Glissez pour explorer</Text>
            </View>
          )}

          <View style={styles.roomsRow}>
            {rooms.map(function (room, i) {
              var active = i === roomIndex;
              return (
                <TouchableOpacity
                  key={room.key}
                  style={[styles.roomPill, active ? styles.roomPillActive : styles.roomPillInactive]}
                  onPress={function () { goToRoom(i); }}
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

          <View style={styles.bottomCard}>
            <View style={styles.readyBox}>
              <Text style={styles.readyTitle}>Pret a reserver ?</Text>
              <Text style={styles.readyDesc}>Visitez, craquez, emmenagez.</Text>
            </View>
            <TouchableOpacity
              style={styles.reserveBtn}
              activeOpacity={0.8}
              onPress={function () {
                navigation.navigate('ReservationScreen',
                  { property: route && route.params ? route.params.property : null });
              }}
            >
              <Text style={styles.reserveBtnText}>Reserver</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
}

var styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  blackBg: { flex: 1, backgroundColor: '#111' },
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
  swipeHintText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginLeft: 7 },
  roomsRow: {
    position: 'absolute', bottom: 110, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'center',
    zIndex: 15, paddingHorizontal: 16,
  },
  roomPill: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginHorizontal: 4, borderWidth: 1.5,
  },
  roomPillActive: { backgroundColor: '#fff', borderColor: '#fff' },
  roomPillInactive: { backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.25)' },
  roomIcon: { marginRight: 5 },
  roomPillText: { fontWeight: '700', fontSize: 12 },
  roomPillTextActive: { color: '#3B2A1B' },
  roomPillTextInactive: { color: '#fff' },
  bottomCard: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(30,18,8,0.9)', borderRadius: 20, padding: 16, zIndex: 20,
  },
  readyBox: { flex: 1 },
  readyTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 3 },
  readyDesc: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  freeVisitBadge: {
    position: 'absolute', top: 110, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#4CAF50', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, zIndex: 15,
  },
  freeVisitText: { color: '#FFF', fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 30,
    alignItems: 'center', width: '100%', maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#3B2A1B',
    marginTop: 20, marginBottom: 15,
  },
  modalMessage: {
    fontSize: 15, color: '#666', textAlign: 'center',
    lineHeight: 22, marginBottom: 25,
  },
  modalButtons: { flexDirection: 'row', width: '100%', gap: 10 },
  modalButtonSecondary: {
    flex: 1, backgroundColor: '#E0E0E0',
    paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  modalButtonSecondaryText: { color: '#3B2A1B', fontSize: 16, fontWeight: '600' },
  modalButtonPrimary: {
    flex: 1, backgroundColor: '#FF9500',
    paddingVertical: 14, borderRadius: 10, alignItems: 'center',
  },
  modalButtonPrimaryText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  reserveBtn: {
    backgroundColor: '#C48A5A', borderRadius: 12,
    paddingVertical: 12, paddingHorizontal: 22, marginLeft: 12,
  },
  reserveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});
