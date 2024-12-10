const pool = require('../db');

// Registrar una nueva entrega
const registrarEntrega = async (req, res) => {
    const { productos, responsable } = req.body;
  
    try {
      const entregaResult = await pool.query(
        'INSERT INTO entregas (fecha, responsable) VALUES (NOW(), $1) RETURNING id_entrega',
        [responsable]
      );
      const idEntrega = entregaResult.rows[0].id_entrega;
  
      for (const producto of productos) {
        await pool.query(
          'INSERT INTO detalle_entrega (id_entrega, codigo_producto, cantidad) VALUES ($1, $2, $3)',
          [idEntrega, producto.codigo, producto.kilos]
        );
      }
  
      res.status(201).json({ message: 'Entrega registrada correctamente' });
    } catch (error) {
      console.error('Error al registrar entrega:', error);
      res.status(500).json({ error: 'Error al registrar entrega' });
    }
  };

module.exports = { registrarEntrega };

// Obtener todas las entregas
const obtenerEntregas = async (req, res) => {
    try {
      const entregas = await pool.query('SELECT * FROM entregas ORDER BY fecha DESC');
      res.json(entregas.rows);
    } catch (error) {
      console.error('Error al obtener entregas:', error);
      res.status(500).json({ error: 'Error al obtener entregas' });
    }
  };
  
  // Obtener detalles de una entrega específica
  const obtenerDetalleEntrega = async (req, res) => {
    const { id } = req.params;
    try {
      const detalles = await pool.query(
        'SELECT de.codigo_producto, de.cantidad, p.descripcion FROM detalle_entrega de INNER JOIN productos p ON de.codigo_producto = p.codigo WHERE de.id_entrega = $1',
        [id]
      );
      res.json(detalles.rows);
    } catch (error) {
      console.error('Error al obtener detalles de la entrega:', error);
      res.status(500).json({ error: 'Error al obtener detalles de la entrega' });
    }
  };
  
  module.exports = { obtenerEntregas, obtenerDetalleEntrega };
