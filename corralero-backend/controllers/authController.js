const pool = require('../db');
const jwt = require('jsonwebtoken');

// Controlador para iniciar sesión
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Por favor, ingrese email y contraseña' });
    }

    try {
        // Buscar usuario por email
        const userResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        const user = userResult.rows[0];

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

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'No se proporcionó un token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adjuntar datos del usuario al objeto req
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = {
    login,
    verificarToken,
};
