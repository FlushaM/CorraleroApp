const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Asegúrate de que apunte a tu configuración de Sequelize

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  supermercado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('admin', 'carnicero', 'verdulero', 'roticeria'),
    allowNull: false,
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
});

module.exports = Usuario;
