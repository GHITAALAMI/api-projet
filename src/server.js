require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize, initDb, Category, Line, Stop, User } = require('./models');

// Importer les routes
const categoriesRoutes = require('./routes/categories.routes');
const usersRoutes = require('./routes/users.routes');
const statsRoutes = require('./routes/stats.routes');

// Initialiser l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Tisséa' });
});

// Utiliser les routes
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stats', statsRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

// Fonction pour initialiser les données de test
async function seedDatabase() {
  try {
    // Créer les catégories
    const categories = await Category.bulkCreate([
      { name: 'Bus' },
      { name: 'Métro' },
      { name: 'Tramway' }
    ]);

    // Créer les arrêts
    const stops = await Stop.bulkCreate([
      { name: 'Gare Saint-Cyprien', latitude: 43.5833, longitude: 1.4333 },
      { name: 'Place du Capitole', latitude: 43.6045, longitude: 1.4442 },
      { name: 'Saint-Michel', latitude: 43.5983, longitude: 1.4417 },
      { name: 'Compans-Caffarelli', latitude: 43.6117, longitude: 1.4417 },
      { name: 'Palais de Justice', latitude: 43.6000, longitude: 1.4333 }
    ]);

    // Créer les lignes
    const lines = await Line.bulkCreate([
      {
        name: 'Ligne A',
        number: 'A',
        color: '#FF0000',
        categoryId: categories[1].id, // Métro
        startTime: '05:30:00',
        endTime: '23:30:00'
      },
      {
        name: 'Ligne 14',
        number: '14',
        color: '#0000FF',
        categoryId: categories[0].id, // Bus
        startTime: '06:00:00',
        endTime: '22:00:00'
      }
    ]);

    // Créer un utilisateur admin
    await User.create({
      email: 'admin@tissea.fr',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'Tissea',
      isAdmin: true
    });

    console.log('Données de test insérées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données de test:', error);
    throw error;
  }
}

// Port
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
async function startServer() {
  try {
    // Tester la connexion à la base de données
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie');
    
    // Initialiser la base de données
    await initDb();
    console.log('Base de données initialisée');

    // Insérer les données de test
    await seedDatabase();
    console.log('Données de test insérées');

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Démarrer le serveur
startServer();