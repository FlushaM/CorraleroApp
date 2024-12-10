const pool = require('../db');

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
  try {
    const { supermercado } = req.query; // Filtrar por supermercado si se pasa como query
    const query = supermercado
      ? 'SELECT * FROM productos WHERE supermercado = $1'
      : 'SELECT * FROM productos';
    const valores = supermercado ? [supermercado] : [];
    const resultado = await pool.query(query, valores);
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Agregar un nuevo producto
const agregarProducto = async (req, res) => {
  const { codigo, descripcion, unidad, supermercado } = req.body;
  try {
    const query =
      'INSERT INTO productos (codigo, descripcion, unidad, supermercado) VALUES ($1, $2, $3, $4) RETURNING *';
    const valores = [codigo, descripcion, unidad, supermercado];
    const resultado = await pool.query(query, valores);
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al agregar producto:', error.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { obtenerProductos, agregarProducto };
