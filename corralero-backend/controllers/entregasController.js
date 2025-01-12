const { Entrega, DetalleEntrega, Usuario, Producto } = require('../models');

// Registrar una nueva entrega
const registrarEntrega = async (req, res) => {
    const { productos } = req.body;
    const { id, supermercado } = req.user;

    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un producto' });
    }

    try {
        // Verificar que todos los productos pertenezcan al supermercado del usuario
        for (const producto of productos) {
            const productoValido = await Producto.findOne({
                where: {
                    codigo: producto.codigo,
                    supermercado, // Validar que el producto pertenezca al supermercado del usuario
                },
            });

            if (!productoValido) {
                return res.status(400).json({
                    error: `El producto con código ${producto.codigo} no pertenece al supermercado ${supermercado}`,
                });
            }
        }

        // Crear la entrega
        const entrega = await Entrega.create({
            responsable: req.user.nombre, // Usar el nombre del usuario autenticado
            supermercado,
            id_usuario: id, // ID del usuario autenticado
        });

        // Crear los detalles de la entrega
        const detalles = productos.map(({ codigo, kilos }) => ({
            id_entrega: entrega.id_entrega,
            codigo_producto: codigo,
            cantidad: kilos,
            supermercado,
        }));

        await DetalleEntrega.bulkCreate(detalles);

        res.status(201).json({
            message: 'Entrega registrada correctamente',
            idEntrega: entrega.id_entrega,
        });
    } catch (error) {
        console.error('Error al registrar entrega:', error);
        res.status(500).json({ error: 'Error al registrar entrega' });
    }
};

// Obtener todas las entregas
const obtenerEntregas = async (req, res) => {
    const { supermercado } = req.user;
    try {
        const entregas = await Entrega.findAll({
            where: { supermercado },
            order: [['fecha', 'DESC']],
        });
        res.json(entregas);
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
        const detalles = await DetalleEntrega.findAll({
            where: { id_entrega: id },
            include: {
                model: Producto,
                as: 'producto', // Alias definido en la relación
                attributes: ['descripcion'], // Seleccionar solo la columna necesaria
            },
        });

        if (detalles.length === 0) {
            return res.status(404).json({ error: 'No se encontraron detalles para esta entrega' });
        }

        res.json(detalles);
    } catch (error) {
        console.error('Error al obtener detalles de la entrega:', error);
        res.status(500).json({ error: 'Error al obtener detalles de la entrega' });
    }
};

module.exports = { registrarEntrega, obtenerEntregas, obtenerDetalleEntrega };
