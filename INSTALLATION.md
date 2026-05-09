# Script d'Installation - Kaay Dëk

Ce script installe toutes les dépendances nécessaires pour l'application mobile.

## Installation

### 1. Dépendances principales

# Installation d'AsyncStorage pour le stockage local
npm install @react-native-async-storage/async-storage

### 2. Vérification des dépendances

Vérifiez que toutes les dépendances sont installées:

\`\`\`bash
npm install
\`\`\`

### 3. Démarrer l'application

\`\`\`bash
npm start
\`\`\`

## Notes

- AsyncStorage est utilisé pour stocker le token JWT et les informations utilisateur
- Assurez-vous que le backend est démarré avant de lancer l'application
- Vérifiez que l'URL de l'API dans \`src/config/apiConfig.js\` est correcte
