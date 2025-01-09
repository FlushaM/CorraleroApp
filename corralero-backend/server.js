require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos'); // Rutas para productos
const entregasRoutes = require('./routes/entregas'); // Rutas para entregas
const authRoutes = require('./routes/auth'); // Rutas de autenticación
const verifyToken = require('./middlewares/authMiddleware'); // Middleware para verificar token
const pool = require('./db'); // Importar configuración de la base de datos

const app = express();

// Middleware global
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON en el cuerpo de las solicitudes

// Verificar conexión a la base de datos
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Error en la conexión a la base de datos:', err);
        process.exit(1); // Finaliza el servidor si no puede conectar a la base de datos
    } else {
        console.log('Conexión exitosa. Hora actual:', result.rows[0]);
    }
});

// Rutas públicas
app.use('/api/auth', authRoutes); // Login y autenticación

// Rutas protegidas por JWT
app.use('/api/productos', verifyToken, productosRoutes); // Rutas para productos
app.use('/api/entregas', verifyToken, entregasRoutes); // Rutas para entregas

// Conexión con el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
