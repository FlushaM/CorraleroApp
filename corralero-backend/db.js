const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // Reemplaza 'postgres' si usas otro usuario
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Corralerodb', // Asegúrate de que coincida con tu base de datos
  password: process.env.DB_PASSWORD || '123', // Si tienes contraseña, añádela aquí
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos');
});

pool.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err);
});

module.exports = pool;
