const { Entrega, DetalleEntrega, Usuario, Producto } = require('../models');

// Registrar una nueva entrega
const registrarEntrega = async (req, res) => {
    const { productos } = req.body;
    const { id, supermercado } = req.user;

    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: 'Debe proporcionar al menos un producto' });
    }

    try {
        const user = await Usuario.findByPk(id);

        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Verificar que todos los productos pertenezcan al supermercado del usuario
        const codigosProductos = productos.map((p) => p.codigo);
        const productosValidos = await Producto.findAll({
            where: {
                codigo: codigosProductos,
                supermercado, // Validar que los productos pertenezcan al supermercado del usuario
            },
        });

        if (productosValidos.length !== productos.length) {
            return res.status(400).json({ error: 'Uno o más productos no pertenecen a tu supermercado.' });
        }

        // Crear la entrega
        const entrega = await Entrega.create({
            responsable: user.nombre,
            supermercado,
            id_usuario: user.id_usuario,
        });

        // Crear los detalles de la entrega
        const detalles = productos.map(({ codigo, kilos }) => ({
            id_entrega: entrega.id_entrega,
            codigo_producto: codigo,
            cantidad: kilos,
            supermercado,
        }));

        await DetalleEntrega.bulkCreate(detalles);

        res.status(201).json({ message: 'Entrega registrada correctamente', idEntrega: entrega.id_entrega });
    } catch (error) {
        console.error('Error al registrar entrega:', error);
        res.status(500).json({ error: 'Error al registrar entrega' });
    }
};

// Obtener todas las entregas
const obtenerEntregas = async (req, res) => {
    const { supermercado, rol } = req.user;
    try {
        const whereCondition = rol === 'admin' ? {} : { supermercado };
        const entregas = await Entrega.findAll({
            where: whereCondition,
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
                as: 'producto', // Alias definido en el modelo
                attributes: ['descripcion'], // Selecciona únicamente la columna 'descripcion'
            },
        });

        if (detalles.length === 0) {
            return res.status(404).json({ error: 'No se encontraron detalles para esta entrega' });
        }

        // Formatear los datos para el frontend
        const detallesFormateados = detalles.map((detalle) => ({
            codigo_producto: detalle.codigo_producto,
            descripcion: detalle.producto ? detalle.producto.descripcion : 'Sin descripción',
            cantidad: detalle.cantidad,
        }));

        res.json(detallesFormateados);
    } catch (error) {
        console.error('Error al obtener detalles de la entrega:', error);
        res.status(500).json({ error: 'Error al obtener detalles de la entrega' });
    }
};

const marcarRevisado = async (req, res) => {
    const { id } = req.params;
    try {
        const entrega = await Entrega.findByPk(id);
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega no encontrada' });
        }
        entrega.estado = 'revisado';
        await entrega.save();
        res.json({ message: 'Entrega marcada como revisada' });
    } catch (error) {
        console.error('Error al marcar como revisado:', error);
        res.status(500).json({ error: 'Error al marcar como revisado' });
    }
};

const eliminarEntrega = async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar si la entrega existe
        const entrega = await Entrega.findByPk(id);
        if (!entrega) {
            return res.status(404).json({ error: 'Entrega no encontrada' });
        }

        // Eliminar los detalles asociados
        await DetalleEntrega.destroy({ where: { id_entrega: id } });

        // Eliminar la entrega
        await entrega.destroy();

        res.json({ message: 'Entrega eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar entrega:', error);
        res.status(500).json({ error: 'Error al eliminar entrega' });
    }
};


module.exports = { registrarEntrega, obtenerEntregas, obtenerDetalleEntrega ,marcarRevisado,eliminarEntrega};
