const express = require('express');
const { getProductos, getProductoByCodigo } = require('../controllers/productosController');

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/', getProductos);

// Ruta para validar producto por código
router.get('/:codigo', getProductoByCodigo);

module.exports = router;
