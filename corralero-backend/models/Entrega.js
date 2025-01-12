const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Usuario = require('./Usuario');

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
      model: Usuario,
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
  estado: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'pendiente', // Estados posibles: 'pendiente', 'revisado'
},

}, {
  tableName: 'entregas',
  timestamps: false,
});

module.exports = Entrega;
