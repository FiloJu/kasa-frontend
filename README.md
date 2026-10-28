# Kasa - Plateforme de location d'hébergements

Application Next.js pour la location d'hébergements entre particuliers en France.

## Description du projet

Kasa est une plateforme complète de location de propriétés qui permet aux utilisateurs de :
- Consulter une liste de logements disponibles avec leurs détails complets
- Rechercher et filtrer les propriétés selon leurs besoins
- Gérer leurs favoris pour sauvegarder les logements qui les intéressent
- S'authentifier et créer un compte utilisateur
- Communiquer avec les hôtes via un système de messagerie
- Accéder aux détails complets des propriétés avec photos, équipements et avis

Le projet est construit avec **Next.js 16** en utilisant Turbopack et supporte le déploiement sur **Vercel** avec des données mock en fallback.

## Pré-requis pour l'installation

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- **Node.js** (version 18.17 ou supérieure) - [Télécharger](https://nodejs.org/)
- **npm** ou **yarn** ou **pnpm** (gestionnaire de paquets)
- **Git** pour cloner le repository

Vérifiez les versions installées :
```bash
node --version
npm --version
```

## Installation

1. **Cloner le repository**
```bash
git clone https://github.com/FiloJu/kasa-frontend.git
cd kasa-front-end
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine du projet :
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Pour le développement local, assurez-vous que le backend est en cours d'exécution sur le port 3001.

## Lancement du projet

### Mode développement
Lancez le serveur de développement :
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir l'application.

L'application se met à jour automatiquement quand vous modifiez les fichiers.

### Mode production
Construisez l'application pour la production :
```bash
npm run build
npm run start
```

## Fonctionnalités principales

- ✅ Liste des propriétés avec détails complets
- ✅ Système d'authentification utilisateur
- ✅ Gestion des favoris
- ✅ Système de messagerie entre utilisateurs
- ✅ Avis et notation des propriétés
- ✅ Responsive design (mobile, tablette, desktop)
- ✅ Déploiement sur Vercel avec données mock en fallback

## Structure du projet

```
kasa-front-end/
├── app/                      # Routes et pages Next.js
├── components/               # Composants React réutilisables
├── context/                  # Context API (Auth, Favorites, Messaging)
├── lib/                      # Fonctions utilitaires et appels API
├── public/                   # Ressources statiques (images, icônes)
├── data/                     # Données mock pour le développement
├── types/                    # Types TypeScript
└── styles/                   # Styles Tailwind CSS
```

## Backend

Pour que l'application fonctionne complètement en local, vous devez aussi lancer le backend :

- Repository : [P8-kasa-backend](https://github.com/FiloJu/P8-kasa-backend)
- Port : 3001
- Commande : `npm run start`

## Déploiement

L'application est déployée sur **Vercel** et se met à jour automatiquement à chaque push sur la branche `main`.

### URL de production
- Frontend : https://kasa-three-xi.vercel.app
- Backend : https://kasa-backend-mauve.vercel.app

Configurez `NEXT_PUBLIC_SITE_URL` dans l’environnement de déploiement avec l’URL publique du frontend. Cette valeur est utilisée pour les URL canoniques, les données structurées Schema.org et le sitemap. À défaut, l’application utilise l’URL de production ci-dessus.

**Note** : En production sur Vercel, l'application utilise des données mock (mock-properties.json et mock-auth-users.json) pour les propriétés et l'authentification. Les favoris sont persistés en localStorage.

## Authentification

### En développement local
- Email et password depuis le backend API réel

### En production (Vercel)
Utilisez les identifiants de test :
- Email: `test@example.com` | Password: `test123`
- Email: `tom@tom.com` | Password: `tom123`

## Technologies utilisées

- **Next.js 16** avec Turbopack
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **React Context** pour la gestion d'état
- **Vitest** pour les tests
- **Vercel** pour le déploiement

## Documentation

Pour en savoir plus sur les technologies utilisées :
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## Licence

Ce projet est fourni à titre d'exemple éducatif.
