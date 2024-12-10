const pool = require('../db');

// Obtener todos los productos
const getProductos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Validar producto por código
const getProductoByCodigo = async (req, res) => {
  const { codigo } = req.params;
  try {
    const result = await pool.query('SELECT * FROM productos WHERE codigo = $1', [codigo]);
    if (result.rows.length > 0) {
      res.json({ valido: true, producto: result.rows[0] });
    } else {
      res.status(404).json({ valido: false, message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar producto' });
  }
};

module.exports = {
  getProductos,
  getProductoByCodigo,
};
