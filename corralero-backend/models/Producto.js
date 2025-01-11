const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  unidad: {
    type: DataTypes.ENUM('kg', 'unid'),
    allowNull: false,
  },
  supermercado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'productos',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['codigo', 'supermercado'], // Clave única compuesta
    },
  ],
});

module.exports = Producto;
