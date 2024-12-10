const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extrae solo el token
    if (!token) {
        console.log('Token no proporcionado.');
        return res.status(403).json({ error: 'Token requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decodificado:', decoded);
        req.user = decoded; // Adjunta los datos del usuario a `req`
        next();
    } catch (error) {
        console.error('Token inválido o expirado:', error);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = verifyToken;
