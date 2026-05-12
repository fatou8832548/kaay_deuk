# API Logements - KaayDeuk

## Base URL
```
http://localhost:3000/api
```

---

## 📋 GET /logements

**Récupérer la liste des logements avec pagination et filtres**

### Request

#### URL
```
GET /logements?disponible=true&page=1&limit=10&sortBy=dateCreation&sortOrder=desc
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | Non | 1 | Numéro de page |
| `limit` | number | Non | 10 | Nombre de logements par page |
| `ville` | string | Non | - | Filtrer par ville (case-insensitive) |
| `prixMin` | number | Non | - | Prix minimum mensuel (FCFA) |
| `prixMax` | number | Non | - | Prix maximum mensuel (FCFA) |
| `disponible` | boolean | Non | - | Filtrer par disponibilité (true/false) |
| `typeLogementId` | number | Non | - | Filtrer par type de logement |
| `sortBy` | string | Non | dateCreation | Champ de tri (dateCreation, prix, superficie, nombrePieces, titre) |
| `sortOrder` | string | Non | desc | Ordre de tri (asc ou desc) |

#### Example Request
```bash
curl -X 'GET' \
  'http://localhost:3000/api/logements?disponible=true&page=1&limit=10&sortBy=dateCreation&sortOrder=desc' \
  -H 'accept: */*'
```

### Response

#### Status Code: 200 OK

#### Response Body Structure
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 10,
        "titre": "Appartement",
        "description": "Description du logement",
        "prix": 200000,
        "adresse": "Adresse complète",
        "ville": "Thiès",
        "superficie": 100,
        "nombrePieces": 3,
        "disponible": true,
        "caution": 200000,
        "images": [
          {
            "url": "/uploads/filename.jpeg",
            "lieu": "Localisation physique (ex: Cuisine, Salon)",
            "titre": "Titre de l'image (ex: Cuisine)",
            "description": "Description de la pièce/zone",
            "ordreAffichage": 0
          }
        ],
        "images3D": [
          {
            "url": "/uploads/filename.jpeg",
            "lieu": "Localisation (ex: salon intérieure)",
            "type": "360",
            "titre": "Titre (ex: Salon)",
            "description": "Description 360",
            "ordreAffichage": 0
          }
        ],
        "equipements": {
          "garagePrivé": false,
          "climatisation": false,
          "sécurité24h7": false,
          "wifiHauteVitesse": false
        },
        "dateCreation": "2026-04-16T16:12:50.960Z",
        "administrateurId": 1,
        "typeLogementId": 1,
        "typeLogement": {
          "id": 1,
          "libelle": "Appartement"
        },
        "administrateur": {
          "id": 1,
          "utilisateurId": 1,
          "rib": "SN-KAAY-001",
          "utilisateur": {
            "id": 1,
            "nom": "Super Admin",
            "telephone": "+221 77 471 91 08",
            "email": "admin@kaaydeuk.com"
          }
        }
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 10
  },
  "timestamp": "2026-04-16T16:30:05.284Z"
}
```

#### Response Fields
| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Indicateur de succès de la requête |
| `data.data` | array | Tableau des logements |
| `data.total` | number | Nombre total de logements (sans pagination) |
| `data.page` | number | Numéro de page actuel |
| `data.limit` | number | Nombre de logements par page |
| `timestamp` | string | Timestamp de la réponse (ISO 8601) |

---

## 📋 GET /logements/:id

**Récupérer un logement spécifique par son ID**

### Request

#### URL
```
GET /logements/10
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Oui | ID du logement |

#### Example Request
```bash
curl -X 'GET' \
  'http://localhost:3000/api/logements/10' \
  -H 'accept: */*'
```

### Response

#### Status Code: 200 OK

#### Response Body
```json
{
  "success": true,
  "data": {
    "id": 10,
    "titre": "Apparemment",
    "description": "Appartement moderne composé de 2 chambres spacieuses...",
    "prix": 200000,
    "adresse": "Nguinte",
    "ville": "Thiès",
    "superficie": 100,
    "nombrePieces": 3,
    "disponible": true,
    "caution": 200000,
    "images": [...],
    "images3D": [...],
    "equipements": {...},
    "dateCreation": "2026-04-16T16:12:50.960Z",
    "administrateurId": 1,
    "typeLogementId": 1,
    "typeLogement": {...},
    "administrateur": {...}
  },
  "timestamp": "2026-04-16T16:30:05.284Z"
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Logement introuvable",
  "statusCode": 404,
  "timestamp": "2026-04-16T16:30:05.284Z"
}
```

---

## 📝 POST /logements

**Créer un nouveau logement** (Authentification requise)

### Request

#### Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### Request Body
```json
{
  "titre": "Appartement moderne Centre-Ville",
  "description": "Bel appartement 3 pièces avec vue sur le jardin",
  "prix": 200000,
  "adresse": "Nguinte",
  "ville": "Thiès",
  "superficie": 100,
  "nombrePieces": 3,
  "disponible": true,
  "caution": 200000,
  "administrateurId": 1,
  "typeLogementId": 1,
  "equipements": {
    "wifiHauteVitesse": false,
    "garagePrivé": false,
    "sécurité24h7": false,
    "climatisation": false
  },
  "images": [
    {
      "url": "/uploads/1776355700403-296132410.jpeg",
      "lieu": "Nguinte",
      "titre": "Cuisine",
      "description": "Cuisine fonctionnelle",
      "ordreAffichage": 0
    }
  ],
  "images3D": [
    {
      "url": "/uploads/1776356698020-768224264.jpeg",
      "lieu": "salon intérieure",
      "type": "360",
      "titre": "Salon",
      "description": "Vue 360 du salon",
      "ordreAffichage": 0
    }
  ]
}
```

#### Required Fields
- `titre` (string)
- `prix` (number)
- `adresse` (string)
- `ville` (string)
- `superficie` (number)
- `nombrePieces` (number)
- `administrateurId` (number)
- `typeLogementId` (number)

#### Optional Fields
- `description` (string)
- `disponible` (boolean, default: true)
- `caution` (number)
- `equipements` (object)
- `images` (array)
- `images3D` (array)

### Response

#### Status Code: 201 Created

#### Response Body
```json
{
  "success": true,
  "data": {
    "id": 10,
    "titre": "Appartement moderne Centre-Ville",
    "description": "Bel appartement 3 pièces avec vue sur le jardin",
    "prix": 200000,
    "adresse": "Nguinte",
    "ville": "Thiès",
    "superficie": 100,
    "nombrePieces": 3,
    "disponible": true,
    "caution": 200000,
    "equipements": {
      "wifiHauteVitesse": false,
      "garagePrivé": false,
      "sécurité24h7": false,
      "climatisation": false
    },
    "images": [...],
    "images3D": [...],
    "dateCreation": "2026-04-16T16:12:50.960Z",
    "administrateurId": 1,
    "typeLogementId": 1,
    "typeLogement": {...},
    "administrateur": {...}
  },
  "timestamp": "2026-04-16T16:30:05.284Z"
}
```

#### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Non autorisé",
  "statusCode": 401,
  "timestamp": "2026-04-16T16:30:05.284Z"
}
```

---

## ✏️ PUT /logements/:id

**Mettre à jour un logement** (Authentification requise)

### Request

#### Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Oui | ID du logement |

#### Request Body
*(Mêmes champs que POST, tous optionnels)*

```json
{
  "titre": "Appartement moderne (Rénové)",
  "prix": 250000,
  "equipements": {
    "wifiHauteVitesse": true,
    "garagePrivé": false,
    "sécurité24h7": true,
    "climatisation": true
  }
}
```

### Response

#### Status Code: 200 OK

#### Response Body
```json
{
  "success": true,
  "data": {
    "id": 10,
    "titre": "Appartement moderne (Rénové)",
    "prix": 250000,
    "equipements": {
      "wifiHauteVitesse": true,
      "garagePrivé": false,
      "sécurité24h7": true,
      "climatisation": true
    },
    ...
  },
  "timestamp": "2026-04-16T16:30:05.284Z"
}
```

---

## 🗑️ DELETE /logements/:id

**Supprimer un logement** (Authentification requise)

### Request

#### Headers
```
Authorization: Bearer {JWT_TOKEN}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Oui | ID du logement |

#### Example Request
```bash
curl -X 'DELETE' \
  'http://localhost:3000/api/logements/10' \
  -H 'Authorization: Bearer {JWT_TOKEN}'
```

### Response

#### Status Code: 200 OK

#### Response Body
```json
{
  "success": true,
  "message": "Logement supprimé avec succès",
  "data": {
    "id": 10
  },
  "timestamp": "2026-04-16T16:30:05.284Z"
}
```

#### Error Response (404 Not Found)
```json
{
  "success": false,
  "message": "Logement introuvable",
  "statusCode": 404,
  "timestamp": "2026-04-16T16:30:05.284Z"
}
```

---

## 📦 Data Structures

### Image Object
```typescript
{
  url: string;              // URL de l'image (/uploads/...)
  titre: string;            // Titre de l'image (ex: "Cuisine", "Salon")
  lieu: string;             // Localisation physique (ex: "Cuisine fonctionnelle")
  description?: string;     // Description optionnelle
  ordreAffichage: number;   // Ordre d'affichage (0, 1, 2, ...)
}
```

### Image3D Object
```typescript
{
  url: string;              // URL de la visite 3D (/uploads/...)
  titre: string;            // Titre (ex: "Salon")
  lieu: string;             // Localisation (ex: "salon intérieure")
  type: string;             // Type: "360", "panorama", "matterport"
  description?: string;     // Description optionnelle
  ordreAffichage: number;   // Ordre d'affichage
}
```

### Equipement Object
```typescript
{
  wifiHauteVitesse?: boolean;   // WiFi Haute Vitesse disponible
  garagePrivé?: boolean;        // Garage Privé disponible
  sécurité24h7?: boolean;       // Sécurité 24/7 disponible
  climatisation?: boolean;      // Climatisation disponible
}
```

### TypeLogement Object
```typescript
{
  id: number;        // ID du type (1=Appartement, 2=Maison, 3=Villa, 4=Studio, 5=Duplex, etc.)
  libelle: string;   // Libellé (ex: "Appartement", "Villa")
}
```

### Administrateur Object
```typescript
{
  id: number;          // ID administrateur
  utilisateurId: number;
  rib: string;         // RIB bancaire
  utilisateur: {       // Utilisateur associé
    id: number;
    nom: string;
    telephone: string;
    email: string;
  }
}
```

---

## 🔒 Authentication

Pour les endpoints protégés (POST, PUT, DELETE), pass un JWT token dans le header `Authorization` :

```bash
curl -X 'POST' \
  'http://localhost:3000/api/logements' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json' \
  -d '{...body...}'
```

**Obtenir un token :**

```bash
curl -X 'POST' \
  'http://localhost:3000/api/auth/admin/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@kaaydeuk.com",
    "motDePasse": "Admin@KaayDeuk2025!"
  }'
```

Réponse :
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

---

## 📊 Exemples Complets

### Créer un logement avec images
```bash
curl -X 'POST' \
  'http://localhost:3000/api/logements' \
  -H 'Authorization: Bearer ...' \
  -H 'Content-Type: application/json' \
  -d '{
    "titre": "Villa F4 Thiès",
    "description": "Une villa raffinée...",
    "prix": 300000,
    "adresse": "nginth",
    "ville": "Thiès",
    "superficie": 100,
    "nombrePieces": 5,
    "disponible": true,
    "caution": 100000,
    "administrateurId": 1,
    "typeLogementId": 4,
    "equipements": {
      "wifiHauteVitesse": true,
      "garagePrivé": true,
      "sécurité24h7": true,
      "climatisation": true
    },
    "images": [
      {
        "url": "/uploads/villa-front.png",
        "titre": "Façade",
        "lieu": "Entrée principale",
        "ordreAffichage": 0
      }
    ],
    "images3D": [
      {
        "url": "/uploads/villa-360.jpeg",
        "titre": "Salon",
        "lieu": "Salon principal",
        "type": "360",
        "ordreAffichage": 0
      }
    ]
  }'
```

### Filtrer les logements disponibles à Thiès
```bash
curl -X 'GET' \
  'http://localhost:3000/api/logements?ville=Thiès&disponible=true&page=1&limit=10&sortBy=prix&sortOrder=asc'
```

### Mettre à jour les équipements
```bash
curl -X 'PUT' \
  'http://localhost:3000/api/logements/10' \
  -H 'Authorization: Bearer ...' \
  -H 'Content-Type: application/json' \
  -d '{
    "equipements": {
      "wifiHauteVitesse": true,
      "garagePrivé": false,
      "sécurité24h7": false,
      "climatisation": true
    }
  }'
```

---

## ⚠️ Limites

- **Payload max** : 50 MB (pour les images 3D volumineuses)
- **Taille d'image** : 12.5 MB (testé avec succès)
- **Images par logement** : Illimited (stock en JSON)
- **Filtrage** : Case-insensitive pour la ville, exact pour les booléens

---

## 📅 Notes

- Les images sont stockées dans `/uploads/` avec un timestamp
- Les images3D stockent les URL complètes (peuvent être absolues ou relatives)
- Les équipements sont au niveau du logement, pas des images
- La pagination est 1-based (page 1 = premier résultat)
- Les timestamps sont en ISO 8601 UTC
