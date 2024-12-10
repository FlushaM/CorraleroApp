const express = require('express');
const { obtenerProductos, agregarProducto } = require('../controllers/productosController');
const router = express.Router();

router.get('/', obtenerProductos); // Obtener todos los productos
router.post('/', agregarProducto); // Agregar un nuevo producto

module.exports = router;
