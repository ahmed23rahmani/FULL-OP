# ORIGINALE PLUS - Backend API

Backend Node.js avec MongoDB Atlas pour l'e-commerce ORIGINALE PLUS - Chaussures & Sacoches Premium.

## 🚀 Fonctionnalités

### Côté Client
- ✅ Consultation des produits avec filtres et recherche
- ✅ Ajout au panier (localStorage)
- ✅ Validation de commande avec formulaire complet
- ✅ Enregistrement des commandes dans MongoDB
- ✅ Suivi de commande par numéro

### Côté Admin
- ✅ Dashboard avec statistiques en temps réel
- ✅ Gestion complète des produits (CRUD)
- ✅ Gestion des commandes et mise à jour des statuts
- ✅ Gestion des catégories
- ✅ Export des données (JSON/CSV)
- ✅ Analytics et rapports

## 🛠️ Technologies

- **Backend**: Node.js, Express.js
- **Base de données**: MongoDB Atlas
- **Validation**: Express-validator
- **Sécurité**: Helmet, CORS, Rate Limiting
- **Performance**: Compression, Morgan

## 📋 Prérequis

- Node.js 18+ 
- MongoDB Atlas (cluster gratuit M0)
- Compte Render/Railway (pour le déploiement)

## 🔧 Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd originale-plus-backend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
```bash
cp env.example .env
```

Éditer le fichier `.env` :
```env
# Configuration du serveur
PORT=5000
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/originale-plus?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# CORS
CORS_ORIGIN=http://localhost:3000,https://your-frontend-domain.vercel.app
```

### 4. Initialiser la base de données
```bash
npm run seed
```

### 5. Démarrer le serveur
```bash
# Développement
npm run dev

# Production
npm start
```

## 📊 Structure de l'API

### Endpoints Principaux

#### Produits
- `GET /api/products` - Liste des produits (avec filtres)
- `GET /api/products/featured` - Produits vedettes
- `GET /api/products/new` - Nouveaux produits
- `GET /api/products/promo` - Produits en promotion
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (Admin)
- `PUT /api/products/:id` - Modifier un produit (Admin)
- `DELETE /api/products/:id` - Supprimer un produit (Admin)

#### Commandes
- `GET /api/orders` - Liste des commandes (Admin)
- `GET /api/orders/stats` - Statistiques des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Créer une commande (Client)
- `PATCH /api/orders/:id/status` - Mettre à jour le statut
- `GET /api/orders/tracking/:orderNumber` - Suivre une commande

#### Catégories
- `GET /api/categories` - Liste des catégories
- `GET /api/categories/with-counts` - Catégories avec nombre de produits
- `POST /api/categories` - Créer une catégorie (Admin)
- `PUT /api/categories/:id` - Modifier une catégorie (Admin)

#### Admin
- `GET /api/admin/dashboard` - Statistiques du dashboard
- `GET /api/admin/analytics` - Analytics avancées
- `GET /api/admin/export/orders` - Exporter les commandes
- `GET /api/admin/export/products` - Exporter les produits

## 🗄️ Modèles de données

### Produit
```javascript
{
  name: String,
  category: String,
  price: Number,
  originalPrice: Number,
  description: String,
  images: [String],
  colors: [String],
  sizes: [String],
  badge: String,
  rating: Number,
  stock: Number,
  isNew: Boolean,
  isPromo: Boolean,
  isActive: Boolean,
  featured: Boolean
}
```

### Commande
```javascript
{
  orderNumber: String,
  customer: {
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    address: String,
    city: String
  },
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    color: String,
    size: String
  }],
  status: String,
  total: Number,
  delivery: String,
  payment: String
}
```

## 🌐 Déploiement

### 1. MongoDB Atlas
1. Créer un cluster gratuit M0
2. Configurer l'accès réseau (0.0.0.0/0)
3. Créer un utilisateur avec mot de passe
4. Récupérer l'URI de connexion

### 2. Render (Backend)
1. Connecter votre repo GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

### 3. Vercel (Frontend)
1. Connecter votre repo GitHub
2. Configurer les variables d'environnement
3. Déployer automatiquement

## 🔒 Sécurité

- **Helmet**: Headers de sécurité
- **CORS**: Configuration stricte des origines
- **Rate Limiting**: Limitation des requêtes
- **Validation**: Validation des données d'entrée
- **Sanitisation**: Nettoyage des données

## 📈 Performance

- **Compression**: Compression gzip
- **Index MongoDB**: Index optimisés
- **Pagination**: Pagination des résultats
- **Caching**: Cache des requêtes fréquentes

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration
```

## 📝 Scripts disponibles

```bash
# Développement
npm run dev

# Production
npm start

# Seeding de la base de données
npm run seed

# Nettoyer la base de données
npm run clean

# Linting
npm run lint

# Tests
npm test
```

## 🔧 Configuration MongoDB Atlas

### 1. Créer un cluster
1. Aller sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Créer un compte gratuit
3. Créer un cluster M0 (gratuit)

### 2. Configurer l'accès
1. **Database Access** → Créer un utilisateur
2. **Network Access** → Ajouter IP 0.0.0.0/0 (toutes les IPs)

### 3. Récupérer l'URI
1. **Clusters** → Connect → Connect your application
2. Copier l'URI de connexion
3. Remplacer `<password>` par le mot de passe de l'utilisateur

## 🚀 Déploiement sur Render

### 1. Préparer le projet
```bash
# Ajouter le script de build
"scripts": {
  "start": "node server.js",
  "build": "npm install"
}
```

### 2. Configurer Render
1. Connecter le repo GitHub
2. **Environment Variables**:
   - `MONGODB_URI`: Votre URI MongoDB Atlas
   - `NODE_ENV`: production
   - `CORS_ORIGIN`: URL de votre frontend Vercel

### 3. Déployer
- Render détecte automatiquement Node.js
- Déploiement automatique à chaque push

## 📱 Intégration Frontend

### Configuration CORS
```javascript
// Dans votre frontend
const API_URL = 'https://your-backend.onrender.com/api';

// Exemple d'appel API
fetch(`${API_URL}/products`)
  .then(response => response.json())
  .then(data => console.log(data));
```

### Variables d'environnement Frontend
```env
# .env.local (Vercel)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
```

## 🐛 Dépannage

### Erreurs courantes

1. **Connexion MongoDB échouée**
   - Vérifier l'URI de connexion
   - Vérifier les permissions utilisateur
   - Vérifier l'accès réseau

2. **CORS errors**
   - Vérifier la configuration CORS_ORIGIN
   - Ajouter l'origine frontend

3. **Rate limiting**
   - Augmenter les limites si nécessaire
   - Vérifier les logs

## 📞 Support

Pour toute question ou problème :
- 📧 Email: support@originaleplus.dz
- 📱 WhatsApp: +213 XXX XXX XXX
- 🌐 Site: https://originaleplus.dz

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**ORIGINALE PLUS** - Chaussures & Sacoches Premium 🛍️
