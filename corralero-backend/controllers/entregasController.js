const pool = require('../db');

// Registrar una nueva entrega
const registrarEntrega = async (req, res) => {
  const { productos } = req.body;
  const { id, supermercado } = req.user; // Extrae información del token JWT

  if (!productos || productos.length === 0) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un producto' });
  }

  try {
    // Obtener el nombre del usuario desde la base de datos
    const userResult = await pool.query('SELECT nombre FROM usuarios WHERE id_usuario = $1', [id]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const nombreResponsable = user.nombre;

    // Insertar la entrega con el nombre del responsable
    const entregaResult = await pool.query(
      'INSERT INTO entregas (fecha, responsable, supermercado) VALUES (NOW(), $1, $2) RETURNING id_entrega',
      [nombreResponsable, supermercado]
    );
    const idEntrega = entregaResult.rows[0].id_entrega;

    // Insertar productos asociados
    for (const producto of productos) {
      const { codigo, kilos } = producto;

      if (!codigo || !kilos) {
        return res.status(400).json({ error: 'Faltan datos en algún producto' });
      }

      await pool.query(
        'INSERT INTO detalle_entrega (id_entrega, codigo_producto, cantidad) VALUES ($1, $2, $3)',
        [idEntrega, codigo, kilos]
      );
    }

    res.status(201).json({ message: 'Entrega registrada correctamente', idEntrega });
  } catch (error) {
    console.error('Error al registrar entrega:', error);
    res.status(500).json({ error: 'Error al registrar entrega' });
  }
};

// Obtener todas las entregas
const obtenerEntregas = async (req, res) => {
  const { supermercado } = req.user; // Filtrar por supermercado del usuario
  try {
    const entregas = await pool.query(
      `
      SELECT id_entrega, fecha, responsable, supermercado
      FROM entregas 
      WHERE supermercado = $1 
      ORDER BY fecha DESC
      `,
      [supermercado]
    );
    res.json(entregas.rows);
  } catch (error) {
    console.error('Error al obtener entregas:', error);
    res.status(500).json({ error: 'Error al obtener entregas' });
  }
};

// Obtener detalles de una entrega específica
const obtenerDetalleEntrega = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El ID de la entrega es requerido' });
  }

  try {
    const detalles = await pool.query(
      `
      SELECT 
        de.codigo_producto, 
        de.cantidad, 
        p.descripcion 
      FROM detalle_entrega de 
      INNER JOIN productos p ON de.codigo_producto = p.codigo 
      WHERE de.id_entrega = $1
      `,
      [id]
    );

    if (detalles.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron detalles para esta entrega' });
    }

    res.json(detalles.rows);
  } catch (error) {
    console.error('Error al obtener detalles de la entrega:', error);
    res.status(500).json({ error: 'Error al obtener detalles de la entrega' });
  }
};

module.exports = { registrarEntrega, obtenerEntregas, obtenerDetalleEntrega };
