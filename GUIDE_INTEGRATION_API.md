# Guide d'Intégration API - Application Mobile Kaay Dëk

## 📋 Vue d'ensemble

Ce guide explique l'intégration complète entre l'API backend (NestJS) et l'application mobile React Native, avec le système de visite 3D gratuite pour la première fois.

## 🎯 Fonctionnalités implémentées

### 1. **Système de Visite 3D**
- ✅ Première visite 3D gratuite pour chaque utilisateur
- ✅ Visites suivantes nécessitent un abonnement
- ✅ Enregistrement automatique des visites avec durée
- ✅ Vérification d'accès avant chaque visite
- ✅ Modal d'abonnement si accès refusé

### 2. **Connexion API**
- ✅ Service d'authentification (login, register, logout)
- ✅ Service de gestion des logements
- ✅ Service de gestion des visites 3D
- ✅ Stockage sécurisé du token JWT

### 3. **Écrans ajoutés**
- ✅ Écran d'abonnement avec 3 plans (mensuel, trimestriel, annuel)
- ✅ VirtualTourScreen mis à jour avec vérification d'accès
- ✅ Modal de redirection vers abonnement

---

## 🚀 Installation et Configuration

### Étape 1: Installer les dépendances manquantes

Dans le dossier `kaay_deuk`, exécutez:

\`\`\`bash
npm install @react-native-async-storage/async-storage
\`\`\`

### Étape 2: Configuration Backend

#### a) Vérifier que le serveur backend est démarré

\`\`\`bash
cd kaay-deuk-backend/backend
npm run start:dev
\`\`\`

Le serveur devrait démarrer sur `http://localhost:3000`

#### b) Vérifier la configuration API dans l'app mobile

Fichier: `kaay_deuk/src/config/apiConfig.js`
\`\`\`javascript
const API_BASE_URL = 'https://gurgle-acronym-rarity.ngrok-free.dev';
// OU si en local: 'http://localhost:3000'
\`\`\`

💡 **Important**: Si vous utilisez un émulateur/appareil physique, vous aurez besoin de:
- **ngrok** pour exposer votre API locale (déjà configuré dans votre cas)
- OU configurer l'IP de votre machine (ex: `http://192.168.1.x:3000`)

### Étape 3: Créer les tables manquantes (si nécessaire)

Le modèle `Visite3D` existe déjà dans le schéma Prisma. Si vous n'avez pas encore migré:

\`\`\`bash
cd kaay-deuk-backend/backend
npx prisma migrate dev --name add_visites_3d
\`\`\`

---

## 📁 Fichiers créés/modifiés

### Backend (NestJS)

#### Nouveaux fichiers:
1. `backend/src/visites3d/visites3d.module.ts` - Module Visites 3D
2. `backend/src/visites3d/visites3d.service.ts` - Service de gestion des visites
3. `backend/src/visites3d/visites3d.controller.ts` - Contrôleur API
4. `backend/src/visites3d/dto/enregistrer-visite3d.dto.ts` - DTO validation

#### Fichiers modifiés:
1. `backend/src/app.module.ts` - Ajout du module Visites3D

### Frontend (React Native)

#### Nouveaux fichiers:
1. `src/services/visite3DService.js` - Service API visites 3D
2. `src/services/authService.js` - Service d'authentification
3. `src/screens/SubscriptionScreen.js` - Écran d'abonnement

#### Fichiers modifiés:
1. `src/screens/VirtualTourScreen.js` - Ajout vérification accès
2. `src/navigation/MainTabNavigator.js` - Ajout route Subscription
3. `App.js` - Connexion services d'authentification

---

## 🔑 Endpoints API Backend

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur

### Logements
- `GET /api/logements` - Liste des logements (avec filtres)
- `GET /api/logements/:id` - Détails d'un logement

### Visites 3D (🔒 Authentification requise)
- `GET /api/visites-3d/verifier-acces/:chercheurId` - Vérifier accès visite 3D
- `POST /api/visites-3d/enregistrer` - Enregistrer une visite 3D
- `GET /api/visites-3d/historique/:chercheurId` - Historique des visites

---

## 🔐 Flux d'Authentification

### 1. Inscription
\`\`\`javascript
import { register } from './src/services/authService';

const userData = {
  nom: "John Doe",
  email: "john@example.com",
  telephone: "+221771234567",
  motDePasse: "password123",
  typeUtilisateur: "CHERCHEUR"
};

const result = await register(userData);
\`\`\`

### 2. Connexion
\`\`\`javascript
import { login } from './src/services/authService';

const result = await login("john@example.com", "password123");
// Token JWT stocké automatiquement dans AsyncStorage
// Données utilisateur retournées dans result.utilisateur
\`\`\`

### 3. Déconnexion
\`\`\`javascript
import { logout } from './src/services/authService';

await logout();
// Token et données utilisateur supprimés d'AsyncStorage
\`\`\`

---

## 🎬 Flux de Visite 3D

### Scénario 1: Première visite (GRATUITE)

1. Utilisateur clique sur "Visite 3D" dans PropertyDetailScreen
2. VirtualTourScreen vérifie l'accès via API
3. API retourne: `{ acces: true, gratuit: true, nombreVisitesEffectuees: 0 }`
4. Badge "Première visite gratuite !" affiché
5. Utilisateur explore la visite 3D
6. Au retour, la visite est enregistrée en base de données

### Scénario 2: Deuxième visite (ABONNEMENT REQUIS)

1. Utilisateur clique sur "Visite 3D"
2. VirtualTourScreen vérifie l'accès via API
3. API retourne: `{ acces: false, gratuit: false, nombreVisitesEffectuees: 1 }`
4. Modal d'abonnement s'affiche
5. Options:
   - **Retour**: Navigation vers l'écran précédent
   - **S'abonner**: Navigation vers SubscriptionScreen

### Scénario 3: Utilisateur abonné

1. Utilisateur avec `locataire` (contrat actif) = abonné
2. API retourne: `{ acces: true, gratuit: false, nombreVisitesEffectuees: X }`
3. Accès illimité aux visites 3D

---

## 📊 Modèle de Données

### Visite3D (Prisma Schema)
\`\`\`prisma
model Visite3D {
  id          Int      @id @default(autoincrement())
  dureeVisite Int      @default(0)  // en secondes
  dateVisite  DateTime @default(now())
  chercheurId Int
  logementId  Int
  
  chercheur Chercheur @relation(...)
  logement  Logement  @relation(...)
}
\`\`\`

### Utilisateur
\`\`\`javascript
{
  id: 1,
  nom: "John Doe",
  email: "john@example.com",
  telephone: "+221771234567",
  typeUtilisateur: "CHERCHEUR",
  chercheur: {
    id: 1,
    locataire: null // ou { id, dateDebutContrat, caution }
  }
}
\`\`\`

---

## 🧪 Test de l'Intégration

### 1. Tester l'authentification

\`\`\`bash
# Depuis le terminal ou Postman
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "motDePasse": "password123"
  }'
\`\`\`

### 2. Tester la vérification d'accès visite 3D

\`\`\`bash
curl -X GET http://localhost:3000/api/visites-3d/verifier-acces/1 \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
\`\`\`

### 3. Enregistrer une visite 3D

\`\`\`bash
curl -X POST http://localhost:3000/api/visites-3d/enregistrer \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "chercheurId": 1,
    "logementId": 1,
    "dureeVisite": 120
  }'
\`\`\`

---

## ⚙️ Configuration des Plans d'Abonnement

Les plans sont actuellement codés en dur dans `SubscriptionScreen.js`. Pour les rendre dynamiques:

1. Créer une table `Plans` dans Prisma
2. Créer un endpoint API `GET /api/plans`
3. Modifier SubscriptionScreen pour charger les plans depuis l'API

### Plans actuels:
- **Mensuel**: 5 000 FCFA/mois
- **Trimestriel**: 12 000 FCFA/3 mois (économie 20%)
- **Annuel**: 40 000 FCFA/an (économie 33%)

---

## 🔄 Synchronisation Utilisateur

Le contexte `UserContext` stocke les informations de l'utilisateur connecté:

\`\`\`javascript
import { useUser } from './src/context/UserContext';

function MyComponent() {
  const { user, setUser } = useUser();
  
  // user contient:
  // - id, nom, email, telephone
  // - chercheur: { id, locataire, ... }
  // - typeUtilisateur
}
\`\`\`

---

## 🐛 Debugging

### Vérifier le token JWT stocké
\`\`\`javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

const token = await AsyncStorage.getItem('authToken');
console.log('Token:', token);
\`\`\`

### Vérifier l'utilisateur stocké
\`\`\`javascript
const userStr = await AsyncStorage.getItem('user');
const user = JSON.parse(userStr);
console.log('User:', user);
\`\`\`

### Logs backend
Tous les logs sont dans la console du serveur NestJS

---

## 📝 TODO / Améliorations futures

- [ ] Créer une table `Abonnements` pour gérer les abonnements
- [ ] Intégrer Orange Money / Wave pour les paiements réels
- [ ] Ajouter une page de gestion d'abonnement dans le profil
- [ ] Notification push quand l'abonnement expire
- [ ] Historique des visites 3D dans le profil utilisateur
- [ ] Statistiques des visites pour les administrateurs

---

## 📞 Support

Pour toute question ou problème:
1. Vérifier les logs backend et mobile
2. Tester les endpoints avec Postman
3. Vérifier la connexion réseau (ngrok actif?)
4. S'assurer que toutes les dépendances sont installées

---

## ✅ Checklist de Déploiement

- [ ] AsyncStorage installé
- [ ] Backend démarré et accessible
- [ ] Migrations Prisma exécutées
- [ ] API_BASE_URL configurée correctement
- [ ] Module Visites3D importé dans app.module.ts
- [ ] Navigation configurée avec Subscription screen
- [ ] Tester le flux complet: inscription → login → visite 3D → abonnement

---

**Dernière mise à jour**: 9 Mai 2026
**Version**: 1.0.0
