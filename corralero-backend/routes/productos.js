const express = require('express');
const { getProductos, getProductoByCodigo } = require('../controllers/productosController');
const verifyToken = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación

const router = express.Router();

// Ruta para obtener todos los productos (puedes decidir si esta es pública o protegida)
router.get('/', verifyToken, getProductos); // Protegida con token

// Ruta para validar producto por código
router.get('/:codigo', verifyToken, getProductoByCodigo); // Protegida con token

module.exports = router;
