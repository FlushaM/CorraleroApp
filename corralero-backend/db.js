const { Pool } = require('pg');
require('dotenv').config(); // Carga las variables de entorno desde un archivo .env

// Configuración de la conexión a PostgreSQL en Neon.tech
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:vJhEZx6y0Vfm@ep-curly-sun-a43l79d4.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones SSL con Neon.tech
  },
});

// Eventos de conexión
pool.on('connect', () => {
  console.log('Conexión exitosa a la base de datos en Neon.tech');
});

pool.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err);
});

// Exportar el pool para usarlo en otros archivos
module.exports = pool;
