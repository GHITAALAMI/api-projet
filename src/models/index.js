const sequelize = require('../config/database');

// Import des modèles
const Category = require('./category.model');
const Line = require('./line.model');
const Stop = require('./stop.model');
const LineStop = require('./line-stop.model');
const User = require('./user.model');

// Fonction qui initialise la base de données
const initDb = async () => {
  try {
    // Définir les relations après l'import des modèles
    Line.belongsTo(Category, { foreignKey: 'categoryId' });
    Category.hasMany(Line, { foreignKey: 'categoryId' });

    // Relations many-to-many
    Line.belongsToMany(Stop, {
      through: LineStop,
      foreignKey: 'lineId',
      otherKey: 'stopId',
      as: 'stops'
    });

    Stop.belongsToMany(Line, {
      through: LineStop,
      foreignKey: 'stopId',
      otherKey: 'lineId',
      as: 'lines'
    });

    // Désactiver temporairement les contraintes de clé étrangère
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Synchroniser tous les modèles avec la base de données
    await sequelize.sync({ force: true });
    console.log('Base de données synchronisée');

    // Réactiver les contraintes de clé étrangère
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  initDb,
  Category,
  Line,
  Stop,
  LineStop,
  User
}; 