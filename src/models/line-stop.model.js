const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LineStop = sequelize.define('LineStop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  lineId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stopId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'line_stops',
  timestamps: true,
  underscored: true
});

module.exports = LineStop; 