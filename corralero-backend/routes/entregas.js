const express = require('express');
const { registrarEntrega,obtenerEntregas, obtenerDetalleEntrega } = require('../controllers/entregasController');

const router = express.Router();

// Ruta para registrar una nueva entrega
router.post('/', registrarEntrega);
// Ruta para obtener todas las entregas
router.get('/', obtenerEntregas);

// Ruta para obtener detalles de una entrega específica
router.get('/:id', obtenerDetalleEntrega);

module.exports = router;
