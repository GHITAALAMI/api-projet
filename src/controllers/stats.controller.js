const { Stop, Line, LineStop } = require('../models');
const { calculateDistance, calculateRouteDistance } = require('../utils/distance.util');

/**
 * Calculer la distance entre deux arrêts
 */
exports.getDistanceBetweenStops = async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    // Récupérer les deux arrêts
    const stop1 = await Stop.findByPk(id1);
    const stop2 = await Stop.findByPk(id2);

    if (!stop1 || !stop2) {
      return res.status(404).json({ message: "Un ou les deux arrêts n'ont pas été trouvés" });
    }

    // Calculer la distance
    const distance = calculateDistance(
      stop1.latitude,
      stop1.longitude,
      stop2.latitude,
      stop2.longitude
    );

    res.json({
      distance,
      unit: 'kilometers',
      stops: {
        from: stop1.name,
        to: stop2.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du calcul de la distance", error: error.message });
  }
};

/**
 * Calculer la distance totale d'une ligne
 */
exports.getLineDistance = async (req, res) => {
  try {
    const { id } = req.params;

    // Récupérer tous les arrêts de la ligne dans l'ordre
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

    // Calculer la distance totale
    const distance = calculateRouteDistance(stops);

    res.json({
      distance,
      unit: 'kilometers',
      lineId: id,
      stopsCount: stops.length
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du calcul de la distance de la ligne", error: error.message });
  }
}; 