const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const DetalleEntrega = require('./DetalleEntrega'); // Importa el modelo
const Usuario = require('./Usuario'); // Importa el modelo Usuario

const Entrega = sequelize.define('Entrega', {
  id_entrega: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario, // Relación con Usuario
      key: 'id_usuario',
    },
  },
  supermercado: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  responsable: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'entregas',
  timestamps: false,
});

// Relación con DetalleEntrega
Entrega.hasMany(DetalleEntrega, {
  foreignKey: 'id_entrega',
  as: 'detalles', // Alias para acceder a los detalles desde Entrega
});

// Relación con Usuario
Entrega.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario', // Alias para acceder al usuario desde Entrega
});

module.exports = Entrega;
