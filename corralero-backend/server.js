const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos');
const entregasRoutes = require('./routes/entregas');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', productosRoutes);
app.use('/api/entregas', entregasRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
