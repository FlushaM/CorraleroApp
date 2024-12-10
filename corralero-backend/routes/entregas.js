const express = require('express');
const { registrarEntrega, obtenerEntregas, obtenerDetalleEntrega } = require('../controllers/entregasController');
const verifyToken = require('../middlewares/authMiddleware'); // Middleware de autenticación

const router = express.Router();

// Rutas protegidas para las entregas
router.post('/', verifyToken, registrarEntrega); // Crear nueva entrega
router.get('/', verifyToken, obtenerEntregas);   // Obtener todas las entregas
router.get('/:id', verifyToken, obtenerDetalleEntrega); // Obtener detalles de una entrega

module.exports = router;
