const { Usuario } = require('../models'); // Importa el modelo de Usuario
const jwt = require('jsonwebtoken');

// Controlador para iniciar sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Por favor, ingrese email y contraseña' });
    }

    try {
        // Buscar usuario por email
        const user = await Usuario.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Validar contraseña
        if (user.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Crear un token JWT con la información del usuario
        const token = jwt.sign(
            { id: user.id_usuario, rol: user.rol, supermercado: user.supermercado },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id_usuario,
                nombre: user.nombre,
                rol: user.rol,
                supermercado: user.supermercado,
            },
        });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

module.exports = { login };
