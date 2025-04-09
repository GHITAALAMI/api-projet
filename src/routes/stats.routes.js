const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(verifyToken);

// Routes pour les statistiques de distance
router.get('/distance/stops/:id1/:id2', statsController.getDistanceBetweenStops);
router.get('/distance/lines/:id', statsController.getLineDistance);

module.exports = router; 