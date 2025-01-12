const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ error: 'No se proporcionó un token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Usuario.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        req.user = {
            id: user.id_usuario,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            supermercado: user.supermercado,
        };

        next();
    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(403).json({ error: 'Token inválido' });
    }
};

module.exports = verifyToken;
