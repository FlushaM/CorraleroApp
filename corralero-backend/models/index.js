const sequelize = require('../db');
const Usuario = require('./Usuario');
const Producto = require('./Producto');
const Entrega = require('./Entrega');
const DetalleEntrega = require('./DetalleEntrega');

// Relaciones
Entrega.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
DetalleEntrega.belongsTo(Entrega, { foreignKey: 'id_entrega', as: 'entrega' });
DetalleEntrega.belongsTo(Producto, {
  foreignKey: 'codigo_producto',
  targetKey: 'codigo',
  as: 'producto',
});

// Exportar modelos
module.exports = {
  sequelize,
  Usuario,
  Producto,
  Entrega,
  DetalleEntrega,
};
