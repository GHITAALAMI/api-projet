# API Tisséa - Réseau de Transports Publics

API REST pour le réseau de transports publics Tisséa permettant de gérer les lignes de bus, métro et tramway ainsi que leurs arrêts.

## Technologies utilisées

- Node.js
- Express.js
- MySQL (via Sequelize ORM)
- JWT pour l'authentification

## Installation

1. Cloner le repository
```bash
git clone https://github.com/votre-nom/express-tissea.git
cd express-tissea
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
   - Créer un fichier `.env` à la racine du projet en vous basant sur l'exemple suivant:
```
PORT=3000
DB_HOST=localhost
DB_USER=votre_utilisateur_mysql
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=tissea_db
DB_PORT=3306
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=24h
```

4. Créer la base de données MySQL
```bash
mysql -u root -p
```
```sql
CREATE DATABASE tissea_db;
EXIT;
```

5. Démarrer le serveur
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

Le serveur sera accessible à l'adresse http://localhost:3000

## Endpoints de l'API

### Catégories de Transport

- `GET /api/categories/:id/lines` - Obtenir toutes les lignes d'une catégorie
- `GET /api/categories/:id/lines/:id` - Obtenir les détails d'une ligne
- `GET /api/categories/:id/lines/:id/stops` - Obtenir les arrêts d'une ligne
- `POST /api/categories/:id/lines/:id/stops` - Ajouter un arrêt à une ligne
- `PUT /api/categories/:id/lines/:id` - Modifier une ligne
- `DELETE /api/categories/:id/lines/:id/stops/:id` - Supprimer un arrêt d'une ligne

### Statistiques

- `GET /api/stats/distance/stops/:id/:id` - Calculer la distance entre deux arrêts
- `GET /api/stats/distance/lines/:id` - Calculer la distance totale d'une ligne

### Authentification

- `POST /api/users/signup` - Inscription d'un utilisateur
- `POST /api/users/login` - Connexion d'un utilisateur

## Documentation

La documentation détaillée de l'API est disponible dans le dossier `/docs`:
- [Schéma de la base de données](docs/database-schema.md)

## Authentification

L'API utilise JSON Web Tokens (JWT) pour l'authentification. Pour accéder aux endpoints protégés, vous devez inclure un token JWT valide dans l'en-tête `Authorization` de vos requêtes:

```
Authorization: Bearer votre_token_jwt
```

## Licence

ISC
