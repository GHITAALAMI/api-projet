const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware pour vérifier le token JWT
 */
const verifyToken = (req, res, next) => {
  // Récupérer le token du header Authorization
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: "Authentification requise" });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est un administrateur
 * Doit être utilisé après verifyToken
 */
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'utilisateur est administrateur en utilisant le champ isAdmin
    if (!user.isAdmin) { 
      return res.status(403).json({ message: "Accès refusé. Privilèges administrateur requis" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  verifyToken,
  isAdmin
}; 