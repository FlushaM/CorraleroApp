import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [entregas, setEntregas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [entregaSeleccionada, setEntregaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/entregas');
        setEntregas(response.data);
      } catch (error) {
        console.error('Error al obtener entregas:', error);
      }
    };

    fetchEntregas();
  }, []);

  const verDetalles = async (idEntrega) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/entregas/${idEntrega}`);
      setDetalles(response.data);
      setEntregaSeleccionada(idEntrega);
    } catch (error) {
      console.error('Error al obtener detalles de la entrega:', error);
    }
  };

  const exportarExcel = () => {
    // Lógica para exportar a Excel (puedes usar bibliotecas como xlsx)
    alert('Exportar a Excel: en desarrollo');
  };

  return (
    <div>
      <h1>Dashboard del Administrador</h1>
      <table>
        <thead>
          <tr>
            <th>ID Entrega</th>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entregas.map((entrega) => (
            <tr key={entrega.id_entrega}>
              <td>{entrega.id_entrega}</td>
              <td>{new Date(entrega.fecha).toLocaleString()}</td>
              <td>{entrega.responsable}</td>
              <td>
                <button onClick={() => verDetalles(entrega.id_entrega)}>Ver Detalles</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {entregaSeleccionada && (
        <div>
          <h2>Detalles de la Entrega #{entregaSeleccionada}</h2>
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descripción</th>
                <th>Kilos</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.codigo_producto}</td>
                  <td>{detalle.descripcion}</td>
                  <td>{detalle.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={exportarExcel}>Exportar a Excel</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
