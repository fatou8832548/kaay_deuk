const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Plugin Expo pour ajouter les queries nécessaires au AndroidManifest.xml
 * Requis pour Android 11+ afin de pouvoir détecter et ouvrir Wave, Orange Money, etc.
 */
const withAndroidQueries = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    // Ajouter la section <queries> si elle n'existe pas
    if (!androidManifest.queries) {
      androidManifest.queries = [];
    }

    // Ajouter les packages et schemes qu'on veut pouvoir ouvrir
    const queries = androidManifest.queries[0] || {};

    if (!queries.package) {
      queries.package = [];
    }

    if (!queries.intent) {
      queries.intent = [];
    }

    // Packages Wave
    const wavePackages = [
      'com.wave.money',
      'com.wave.personal',
      'sn.wave'
    ];

    wavePackages.forEach(pkg => {
      if (!queries.package.some(p => p.$?.name === pkg)) {
        queries.package.push({
          $: { name: pkg }
        });
      }
    });

    // Packages Orange Money
    const omPackages = [
      'com.orange.orangemoney.senegal',
      'com.orange.money'
    ];

    omPackages.forEach(pkg => {
      if (!queries.package.some(p => p.$?.name === pkg)) {
        queries.package.push({
          $: { name: pkg }
        });
      }
    });

    // Intent pour les schemes (deep links)
    const schemes = ['wavemobile', 'wave', 'orangemoney', 'maxit'];

    schemes.forEach(scheme => {
      if (!queries.intent.some(i => i.data?.[0]?.$?.scheme === scheme)) {
        queries.intent.push({
          action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
          data: [{ $: { 'android:scheme': scheme } }]
        });
      }
    });

    androidManifest.queries[0] = queries;

    return config;
  });
};

module.exports = ({ config }) => {
  // Charger la config de base depuis app.json
  const appConfig = {
    ...config,
    plugins: [
      ...(config.plugins || []),
      withAndroidQueries
    ]
  };

  return appConfig;
};
