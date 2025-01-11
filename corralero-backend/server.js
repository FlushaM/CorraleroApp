require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Importar conexión y modelos
const productosRoutes = require('./routes/productos');
const entregasRoutes = require('./routes/entregas');
const authRoutes = require('./routes/auth');
const verifyToken = require('./middlewares/authMiddleware');

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Sincronizar modelos con la base de datos
(async () => {
  try {
    await sequelize.sync(); // Sincronizar sin alterar datos existentes
    console.log('Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
    process.exit(1);
  }
})();

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas por JWT
app.use('/api/productos', verifyToken, productosRoutes);
app.use('/api/entregas', verifyToken, entregasRoutes);

// Conexión con el puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
