const { Producto } = require('../models');

// Obtener todos los productos
const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Validar producto por código
const getProductoByCodigo = async (req, res) => {
    const { codigo } = req.params;
    try {
        const producto = await Producto.findOne({ where: { codigo } });
        if (producto) {
            res.json({ valido: true, producto });
        } else {
            res.status(404).json({ valido: false, message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al buscar producto:', error);
        res.status(500).json({ error: 'Error al buscar producto' });
    }
};

module.exports = { getProductos, getProductoByCodigo };
