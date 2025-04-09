const { Category, Line, Stop, LineStop, sequelize, Op } = require('../models');

/**
 * Obtenir toutes les catégories
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des catégories", error: error.message });
  }
};

/**
 * Obtenir toutes les lignes d'une catégorie
 */
exports.getLinesByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const lines = await Line.findAll({
      where: { categoryId: id },
      include: [{
        model: Category
      }]
    });
    res.json(lines);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des lignes", error: error.message });
  }
};

/**
 * Obtenir les détails d'une ligne
 */
exports.getLineDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const line = await Line.findOne({
      where: { id },
      include: [
        {
          model: Category
        },
        {
          model: Stop,
          through: {
            attributes: ['stopOrder'],
            order: [['stopOrder', 'ASC']]
          }
        }
      ]
    });

    if (!line) {
      return res.status(404).json({ message: "Ligne non trouvée" });
    }

    res.json(line);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des détails de la ligne", error: error.message });
  }
};

/**
 * Obtenir les arrêts d'une ligne
 */
exports.getLineStops = async (req, res) => {
  try {
    const { id } = req.params;
    const stops = await Stop.findAll({
      include: [{
        model: Line,
        as: 'lines',
        where: { id },
        through: {
          attributes: ['stopOrder'],
          order: [['stopOrder', 'ASC']]
        }
      }]
    });

    if (!stops.length) {
      return res.status(404).json({ message: "Aucun arrêt trouvé pour cette ligne" });
    }

    res.json(stops);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des arrêts", error: error.message });
  }
};

/**
 * Ajouter un arrêt à une ligne
 */
exports.addStopToLine = async (req, res) => {
  try {
    const { id: lineId } = req.params;
    const { stopId, order } = req.body;

    // Vérifier si l'arrêt existe déjà sur la ligne
    const existingStop = await LineStop.findOne({
      where: {
        lineId,
        stopId
      }
    });

    if (existingStop) {
      return res.status(400).json({ message: "Cet arrêt existe déjà sur la ligne" });
    }

    // Vérifier si l'ordre est déjà utilisé
    const existingOrder = await LineStop.findOne({
      where: {
        lineId,
        order
      }
    });

    if (existingOrder) {
      return res.status(400).json({ message: "Cet ordre est déjà utilisé sur la ligne" });
    }

    // Ajouter l'arrêt à la ligne
    await LineStop.create({
      lineId,
      stopId,
      order
    });

    res.status(201).json({ message: "Arrêt ajouté avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'arrêt", error: error.message });
  }
};

/**
 * Modifier une ligne
 */
exports.updateLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, number, color, startActivity, endActivity } = req.body;

    const line = await Line.findByPk(id);
    if (!line) {
      return res.status(404).json({ message: "Ligne non trouvée" });
    }

    await line.update({
      name,
      number,
      color,
      startActivity,
      endActivity
    });

    res.json({ message: "Ligne mise à jour avec succès", line });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la ligne", error: error.message });
  }
};

/**
 * Supprimer un arrêt d'une ligne
 */
exports.deleteStopFromLine = async (req, res) => {
  try {
    const { id: lineId, stopId } = req.params;

    const lineStop = await LineStop.findOne({
      where: {
        lineId,
        stopId
      }
    });

    if (!lineStop) {
      return res.status(404).json({ message: "Arrêt non trouvé sur cette ligne" });
    }

    // Récupérer l'ordre de l'arrêt à supprimer
    const deletedOrder = lineStop.order;

    // Supprimer l'arrêt
    await lineStop.destroy();

    // Mettre à jour l'ordre des arrêts restants
    await LineStop.update(
      { order: sequelize.literal('`order` - 1') },
      {
        where: {
          lineId,
          order: {
            [Op.gt]: deletedOrder
          }
        }
      }
    );

    res.json({ message: "Arrêt supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'arrêt", error: error.message });
  }
}; 