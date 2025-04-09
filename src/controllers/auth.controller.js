const jwt = require('jsonwebtoken');
const { User, Op } = require('../models');

/**
 * Inscription d'un utilisateur
 */
exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, isAdmin } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Un utilisateur avec cet email existe déjà"
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      isAdmin
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

/**
 * Connexion d'un utilisateur
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await user.validPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect"
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
  }
}; 