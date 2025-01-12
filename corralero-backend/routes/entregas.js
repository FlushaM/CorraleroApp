const express = require('express');
const {
  registrarEntrega,
  obtenerEntregas,
  obtenerDetalleEntrega,
  marcarRevisado,
  eliminarEntrega,
} = require('../controllers/entregasController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas protegidas para las entregas
router.post('/', verifyToken, registrarEntrega);
router.get('/', verifyToken, obtenerEntregas);
router.get('/:id', verifyToken, obtenerDetalleEntrega);
router.patch('/:id', verifyToken, marcarRevisado); // Marcar entrega como revisada
router.delete('/:id', verifyToken, eliminarEntrega); // Eliminar entrega

module.exports = router;
