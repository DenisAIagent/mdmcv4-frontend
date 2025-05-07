# MDMC Music Ads - Frontend Admin

Plateforme SaaS de marketing musical permettant aux artistes de créer et gérer des SmartLinks pour leurs musiques.

## 🚀 Technologies

- React 19
- Vite
- Material UI (MUI)
- React Router v6
- React Hook Form + Zod
- i18next pour l'internationalisation
- React Toastify pour les notifications
- Axios pour les requêtes API

## 🛠️ Installation

1. Cloner le repository :
```bash
git clone [URL_DU_REPO]
cd mdmc-frontend
```

2. Installer les dépendances :
```bash
npm install
```

3. Créer un fichier `.env` à la racine du projet avec les variables suivantes :
```env
VITE_API_URL=http://localhost:5001/api
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

## 📁 Structure du Projet

```
src/
├── components/         # Composants réutilisables
├── features/          # Fonctionnalités principales
│   └── admin/        # Interface d'administration
├── pages/            # Pages de l'application
├── services/         # Services (API, etc.)
├── locales/          # Fichiers de traduction
└── assets/           # Ressources statiques
```

## 🌐 Fonctionnalités

- 🔐 Authentification admin
- 👤 Gestion des artistes
- 🔗 Création et gestion de SmartLinks
- 🖼️ Upload d'images
- 🌍 Internationalisation (FR/EN)
- 📊 Tracking analytics
- 📱 Interface responsive

## 🚀 Déploiement

```bash
npm run build
```

## 📝 Licence

Tous droits réservés © MDMC Music Ads
