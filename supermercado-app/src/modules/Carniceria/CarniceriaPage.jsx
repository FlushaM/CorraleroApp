import React, { useState } from 'react';
import axios from 'axios';

const CarniceriaPage = () => {
  const [codigo, setCodigo] = useState('');
  const [kilos, setKilos] = useState('');
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const validarProducto = async () => {
    if (!codigo || !kilos || parseFloat(kilos) <= 0) {
      setError('Por favor, ingresa un código válido y una cantidad mayor a 0.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/productos/${codigo}`);
      if (response.data.valido) {
        const nuevoProducto = { ...response.data.producto, kilos: parseFloat(kilos) };
        setProductos([...productos, nuevoProducto]);
        setCodigo('');
        setKilos('');
        setError('');
      } else {
        setError('Código inválido');
      }
    } catch (error) {
      console.error('Error al validar producto:', error);
      setError('Error al validar producto');
    }
  };

  const eliminarProducto = (codigo) => {
    const nuevaLista = productos.filter((producto) => producto.codigo !== codigo);
    setProductos(nuevaLista);
  };

  const abrirModalEdicion = (producto) => {
    setProductoEditando(producto);
    setKilos(producto.kilos);
    setIsModalOpen(true);
  };

  const guardarEdicion = () => {
    const nuevaLista = productos.map((producto) =>
      producto.codigo === productoEditando.codigo ? { ...producto, kilos: parseFloat(kilos) } : producto
    );
    setProductos(nuevaLista);
    setProductoEditando(null);
    setIsModalOpen(false);
    setKilos('');
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setProductoEditando(null);
    setKilos('');
  };

  const enviarEntrega = async () => {
    if (productos.length === 0) {
      alert('No hay productos en la lista para enviar.');
      return;
    }

    const responsable = 'Juan Pérez'; // Puedes reemplazarlo con un campo dinámico

    try {
      const response = await axios.post('http://localhost:5000/api/entregas', {
        productos,
        responsable,
      });
      alert('Entrega enviada correctamente');
      setProductos([]); // Limpia la lista de productos después de enviar
    } catch (error) {
      console.error('Error al enviar la entrega:', error);
      alert('Error al enviar la entrega');
    }
  };

  return (
    <div>
      <h1>Carnicería</h1>
      <div>
        <input
          type="text"
          placeholder="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <input
          type="number"
          placeholder="Kilos"
          value={kilos}
          onChange={(e) => setKilos(e.target.value)}
        />
        <button onClick={validarProducto}>Agregar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Descripción</th>
            <th>Kilos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.codigo}</td>
              <td>{producto.descripcion}</td>
              <td>{`${producto.kilos} kg`}</td>
              <td>
                <button onClick={() => abrirModalEdicion(producto)}>Modificar</button>
                <button onClick={() => eliminarProducto(producto.codigo)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        style={{
          marginTop: '20px',
          backgroundColor: 'green',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={enviarEntrega}
      >
        Enviar Entrega
      </button>

      {/* Modal para edición */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
            zIndex: 1000,
          }}
        >
          <h2>Editar Producto</h2>
          <p>{`Código: ${productoEditando.codigo}`}</p>
          <p>{`Descripción: ${productoEditando.descripcion}`}</p>
          <input
            type="number"
            placeholder="Kilos"
            value={kilos}
            onChange={(e) => setKilos(e.target.value)}
          />
          <button onClick={guardarEdicion}>Guardar</button>
          <button onClick={cerrarModal} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default CarniceriaPage;



