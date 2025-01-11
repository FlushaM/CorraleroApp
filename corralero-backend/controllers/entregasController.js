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
  const { supermercado } = req.user;
  try {
    const entregas = await Entrega.findAll({
      where: { supermercado },
      include: [
        {
          model: Usuario,
          as: 'usuario', // Alias configurado en la asociación
          attributes: ['nombre', 'email'], // Datos que quieres obtener del usuario
        },
      ],
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
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['codigo', 'descripcion'], // Datos que quieres del producto
        },
        {
          model: Entrega,
          as: 'entrega',
          include: [
            {
              model: Usuario,
              as: 'usuario', // Alias configurado en la asociación
              attributes: ['nombre', 'email'], // Datos del usuario
            },
          ],
          attributes: ['responsable', 'supermercado', 'fecha'], // Datos que quieres de Entrega
        },
      ],
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
