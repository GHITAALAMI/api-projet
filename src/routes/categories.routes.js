const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// Routes publiques
router.get('/', categoryController.getAllCategories);
router.get('/:id/lines', categoryController.getLinesByCategory);
router.get('/:id/lines/:id', categoryController.getLineDetails);
router.get('/:id/lines/:id/stops', categoryController.getLineStops);

// Routes protégées (nécessitent une authentification)
router.use(verifyToken);

// Routes nécessitant des privilèges administrateur
router.post('/:id/lines/:id/stops', isAdmin, categoryController.addStopToLine);
router.put('/:id/lines/:id', isAdmin, categoryController.updateLine);
router.delete('/:id/lines/:id/stops/:id', isAdmin, categoryController.deleteStopFromLine);

module.exports = router; 