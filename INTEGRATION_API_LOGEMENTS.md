# 📋 Guide d'Intégration - Service API Logements

## Vue d'ensemble
Ce guide explique comment le service API pour les logements a été intégré dans l'application KaayDeuk.

---

## 🗂️ Structure créée

### Service API (`src/services/logementService.js`)
Le service centralisé pour tous les appels API logements avec 6 fonctions principales:

```javascript
// Récupère la liste paginée des logements avec filtres
getLogements(options)

// Récupère un logement spécifique
getLogementById(id)

// Récupère les logements recommandés (récents et disponibles)
getLogementsRecommandes(limit)

// Recherche par ville
searchLogementsByVille(ville, limit)

// Filtrage par gamme de prix
filterLogementsByPrice(prixMin, prixMax, limit)

// Filtrage par type de logement
filterLogementsByType(typeLogementId, limit)
```

---

## 🏠 Écrans intégrés

### 1. **HomeScreen.js** - Les Recommandés
**Fonctionnalités:**
- ✅ Charge automatiquement les logements recommandés au démarrage
- ✅ Affiche indicateur de chargement
- ✅ Gère les erreurs avec bouton "Réessayer"
- ✅ Utilise données mockées en fallback si API indisponible
- ✅ Transformation automatique données API → format UI

**États gérés:**
- `logementsData` - Logements transformés pour l'affichage
- `loading` - Indicateur de chargement
- `error` - Messages d'erreur

**Données transformées de l'API:**
```javascript
{
  id: "1",           // Converti en string
  title: logement.titre,
  location: `${adresse} (${ville})`,
  price: "250000 FCFA/mois", // Formaté avec séparateurs
  image: logement.images[0].url,
  original: logement // Données complètes conservées
}
```

### 2. **ListingsScreen.js** - Annonces Complètes
**Fonctionnalités:**
- ✅ Affiche la liste complète des logements disponibles
- ✅ Filtres avancés:
  - Recherche par ville
  - Filtre prix minimum et maximum
- ✅ Affichage détails logement (pièces, surface)
- ✅ Favoris intégrés
- ✅ États: vide, chargement, erreur

**Barre de filtres:**
```
[Rechercher une ville...]   
[Prix min] [Prix max]
[Appliquer les filtres]
```

**Affichage par carte:**
```
┌─── Image ───┐
│ Titre       │
│ 📍 Localité │
│ Pièces: 3   │ Surface: 85 m²
│ Prix | Voir │
└─────────────┘
```

---

## 🔌 Utilisation du Service

### Importer le service
```javascript
import { getLogements, getLogementById, getLogementsRecommandes } from '../services/logementService';
```

### Exemple 1: Récupérer logements recommandés
```javascript
useEffect(() => {
  const fetch = async () => {
    const response = await getLogementsRecommandes(10);
    setLogements(response.data);
  };
  fetch();
}, []);
```

### Exemple 2: Recherche avec filtres
```javascript
const response = await getLogements({
  page: 1,
  limit: 20,
  ville: 'Thiès',
  prixMin: 100000,
  prixMax: 500000,
  disponible: true,
  sortBy: 'prix',
  sortOrder: 'asc'
});
```

### Exemple 3: Récupérer détail logement
```javascript
const logement = await getLogementById(1);
console.log(logement.titre); // "Appartement moderne..."
```

---

## 📊 Format des données API

### Logement complet
```json
{
  "id": 1,
  "titre": "Appartement moderne Centre-Ville",
  "description": "Bel appartement 3 pièces...",
  "prix": 250000,
  "adresse": "Avenue Léopold Sédar Senghor",
  "ville": "Thiès",
  "superficie": 85,
  "nombrePieces": 3,
  "disponible": true,
  "caution": 500000,
  "images": [
    {
      "url": "https://...",
      "titre": "Salon",
      "lieu": "Séjour principal",
      "ordreAffichage": 0,
      "equipements": { /* détails */ }
    }
  ],
  "images3D": [ /* visite 360° */ ],
  "typeLogement": { "id": 3, "libelle": "Villa" },
  "administrateur": { /* infos propriétaire */ }
}
```

---

## ⚙️ Configuration API

**Base URL:** `http://localhost:3000/api`

Modifiable dans `src/services/logementService.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

---

## 🛠️ Gestion des erreurs

Tous les appels API incluent:
- ✅ Try/catch pour captures exceptions
- ✅ Vérification `response.ok`
- ✅ Messages d'erreur détaillés
- ✅ Logs console pour debug

Exemple:
```javascript
try {
  const response = await getLogements(options);
} catch (error) {
  console.error('Erreur getLogements:', error);
  // Fallback ou message utilisateur
}
```

---

## 🔗 Interconnexions

```
┌─────────────────────┐
│   logementService   │
│  (Service API)      │
└──────────┬──────────┘
           │
    ┌──────┴──────────┐
    ▼                 ▼
┌─────────┐    ┌──────────────┐
│HomeScreen│    │ListingsScreen│
└─────────┘    └──────────────┘
    │                 │
    └────────┬────────┘
             ▼
┌──────────────────────────────────┐
│PropertyDetailScreen              │
│(Navigation quand logement cliqué)│
└──────────────────────────────────┘
```

---

## 📝 Données en base

Les logements doivent être créés avec au minimum:
- `titre` - Nom du logement
- `prix` - Prix mensuel (FCFA)
- `ville` - Localité
- `adresse` - Adresse complète
- `disponible` - Boolean
- `images` - Au moins une image

---

## ✅ Tests recommandés

1. **HomeScreen**
   - Vérifier chargement au démarrage ✓
   - Tester "Réessayer" si API down ✓
   - Vérifier pas de requête si données mockées ✓

2. **ListingsScreen**
   - Tester recherche par ville ✓
   - Filtrer par prix min/max ✓
   - Appliquer filtres ✓
   - Naviguer vers détail ✓

3. **Service API**
   - Vérifier URLs construction ✓
   - Tester gestion erreurs ✓
   - Vérifier transformation données ✓

---

## 🚀 Prochaines étapes

- [ ] Ajouter cache des logements
- [ ] Implémenter pagination infinie
- [ ] Ajouter tri personalisé
- [ ] Intégrer réservation complète
- [ ] Ajouter notifications
