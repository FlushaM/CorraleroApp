require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos'); // Rutas para productos
const entregasRoutes = require('./routes/entregas'); // Rutas para entregas
const authRoutes = require('./routes/auth'); // Rutas de autenticación
const verifyToken = require('./middlewares/authMiddleware'); // Middleware para verificar token

const app = express();

// Middleware global
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON en el cuerpo de las solicitudes

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

// Comprobar conexión con la base de datos
const pool = require('./db');
pool.query('SELECT 1', (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1); // Finaliza el servidor si no puede conectar a la base de datos
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});
