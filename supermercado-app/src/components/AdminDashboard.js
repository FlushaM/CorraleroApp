import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const AdminDashboard = () => {
  const [entregas, setEntregas] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [entregaSeleccionada, setEntregaSeleccionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Token desde localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/entregas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEntregas(response.data);
      } catch (error) {
        console.error("Error al obtener entregas:", error);
      }
    };

    fetchEntregas();
  }, [token]);

  const verDetalles = async (idEntrega) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/entregas/${idEntrega}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDetalles(response.data);
      setEntregaSeleccionada(idEntrega);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener detalles de la entrega:", error);
    }
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setDetalles([]);
    setEntregaSeleccionada(null);
  };

  const exportarExcel = () => {
    if (!detalles || detalles.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(detalles);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DetallesEntrega");

    const nombreArchivo = `Entrega_${entregaSeleccionada}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);
    alert("Archivo descargado");
  };

  return (
    <div>
      <h1>Dashboard del Administrador</h1>
      <table border="1" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>ID Entrega</th>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Supermercado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entregas.map((entrega) => (
            <tr key={entrega.id_entrega}>
              <td>{entrega.id_entrega}</td>
              <td>{new Date(entrega.fecha).toLocaleString()}</td>
              <td>{entrega.responsable}</td>
              <td>{entrega.supermercado}</td>
              <td>
                <button
                  onClick={() => verDetalles(entrega.id_entrega)}
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
            zIndex: 1000,
          }}
        >
          <h2>Detalles de la Entrega #{entregaSeleccionada}</h2>
          <table border="1" style={{ width: "100%", textAlign: "center" }}>
            <thead>
              <tr>
                <th>Código Producto</th>
                <th>Descripción</th>
                <th>Cantidad (Kilos)</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle, index) => (
                <tr key={index}>
                  <td>{detalle.codigo_producto}</td>
                  <td>{detalle.descripcion}</td>
                  <td>{detalle.cantidad} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={exportarExcel}
            style={{
              marginTop: "20px",
              backgroundColor: "green",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Exportar a Excel
          </button>
          <button
            onClick={cerrarModal}
            style={{
              marginTop: "20px",
              backgroundColor: "red",
              color: "white",
              padding: "10px",
              border: "none",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

