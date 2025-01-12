const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Entrega = require('./Entrega');
const Producto = require('./Producto');

const DetalleEntrega = sequelize.define('DetalleEntrega', {
  id_detalle: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_entrega: {
    type: DataTypes.INTEGER,
    references: {
      model: Entrega,
      key: 'id_entrega',
    },
  },
  codigo_producto: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  supermercado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
}, {
  tableName: 'detalle_entrega',
  timestamps: false,
});
// Relación con Producto
DetalleEntrega.belongsTo(Producto, {
  foreignKey: 'codigo_producto',
  targetKey: 'codigo', // Esto asegura que usamos 'codigo' de Producto
  as: 'producto', // Alias
});

module.exports = DetalleEntrega;
