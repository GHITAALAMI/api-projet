const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stop = sequelize.define('Stop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  }
}, {
  tableName: 'stops',
  timestamps: true,
  underscored: true
});

module.exports = Stop; 