# API Tisséa - Réseau de Transports Publics

Bienvenue sur le projet API Tisséa, un système de gestion pour le réseau de transports publics permettant de manipuler les lignes de bus, métro et tramway ainsi que leurs arrêts.

## Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express** - Framework web pour Node.js
- **MySQL** - Base de données relationnelle
- **Sequelize** - ORM pour simplifier les interactions avec la base de données
- **JWT** - Authentification sécurisée via JSON Web Tokens
- **bcrypt** - Hachage des mots de passe
- **cors** - Gestion du partage des ressources entre origines
- **phpMyAdmin** - Interface d'administration pour MySQL
- **dbdiagram.io** - Outil de modélisation et de visualisation de la base de données

## Base de données

Le schéma de la base de données a été conçu avec dbdiagram.io pour visualiser les relations entre les différentes tables. La base de données est gérée via phpMyAdmin, qui offre une interface graphique pour faciliter la manipulation des données.

Voici la structure de la base de données :
- **Categories** : Types de transport (Bus, Métro, Tramway)
- **Lines** : Lignes de transport associées à une catégorie
- **Stops** : Arrêts avec leurs coordonnées GPS
- **LineStops** : Table de jointure entre lignes et arrêts, incluant l'ordre des arrêts
- **Users** : Utilisateurs de l'application avec niveaux d'accès différenciés

## Structure du projet

```
/
├── src/                   # Code source
│   ├── config/            # Configuration
│   │   ├── database.js    # Configuration de la base de données
│   │   └── seed.js        # Données initiales
│   ├── controllers/       # Logique métier
│   ├── middlewares/       # Middlewares Express
│   ├── models/            # Modèles de données
│   ├── routes/            # Routes de l'API
│   ├── utils/             # Fonctions utilitaires
│   └── server.js          # Point d'entrée
├── .env                   # Variables d'environnement
└── package.json           # Dépendances et scripts
```

## Installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/votre-nom/express-tissea.git
cd express-tissea
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Créez un fichier `.env` à la racine du projet avec les informations suivantes :
```
PORT=3000
DB_HOST=localhost
DB_USER=votre_utilisateur_mysql
DB_PASSWORD=votre_mot_de_passe
DB_NAME=tissea_db
DB_PORT=3306
JWT_SECRET=votre_clé_secrète
JWT_EXPIRES_IN=24h
```

4. **Créer la base de données**
```sql
CREATE DATABASE tissea_db;
```

## Démarrage

Pour le développement (avec rechargement automatique) :
```bash
npm run dev
```

Pour la production :
```bash
npm start
```

L'API sera accessible à l'adresse : http://localhost:3000

## API Endpoints

### Catégories et Lignes

- `GET /api/categories` - Récupérer toutes les catégories
- `GET /api/categories/:id/lines` - Récupérer les lignes d'une catégorie
- `GET /api/categories/:id/lines/:id` - Récupérer les détails d'une ligne
- `GET /api/categories/:id/lines/:id/stops` - Récupérer les arrêts d'une ligne
- `POST /api/categories/:id/lines/:id/stops` - Ajouter un arrêt (admin uniquement)
- `PUT /api/categories/:id/lines/:id` - Modifier une ligne (admin uniquement)
- `DELETE /api/categories/:id/lines/:id/stops/:id` - Supprimer un arrêt (admin uniquement)

### Statistiques

- `GET /api/stats/distance/stops/:id1/:id2` - Calculer la distance entre deux arrêts
- `GET /api/stats/distance/lines/:id` - Calculer la distance totale d'une ligne

### Authentification

- `POST /api/users/signup` - Créer un compte utilisateur
- `POST /api/users/login` - Se connecter

## Authentification

L'API utilise JSON Web Tokens (JWT) pour l'authentification. Pour les routes protégées, incluez ce header dans vos requêtes :
```
Authorization: Bearer votre_token_jwt
```

Pour obtenir un token :
1. Créez un compte via l'endpoint `/api/users/signup`
2. Connectez-vous via l'endpoint `/api/users/login`
3. Récupérez le token JWT dans la réponse

## Rôles utilisateurs

- **Utilisateurs standard** : Peuvent consulter les données et accéder aux statistiques
- **Administrateurs** : Disposent de droits supplémentaires pour créer, modifier et supprimer des données

## Jeu de données initial

Au premier démarrage, la base de données est initialisée avec :
- 3 catégories (Bus, Métro, Tramway)
- 5 arrêts avec leurs coordonnées GPS
- 2 lignes (Ligne A de métro et Ligne 14 de bus)
- 1 compte administrateur : admin@tissea.fr / admin123

## Tester l'API avec Postman

1. Installez [Postman](https://www.postman.com/downloads/)
2. Créez une collection pour organiser vos requêtes
3. Configurez un environnement avec les variables suivantes :
   - `baseUrl` = `http://localhost:3000`
   - `token` = le token JWT obtenu après connexion
   
Pour les requêtes authentifiées, ajoutez le header :
`Authorization: Bearer {{token}}`

## Exemples de requêtes

### Authentification

**Créer un compte utilisateur** :
- POST `{{baseUrl}}/api/users/signup`
- Headers : `Content-Type: application/json`
- Body :
```json
{
  "email": "utilisateur@exemple.fr",
  "password": "mot_de_passe",
  "firstName": "Prénom",
  "lastName": "Nom",
  "isAdmin": false
}
```

**Se connecter** :
- POST `{{baseUrl}}/api/users/login`
- Headers : `Content-Type: application/json`
- Body :
```json
{
  "email": "utilisateur@exemple.fr",
  "password": "mot_de_passe"
}
```

### Utilisation de l'API

**Récupérer les catégories** :
- GET `{{baseUrl}}/api/categories`

**Ajouter un arrêt à une ligne** (administrateur) :
- POST `{{baseUrl}}/api/categories/1/lines/1/stops`
- Headers : 
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}`
- Body :
```json
{
  "stopId": 3,
  "order": 1
}
```

## Résolution des problèmes courants

1. **Problèmes de connexion à la base de données**
   - Vérifiez que votre serveur MySQL est en cours d'exécution
   - Confirmez que les informations de connexion dans le fichier `.env` sont correctes

2. **Problèmes d'authentification**
   - Si le token est expiré, obtenez-en un nouveau via `/api/users/login`
   - Pour les routes admin, assurez-vous d'utiliser un compte avec `isAdmin: true`

3. **Erreurs 404**
   - Vérifiez que les identifiants utilisés dans les URLs existent dans la base de données

Pour activer les logs de débogage supplémentaires, ajoutez au fichier `.env` :
```
DEBUG=true
```

Pour toute question ou suggestion d'amélioration, n'hésitez pas à nous contacter.

## Licence

ISC
